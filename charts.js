/* frontend JS for the charts on the live site */

const CHART_COLORS = ['#1d6996','#edad08','#73af48','#94346e','#38a6a5','#e17c05'];

function formatPct(p) {
  return Intl.NumberFormat("en-US", { style: "percent"}).format(p);
}

function formatLabel(marketName, siteName) {
  return marketName ? `${marketName} (${siteName})` : siteName;
}

function mostRecentPoint(dataset) {
  let result;
  for (const p of dataset.data) {
    if (result == null || p.x > result.x) {
      result = p;
    }
  }
  return result;
}

// Interaction mode to get the most recent point to the left of the hover;
// see https://www.chartjs.org/docs/latest/configuration/interactions.html
function priorXInteractionMode(chart, e, options, useFinalPosition) {
  const items = [];
  const metasets = chart.getSortedVisibleDatasetMetas();
  const position = Chart.helpers.getRelativePosition(e, chart);

  // Make sure we don't get points when you hover mouse off the left edge
  const dataX = chart.scales.x.getValueForPixel(position.x);
  if (dataX < chart.scales.x.min) {
    return [];
  }

  for (let i = 0, ilen = metasets.length; i < ilen; ++i) {
    const { index, data } = metasets[i];
    // Binary search the location of the hovered x value in the dataset
    const { lo, hi } = Chart.helpers._lookupByKey(data, 'x', position.x)
    const prev = lo - 1;
    if (prev >= 0) {
      items.push({ datasetIndex: i, index: prev, element: data[prev] })
    }
  }
  return items;
};

function extractLatestData(markets) {
  return markets.map(market => {
    const lastPoint = market.points[market.points.length - 1];
    return {
      id: market.id,
      name: market.name,
      site: market.site,
      latestTimestamp: new Date(lastPoint.x),
      latestProbability: parseFloat((lastPoint.y * 100).toFixed(2)),
    };
  });
}

function extractMonthlyData(markets) {
  return markets.map(market => {
    const monthlyData = {};
    const sortedPoints = market.points.slice().sort((a, b) => a.x - b.x);
    const latestDate = new Date(sortedPoints[sortedPoints.length - 1].x);

    for (let month = latestDate.getMonth(); month >= 0; month--) {
      const targetDate = new Date(latestDate.getFullYear(), month, 1);
      let closestPoint = null;
      let closestDistance = Number.MAX_VALUE;

      for (const point of sortedPoints) {
        const pointDate = new Date(point.x);
        const distance = Math.abs(targetDate - pointDate);

        if (distance <= 2 * 24 * 60 * 60 * 1000 && distance < closestDistance) {
          closestPoint = point;
          closestDistance = distance;
        }
      }

      if (closestPoint) {
        monthlyData[`${targetDate.getMonth() + 1}-1`] = parseFloat((closestPoint.y * 100).toFixed(2));
      }
    }

    return {
      id: market.id,
      monthlyData,
    };
  });
}

function calculateMedians(latestData, monthlyData) {
  const latestProbabilities = latestData.map(data => data.latestProbability);
  const medians = {
    latest: median(latestProbabilities),
  };

  const allMonthlyKeys = [...new Set(monthlyData.flatMap(data => Object.keys(data.monthlyData)))];
  for (const key of allMonthlyKeys) {
    const monthlyProbabilities = monthlyData.map(data => data.monthlyData[key]).filter(Boolean);
    medians[key] = median(monthlyProbabilities);
  }

  return medians;
}

function median(values) {
  const sorted = values.slice().sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

function createHeadline(medians) {
  const latestMedian = medians.latest;
  const latestMonthKey = Object.keys(medians).filter(key => key !== "latest").pop();
  const latestMonthDate = new Date(new Date().getFullYear(), parseInt(latestMonthKey.split('-')[0]) - 1);
  const monthName = latestMonthDate.toLocaleString('default', { month: 'long' });
  const startOfMonthMedian = medians[latestMonthKey];
  const percentagePointChange = (latestMedian - startOfMonthMedian).toFixed(2);
  return `${latestMedian}%, ${percentagePointChange} points this month from ${startOfMonthMedian}% (start of ${monthName})`;
}

async function fetchChartDatasets(jsonUrl) {
  const res = await fetch(jsonUrl);
  const markets = await res.json();

  // Extract latest data and monthly data
  const latestData = extractLatestData(markets);
  const monthlyData = extractMonthlyData(markets);

  // Calculate medians
  const medians = calculateMedians(latestData, monthlyData);

  // Create headline
  const headline = createHeadline(medians);

  // Return datasets along with the additional data
  return {
    datasets: markets.map((mkt, i) => ({
      label: formatLabel(mkt.name, mkt.site),
      name: mkt.name,
      site: mkt.site,
      url: mkt.url,
      data: mkt.points,
      borderWidth: 2,
      borderColor: CHART_COLORS[i],
      backgroundColor: CHART_COLORS[i]
    })),
    latestData,
    monthlyData,
    medians,
    headline,
  };
}

function createTable(latestData, monthlyData) {
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  // Create headers
  const headerRow = document.createElement('tr');
  headerRow.innerHTML = '<th>ID</th><th>Latest</th>';
  for (let i = new Date().getMonth(); i >= 0; i--) {
    const monthName = new Date(new Date().getFullYear(), i).toLocaleString('default', { month: 'long' });
    headerRow.innerHTML += `<th>${monthName} 1</th>`;
  }
  thead.appendChild(headerRow);

  // Create rows for each market
  latestData.forEach((data, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${data.id}</td><td>${data.latestProbability}%</td>`;
    for (let i = new Date().getMonth(); i >= 0; i--) {
      const key = `${i + 1}-1`;
      const monthlyProbability = monthlyData[index].monthlyData[key] || '-';
      row.innerHTML += `<td>${monthlyProbability}%</td>`;
    }
    tbody.appendChild(row);
  });

  table.appendChild(thead);
  table.appendChild(tbody);
  return table;
}

function buildChart(container, { datasets, latestData, monthlyData, medians, headline }) {
  // Display headline
  console.log("Creating headline:", headline);
  const headlineElement = document.createElement('h3');
  headlineElement.textContent = headline;
  container.insertBefore(headlineElement, container.firstChild);

  // Create and display the table
  console.log("Creating table with latestData:", latestData, "monthlyData:", monthlyData); // Debug log
  const tableElement = createTable(latestData, monthlyData);
  container.insertBefore(tableElement, container.firstChild);

  const canvas = container.querySelector(".chart");
  const legend = container.querySelector(".legend");
  const startDate = container.dataset.from;
  let hoverState = undefined;
  new Chart(canvas, {
    type: 'line',
    data: { datasets },
    plugins: [{
      // Tracks the hover state for the tooltip and vertical cursor
      beforeEvent: (chart, args) => {
        const event = args.event;
        if (event.type === 'mousemove') {
          const canvasPosition = Chart.helpers.getRelativePosition(event, chart);
          const dataX = chart.scales.x.getValueForPixel(canvasPosition.x);
          const dataY = chart.scales.y.getValueForPixel(canvasPosition.y);
          if (dataX >= chart.scales.x.min) {
            hoverState = { canvasPosition, data: { x: dataX, y: dataY } };
          }
        }
      },
      // Draws the vertical cursor on hover, via https://stackoverflow.com/a/68140000
      afterDraw: (chart) => {
        if (chart.tooltip?._active?.length && hoverState) {
          const x = hoverState.canvasPosition.x;
          const yAxis = chart.scales.y;
          const ctx = chart.ctx;
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(x, yAxis.top);
          ctx.lineTo(x, yAxis.bottom);
          ctx.lineWidth = 1;
          ctx.strokeStyle = 'rgba(0, 0, 255, 0.4)';
          ctx.stroke();
          ctx.restore();
        }
      },
      // Draws the legend, see https://www.chartjs.org/docs/latest/samples/legend/html.html
      afterUpdate: (chart, args, options) => {
        // Order the datasets for display in the legend by their rightmost points
        const sorted = datasets.toSorted((a, b) => mostRecentPoint(b).y - mostRecentPoint(a).y);
        const listItems = sorted.map(dataset => {
          const li = document.createElement('li');
          const box = document.createElement('span');
          box.className = "color-box";
          box.style.background = dataset.backgroundColor;
          box.style.borderColor = dataset.borderColor;
          box.style.borderWidth = '1px';
          const text = document.createElement('span');
          text.style.color = dataset.backgroundColor;
          if (dataset.name) { // We will show "name (<a>site</a>)"
            const link = document.createElement('a');
            link.href = dataset.url;
            link.target = "_blank" // Open in new tab
            link.append(dataset.site);
            text.append(dataset.name, ' (', link, ')');
          } else { // We will show "<a>site</a>"
            const link = document.createElement('a');
            link.href = dataset.url;
            link.target = "_blank" // Open in new tab
            link.append(dataset.site);
            text.append(link);
          }
          li.append(box, text);
          return li;
        });
        legend.replaceChildren(...listItems);
      }
    }],
    options: {
      maintainAspectRatio: false,
      interaction: { mode: 'priorX', intersect: false },
      plugins: {
        legend: { display: false }, // Our custom legend plugin drawing will do it
        tooltip: {
          itemSort: (a, b) => b.parsed.y - a.parsed.y,
          callbacks: {
            title: (items) => new Date(hoverState.data.x).toDateString(),
            label: (item) => {
              const { dataset } = item;
              return `${dataset.label}: ${formatPct(item.parsed.y)}`;
            }
          }
        }
      },
      elements: { point: { radius: 0 } },
      scales: {
        x: {
          type: 'time',
          min: startDate ?? "2023-01-01",
          grid: { drawOnChartArea: false }
        },
        y: { ticks: { callback: formatPct } }
      }
    }
  });
}
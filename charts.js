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

// interaction mode to get the most recent point to the left of the hover;
// see https://www.chartjs.org/docs/latest/configuration/interactions.html
function priorXInteractionMode(chart, e, options, useFinalPosition) {
  const items = [];
  const metasets = chart.getSortedVisibleDatasetMetas();
  const position = Chart.helpers.getRelativePosition(e, chart);

  // make sure we don't get points when you hover mouse off the left edge
  const dataX = chart.scales.x.getValueForPixel(position.x);
  if (dataX < chart.scales.x.min) {
    return [];
  }

  for (let i = 0, ilen = metasets.length; i < ilen; ++i) {
    const { index, data } = metasets[i];
    // binary search the location of the hovered x value in the dataset
    const { lo, hi } = Chart.helpers._lookupByKey(data, 'x', position.x)
    const prev = lo - 1;
    if (prev >= 0) {
      items.push({ datasetIndex: i, index: prev, element: data[prev] })
    }
  }
  return items;
};

async function fetchChartDatasets(jsonUrl) {
  const res = await fetch(jsonUrl);
  const markets = await res.json();
  return markets.map((mkt, i) => ({
    label: formatLabel(mkt.name, mkt.site),
    // name, site, url aren't native chartjs things, we use them for legend formatting
    name: mkt.name, 
    site: mkt.site,
    url: mkt.url,
    data: mkt.points,
    borderWidth: 2,
    borderColor: CHART_COLORS[i],
    backgroundColor: CHART_COLORS[i]
  }))
}

function buildChart(container, datasets) {
  const canvas = container.querySelector(".chart");
  const legend = container.querySelector(".legend");
  const startDate = container.dataset.from;
  let hoverState = undefined;
  new Chart(canvas, {
    type: 'line',
    data: { datasets },
    plugins: [{
      // tracks the hover state for the tooltip and vertical cursor
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
      // draws the vertical cursor on hover, via https://stackoverflow.com/a/68140000
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
      // draws the legend, see https://www.chartjs.org/docs/latest/samples/legend/html.html
      afterUpdate: (chart, args, options) => {
        // order the datasets for display in the legend by their rightmost points
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
          if (dataset.name) { // we will show "name (<a>site</a>)"
            const link = document.createElement('a');
            link.href = dataset.url;
            link.target = "_blank" // open in new tab
            link.append(dataset.site);
            text.append(dataset.name, ' (', link, ')');
          } else { // we will show "<a>site</a>"
            const link = document.createElement('a');
            link.href = dataset.url;
            link.target = "_blank" // open in new tab
            link.append(dataset.site);
            text.append(link);
          }
          li.append(box, text);
          return li
        });
        legend.replaceChildren(...listItems)
      }
    }],
    options: {
      maintainAspectRatio: false,
      interaction: { mode: 'priorX', intersect: false },
      plugins: {
        legend: { display: false }, // our custom legend plugin drawing will do it
        tooltip: {
          itemSort: (a, b) => b.parsed.y - a.parsed.y,
          callbacks: {
            title: (items) => new Date(hoverState.data.x).toDateString(),
            label: (item) => {
              const { dataset } = item;
              return `${dataset.label}: ${formatPct(item.parsed.y)}`
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
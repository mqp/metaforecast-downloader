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
    id: mkt.id,
    borderWidth: 2,
    borderColor: CHART_COLORS[i],
    backgroundColor: CHART_COLORS[i]
  }))
}
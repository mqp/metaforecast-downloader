import { fetchAll, writeJSONOutput } from './helpers.js';

const markets = [
{ name: "Iran gets nukes by 2030?", id: "metaculus-5253" },
{ name: "China ≥1k nukes by 2030?", id: "metaculus-19554" },
{ name: "New nuclear state by 2030?", id: "metaculus-15537" },
{ name: "Non-state actor gets nukes by 2030?", id: "metaculus-8614" },
{ name: "Major nuclear accident by 2030?", id: "metaculus-6378" },
{ name: "Nuke detonated (non-test) by 2035?", id: "metaculus-3150" },
];

function getPoint(id, historyItem) {
  for (const option of historyItem.options) {
    if ((id === "metaculus-2797") && option.name === 'No') {
      return { x: historyItem.fetched * 1000, y: option.probability };
    } else if (id === 'metaculus-3150' && option.name === 'Yes') {
      return { x: historyItem.fetched * 1000, y: 1 - option.probability };
    } else if (id !== "metaculus-2797" && option.name === 'Yes') {
      return { x: historyItem.fetched * 1000, y: option.probability };
    }
  }
      // Log if 'Yes' option is not found
      console.log(`'Yes' option not found for ${id} at ${historyItem.fetched}`);
      return null; // Explicitly return null if 'Yes' is not found
}

//fetchAll(markets, getPoint).then((data) => writeJSONOutput("Nuclear2.json", data));

fetchAll(markets, getPoint).then((data) => {
  // Filter out nulls before saving
  const cleanedData = data.map(market => ({
    ...market,
    points: market.points.filter(point => point !== null)
  }));
  writeJSONOutput("Nuclear2.json", cleanedData);
});
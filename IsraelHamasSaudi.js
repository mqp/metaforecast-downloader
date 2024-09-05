import { fetchAll, writeJSONOutput } from './helpers.js';

const markets = [
//  { name: "by Oct?", id: "goodjudgmentopen-2617" },
//  { name: "Normalised relations by Sept?", id: "goodjudgmentopen-2976" },
  { name: "Establish relations in 2024?", id: "manifold-7LxcLPJKi3jA86XghgQE" },
  { name: "Establish relations by Jan 2025?", id: "metaculus-17990" },
//  { name: "Peace or normalisation deal by Apr?", id: "polymarket-0x90cdb2d3" },
];

function getPoint(id, historyItem) {
  for (const option of historyItem.options) {
    if (option.name === 'Yes') {
      return { x: historyItem.fetched * 1000, y: option.probability }
    }
  }
              // Log if 'Yes' option is not found
              console.log(`'Yes' option not found for ${id} at ${historyItem.fetched}`);
              return null; // Explicitly return null if 'Yes' is not found
}

//fetchAll(markets, getPoint).then((data) => writeJSONOutput("IsraelHamasSaudi.json", data));

fetchAll(markets, getPoint).then((data) => {
  // Filter out nulls before saving
  const cleanedData = data.map(market => ({
    ...market,
    points: market.points.filter(point => point !== null)
  }));
  writeJSONOutput("IsraelHamasSaudi.json", cleanedData);
});
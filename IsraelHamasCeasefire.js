import { fetchAll, writeJSONOutput } from './helpers.js';

const markets = [
//  { name: "by Oct?", id: "goodjudgmentopen-2617" },
//  { name: "Ceasefire?", id: "polymarket-0x3f0d956e" },
//  { name: "Hamas surrender?", id: "polymarket-0x25b8502f" },
//  { name: "Hamas surrender?", id: "manifold-wwqLiPRHoieeQT6Ncr0R" },
//  { name: "Ceasefire by Feb?", id: "polymarket-0x6e80e981" },
  { name: "Ceasefire by Oct 2024?", id: "goodjudgmentopen-3572" },
  { name: "Ceasefire by Nov 2024?", id: "metaculus-26084" },
  { name: "Ceasefire in 2024?", id: "manifold-5PBiCM7mofSHR55eoXkP" },
  { name: "Hamas surrender in 2024?", id: "manifold-T58z1Wq5KDOxYUyHX6oE" },
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

//fetchAll(markets, getPoint).then((data) => writeJSONOutput("IsraelHamasCeasefire.json", data));

fetchAll(markets, getPoint).then((data) => {
  // Filter out nulls before saving
  const cleanedData = data.map(market => ({
    ...market,
    points: market.points.filter(point => point !== null)
  }));
  writeJSONOutput("IsraelHamasCeasefire.json", cleanedData);
});
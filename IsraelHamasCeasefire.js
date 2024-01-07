import { fetchAll, writeJSONOutput } from './helpers.js';

const markets = [
//  { name: "by Oct?", id: "goodjudgmentopen-2617" },
//  { name: "Ceasefire?", id: "polymarket-0x3f0d956e" },
//  { name: "Hamas surrender?", id: "polymarket-0x25b8502f" },
//  { name: "Hamas surrender?", id: "manifold-wwqLiPRHoieeQT6Ncr0R" },
//  { name: "Ceasefire by Feb?", id: "polymarket-0x6e80e981" },
  { name: "Ceasefire in 2024?", id: "manifold-5PBiCM7mofSHR55eoXkP" },
  { name: "Hamas surrender in 2024?", id: "manifold-T58z1Wq5KDOxYUyHX6oE" },
];

function getPoint(id, historyItem) {
  for (const option of historyItem.options) {
    if (option.name === 'Yes') {
      return { x: historyItem.fetched * 1000, y: option.probability }
    }
  }
}

fetchAll(markets, getPoint).then((data) => writeJSONOutput("IsraelHamasCeasefire.json", data));
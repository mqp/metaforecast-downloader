import { fetchAll, writeJSONOutput } from './helpers.js';

const markets = [
//  { name: "by Oct?", id: "goodjudgmentopen-2617" },
  { name: "Ceasefire?", id: "polymarket-0x3f0d956e" },
  { name: "Hamas surrender?", id: "polymarket-0x25b8502f" },
  { name: "Hamas surrender?", id: "manifold-wwqLiPRHoieeQT6Ncr0R" },
];

function getPoint(id, historyItem) {
  for (const option of historyItem.options) {
    if (option.name === 'Yes') {
      return { x: historyItem.fetched * 1000, y: option.probability }
    }
  }
}

fetchAll(markets, getPoint).then((data) => writeJSONOutput("IsraelHamasCeasefire.json", data));
import { fetchAll, writeJSONOutput } from './helpers.js';

const markets = [
//  { name: "by Oct?", id: "goodjudgmentopen-2617" },
  { name: "Gaza head Sinwar replaced or captured/killed?", id: "metaculus-19333" },
  { name: "Army head Deif captured/killed?", id: "manifold-kVw4c6CXZlCUAhY1laVR" },
];

function getPoint(id, historyItem) {
  for (const option of historyItem.options) {
    if (option.name === 'Yes') {
      return { x: historyItem.fetched * 1000, y: option.probability }
    }
  }
}

fetchAll(markets, getPoint).then((data) => writeJSONOutput("IsraelHamasLeadership.json", data));
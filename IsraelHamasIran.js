import { fetchAll, writeJSONOutput } from './helpers.js';

const markets = [
//  { name: "by Oct?", id: "goodjudgmentopen-2617" },
  { name: "Iran attacked by Israel?", id: "metaculus-19332" },
  { name: "Iranian territory strike by Israel?", id: "goodjudgmentopen-3037" },
  { name: "Israel-Iran conflict ≥1k deaths?", id: "metaculus-14899" },
  { name: "Israel-Iran conflict?", id: "manifold-7kBOoB9ORfCDDqYMbXD4" },
];

function getPoint(id, historyItem) {
  for (const option of historyItem.options) {
    if (option.name === 'Yes') {
      return { x: historyItem.fetched * 1000, y: option.probability }
    }
  }
}

fetchAll(markets, getPoint).then((data) => writeJSONOutput("IsraelHamasIran.json", data));
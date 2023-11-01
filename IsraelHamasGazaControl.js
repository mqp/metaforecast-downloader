import { fetchAll, writeJSONOutput } from './helpers.js';

const markets = [
//  { name: "by Oct?", id: "goodjudgmentopen-2617" },
  { id: "metaculus-19308" },
  { id: "manifold-kVw4c6CXZlCUAhY1laVR" },
];

function getPoint(id, historyItem) {
  for (const option of historyItem.options) {
    if ((id === "goodjudgmentopen-2617" || id === "infer-1263") && option.name === 'No') {
      return { x: historyItem.fetched * 1000, y: option.probability };
    } else if (id !== "goodjudgmentopen-2617" && id !== "infer-1263" && option.name === 'Yes') {
      return { x: historyItem.fetched * 1000, y: option.probability };
    }
  }
}

fetchAll(markets, getPoint).then((data) => writeJSONOutput("Putin.json", data));
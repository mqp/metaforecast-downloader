import { fetchAll, writeJSONOutput } from './helpers.js';

const markets = [
//  { name: "by Oct?", id: "goodjudgmentopen-2617" },
  { id: "infer-1263" },
  { id: "metaculus-13930" },
  { id: "polymarket-0x9de1bbb5" },
  { id: "manifold-LZuynBJB6zTiKm0HZuDK" },
  { id: "insight-192967" }
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
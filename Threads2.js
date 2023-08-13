import { fetchAll, writeJSONOutput } from './helpers.js';

const markets = [
  { name: "Twtr bankruptcy by Dec 2?", id: "goodjudgmentopen-2631" },
  { name: "Twtr income growth in 2023?", id: "metaculus-14258" },
  { name: "Elon still owns Twtr?", id: "metaculus-14257" },
  { name: "Twtr bankruptcy?", id: "polymarket-0x950eb697" },
  { name: "Elon still owns Twtr?", id: "manifold-SttdxBP4Edxqzq0ScDCH" },
];

function getPoint(id, historyItem) {
  for (const option of historyItem.options) {
    if (option.name === 'Yes') {
      return { x: historyItem.fetched * 1000, y: option.probability };
    }
  }
}

fetchAll(markets, getPoint).then((data) => writeJSONOutput("Threads2.json", data));

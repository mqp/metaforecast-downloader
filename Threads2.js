import fs from 'fs';
import { fetchAll, log } from './helpers.js';

const outputPath = "Threads2.json";
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

fetchAll(markets, getPoint).then((data) => {
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
  log(`Wrote data for ${markets.length} markets to ${outputPath}.`)
})

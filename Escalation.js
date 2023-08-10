import fs from 'fs';
import { fetchAll, log } from './helpers.js';

const outputPath = "Escalation.json";
const markets = [
  { name: "Rus-NATO excl. US clash? (Metaculus)", id: "metaculus-8148" },
  { name: "Rus-US clash? (Metaculus)", id: "metaculus-7449" },
  { name: "China involvement? (Metaculus)", id: "metaculus-9969" },
  { name: "Ukr joins EU? (Metaculus)", id: "metaculus-10081" },
  { name: "Rus-US clash by Dec 16? (GJ Open)", id: "goodjudgmentopen-2913" },
];

function getPoint(id, historyItem) {
  for (const option of historyItem.options) {
    if (option.name === 'Yes') {
      return { x: historyItem.fetched * 1000, y: option.probability }
    }
  }
}

fetchAll(markets, getPoint).then((data) => {
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
  log(`Wrote data for ${markets.length} markets to ${outputPath}.`)
});

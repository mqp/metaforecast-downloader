import fs from 'fs';
import { fetchAll, log } from './helpers.js';

const outputPath = "Escalation.json";
const markets = [
  { name: "Metaculus 1", id: "metaculus-8148" },
  { name: "Metaculus 2", id: "metaculus-7449" },
  { name: "Metaculus 3", id: "metaculus-9969" },
  { name: "Metaculus 4", id: "metaculus-10081" },
  { name: "GJ Open", id: "goodjudgmentopen-2913" },
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

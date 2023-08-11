import fs from 'fs';
import { fetchAll, log } from './helpers.js';

const outputPath = "Crimea.json";
const markets = [
  { name: "Crimea land bridge cut?", id: "metaculus-13531" },
  { name: "Crimea any territory retaken by Dec 15?", id: "goodjudgmentopen-2967" }, // Updated to new forecast id - Marcel
  { name: "Crimea retaken?", id: "manifold-8dD3vNDbHnPCx3movLl9" },
  // { name: "Crimea land bridge cut by Nov?", id: "polymarket-0xda2cef9f" }, // This has fallen of Metaforecast?
  { name: "Crimea land bridge cut by Oct?", id: "insight-154445" },
  { name: "Crimea largest city retaken?", id: "metaculus-10737" }, // Added popular Metaculus market - Marcel
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

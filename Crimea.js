import fs from 'fs';
import { fetchAll, log } from './helpers.js';

const outputPath = "Crimea.json";
const markets = [
  { name: "Metaculus", id: "metaculus-13531" },
  // { name: "GJ Open", id: "goodjudgmentopen-2842" },
  { name: "Manifold", id: "manifold-8dD3vNDbHnPCx3movLl9" },
  { name: "Polymarket", id: "polymarket-0xda2cef9f" },
  { name: "Insight", id: "insight-154445" }
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

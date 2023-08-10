import fs from 'fs';
import { fetchAll, log } from './helpers.js';

const outputPath = "Threads.json";
const markets = [
  { name: "Metaculus", id: "metaculus-14259" },
  { name: "Manifold 1", id: "manifold-FxpNqBVG6NIvmZFVqG1P" },
  { name: "Manifold 2", id: "manifold-JxcpJTGSurSdSMlFxYhL" },
  { name: "Manifold 3", id: "manifold-qqFkvYHzzpTuonxnBWpN" },
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

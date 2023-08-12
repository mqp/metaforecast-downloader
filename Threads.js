import fs from 'fs';
import { fetchAll, log } from './helpers.js';

const outputPath = "Threads.json";
const markets = [
  { name: "Twtr user growth in 2023?", id: "metaculus-14259" },
  { name: "Threads overtakes Twtr by 2024?", id: "manifold-FxpNqBVG6NIvmZFVqG1P" },
  { name: "Threads overtakes Twtr by 2025?", id: "manifold-JxcpJTGSurSdSMlFxYhL" },
  { name: "Twtr user growth in 2023?", id: "manifold-qqFkvYHzzpTuonxnBWpN" },
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

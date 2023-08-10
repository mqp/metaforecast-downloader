import fs from 'fs';
import { fetchAll, log } from './helpers.js';

const outputPath = "Putin.json";
const markets = [
  { name: "by Oct? (GJ Open)", q: "by Oct?", id: "goodjudgmentopen-2617" },
  { name: "Infer", id: "infer-1263" },
  { name: "Metaculus", id: "metaculus-13930" },
  { name: "Polymarket", id: "polymarket-0x9de1bbb5" },
  { name: "Manifold", id: "manifold-LZuynBJB6zTiKm0HZuDK" },
  { name: "Insight", id: "insight-192967" }
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

fetchAll(markets, getPoint).then((data) => {
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
  log(`Wrote data for ${markets.length} markets to ${outputPath}.`)
})

import fs from 'fs';
import { fetchAll, log } from './helpers.js';

const outputPath = "Peace.json";
const markets = [
  { name: "Metaculus", id: "metaculus-13985" },
  { name: "GJ Open", id: "goodjudgmentopen-2657" },
  { name: "Manifold", id: "manifold-IY4cZAXStA3cvcqCDJqR" },
  { name: "Insight", id: "insight-224920" }
];

function getPoint(id, historyItem) {
  const targetOption = id === 'goodjudgmentopen-2657' ? 'Not before 19 August 2023' : 'Yes';
  for (const option of historyItem.options) {
    if (option.name === targetOption) {
      return { x: historyItem.fetched * 1000, y: option.probability }
    }
  }
}

fetchAll(markets, getPoint).then((data) => {
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
  log(`Wrote data for ${markets.length} markets to ${outputPath}.`)
});

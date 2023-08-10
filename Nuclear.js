import fs from 'fs';
import { fetchAll, log } from './helpers.js';

const outputPath = "Nuclear.json";
const markets = [
  { name: "Metaculus 1", id: "metaculus-10154" },
  { name: "Metaculus 2", id: "metaculus-13171" },
  { name: "Metaculus 3", id: "metaculus-2797" },
  { name: "Manifold", id: "manifold-CBCpG7AUU4pnsbyBn0bg" },
  { name: "GJ Open", id: "goodjudgmentopen-2634" },
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

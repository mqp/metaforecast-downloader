import fs from 'fs';
import { fetchAll, log } from './helpers.js';

const outputPath = "Wagner.json";
const markets = [
  { name: "GJ Open", id: "goodjudgmentopen-2908" },
  { name: "Metaculus 1", id: "metaculus-10246" },
  { name: "Metaculus 2", id: "metaculus-11589" },
  { name: "Manifold 1", id: "manifold-qJTJAf9vafBmAbwnmiKI" },
  { name: "Manifold 2", id: "manifold-onhTHDgQVDpX6V5inItM" },
];

function getPoint(id, historyItem) {
  for (const option of historyItem.options) {
    if (id === "goodjudgmentopen-2908" && option.name === 'Before 9 July 2023') {
      return { x: historyItem.fetched * 1000, y: option.probability };
    } else if (option.name === 'Yes') {
      return { x: historyItem.fetched * 1000, y: option.probability };
    }
  }
}

fetchAll(markets, getPoint).then((data) => {
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
  log(`Wrote data for ${markets.length} markets to ${outputPath}.`)
})

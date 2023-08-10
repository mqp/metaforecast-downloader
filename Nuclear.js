import fs from 'fs';
import { fetchAll, log } from './helpers.js';

const outputPath = "Nuclear.json";
const markets = [
  { name: "Radiation incident at Ukr plant? (Metaculus)", id: "metaculus-10154" },
  { name: "Rus nukes Ukr? (Metaculus)", id: "metaculus-13171" },
  { name: "Non-test nuke used? (Metaculus)", id: "metaculus-2797" },
  { name: "Nuke used in combat? (Manifold)", id: "manifold-CBCpG7AUU4pnsbyBn0bg" },
  { name: "Rus nukes Ukr by Oct? (GJ Open)", id: "goodjudgmentopen-2634" },
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

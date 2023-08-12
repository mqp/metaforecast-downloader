import fs from 'fs';
import { fetchAll, log } from './helpers.js';

const outputPath = "Territory.json";
const markets = [
  { name: "Rus gains new territory?", id: "metaculus-10745" },
  { name: "Ukr retakes DNR/LNR?", id: "goodjudgmentopen-2859" },
  { name: "Ukr retakes DNR/LNR?", id: "metaculus-10738" },
  { name: "Rus gains new territory by Oct?", id: "insight-146589" }
];

function getPoint(id, historyItem) {
  const targetOption = id === "goodjudgmentopen-2859" ? "Between 1 July 2023 and 31 December 2023" : "Yes";
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

import { fetchAll, writeJSONOutput } from './helpers.js';

const markets = [
  { name: "Crimea land bridge cut in 2024?", id: "metaculus-20533" },
  { name: "Crimea land bridge cut by Aug?", id: "goodjudgmentopen-3089" },
  // { name: "Crimea land bridge cut in 2023?", id: "metaculus-13531" },
  //  { name: "Crimea land bridge cut by Nov?", id: "polymarket-0xda2cef9f" },
  //  { name: "Crimea land bridge cut by Oct?", id: "insight-154445" },
];

function getPoint(id, historyItem) {
  const targetOption = id === "goodjudgmentopen-3089" ? "Not before 30 July 2024" : "Yes";
  for (const option of historyItem.options) {
    if (option.name === targetOption) {
      let probability = option.probability;
      if (id === "goodjudgmentopen-3089") {
      probability = 1 - probability;
      }
      return { x: historyItem.fetched * 1000, y: probability }
    }
  }
}

fetchAll(markets, getPoint).then((data) => writeJSONOutput("Crimea2.json", data));

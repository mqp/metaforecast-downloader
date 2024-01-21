import { fetchAll, writeJSONOutput } from './helpers.js';

const markets = [
//  { name: "by Oct?", id: "goodjudgmentopen-2617" },
{ name: "Relected?", id: "goodjudgmentopen-2851" },
{ name: "If vs Biden, then relected?", id: "metaculus-8483" },
];

function getPoint(id, historyItem) {
  let targetOption;
  if (id === "manifold-pz4dHnKYn49woBUK83Mq") {
    targetOption = "No";
  } else if (id === "goodjudgmentopen-2859") {
    targetOption = "Between 1 January 2024 and 30 June 2024";
  } else {
    targetOption = "Yes";
  }

  for (const option of historyItem.options) {
    if (option.name === targetOption) {
      return { x: historyItem.fetched * 1000, y: option.probability }
    }
  }
}

fetchAll(markets, getPoint).then((data) => writeJSONOutput("TrumpPresident.json", data));
import { fetchAll, writeJSONOutput } from './helpers.js';

const markets = [
//  { name: "by Oct?", id: "goodjudgmentopen-2617" },
{ id: "predictit-8071" },
{ id: "smarkets-58020860" },
{ id: "manifold-6PRVVzCtifOxdVGJNA7a" },
//{ id: "metaculus-21109" },
];


function getPoint(id, historyItem) {
  let targetOption;
  if (id === "manifold-6PRVVzCtifOxdVGJNA7a") {
    targetOption = "Yes";
  } else if (id === "metaculus-21109") {
    targetOption = "Yes";
  } else {
    targetOption = "Donald Trump";
  }

  for (const option of historyItem.options) {
    if (option.name === targetOption) {
      return { x: historyItem.fetched * 1000, y: option.probability }
    }
  }
}

fetchAll(markets, getPoint).then((data) => writeJSONOutput("TrumpNH.json", data));
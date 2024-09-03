import { fetchAll, writeJSONOutput } from './helpers.js';

const markets = [
// { name: "by Oct?", id: "goodjudgmentopen-2617" },
//{ id: "smarkets-58020860" },
//{ id: "manifold-6PRVVzCtifOxdVGJNA7a" },
//{ id: "metaculus-21109" },
//{ name: "GOP wins Senate in 2024?", id: "betfair-1.225479090" },
{ name: "GOP wins Senate in 2024?", id: "smarkets-39918396" },
{ name: "GOP wins Senate in 2024?", id: "metaculus-7850" },
{ name: "GOP wins Senate in 2024?", id: "goodjudgmentopen-3220" },
{ name: "GOP wins House in 2024?", id: "metaculus-7849" },
{ name: "GOP wins House in 2024?", id: "goodjudgmentopen-3219" },
];

function getPoint(id, historyItem) {
  let targetOption;
  if (id === "smarkets-39918396") {
    targetOption = "Republican";
  } else if (id === "goodjudgmentopen-3220") {
    targetOption = "Republican Party";
  } else if (id === "goodjudgmentopen-3219") {
    targetOption = "Republican Party";
  } else {
    targetOption = "Yes";
  }

  for (const option of historyItem.options) {
    if (option.name === targetOption) {
      return { x: historyItem.fetched * 1000, y: option.probability }
    }
  }
}

fetchAll(markets, getPoint).then((data) => writeJSONOutput("TrumpNH.json", data));
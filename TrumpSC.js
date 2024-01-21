import { fetchAll, writeJSONOutput } from './helpers.js';

const markets = [
//  { name: "by Oct?", id: "goodjudgmentopen-2617" },
{ id: "smarkets-59296412" },

];


function getPoint(id, historyItem) {
  let targetOption;
  if (id === "goodjudgmentopen-3121") {
    targetOption = "20% or more";
  } else if (id === "goodjudgmentopen-2859") {
    targetOption = "Between 1 January 2024 and 30 June 2024";
  } else {
    targetOption = "Donald Trump";
  }

  for (const option of historyItem.options) {
    if (option.name === targetOption) {
      return { x: historyItem.fetched * 1000, y: option.probability }
    }
  }
}

fetchAll(markets, getPoint).then((data) => writeJSONOutput("TrumpSC.json", data));
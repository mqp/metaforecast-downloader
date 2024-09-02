import { fetchAll, writeJSONOutput } from './helpers.js';

const markets = [
//  { name: "by Oct?", id: "goodjudgmentopen-2617" },
{ name: "Jail time by Jul 2028?", id: "metaculus-957" },
{ name: "Jail time by 2030?", id: "metaculus-10832" },
//{ name: "Guilty in Manhattan case by Nov 5?", id: "metaculus-15778" },
//{ name: "Criminal charges for insurrection by Jul 13?", id: "goodjudgmentopen-3183" },
{ name: "Federal conviction in 2024?", id: "metaculus-18233" },
{ name: "Federal conviction by Nov 2024?", id: "goodjudgmentopen-3398" },
];

function getPoint(id, historyItem) {
  let targetOption;
  if (id === "goodjudgmentopen-3183") {
    targetOption = "Yes, federal only";
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

fetchAll(markets, getPoint).then((data) => writeJSONOutput("TrumpJail.json", data));
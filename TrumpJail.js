import { fetchAll, writeJSONOutput } from './helpers.js';

const markets = [
//  { name: "by Oct?", id: "goodjudgmentopen-2617" },
{ name: "Serves time by Jul 2028?", id: "metaculus-957" },
{ name: "Serves ≥30 days by 2030?", id: "metaculus-10832" },
{ name: "Guilty in Manhattan case by Nov 5?", id: "metaculus-15778" },
{ name: "Criminal charges for insurrection by Jul 13?", id: "goodjudgmentopen-3183" },
{ name: "At least 1 federal conviction in 2024?", id: "metaculus-18233" },
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

fetchAll(markets, getPoint).then((data) => writeJSONOutput("IsraelHamasGazaControl.json", data));
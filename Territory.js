import { fetchAll, writeJSONOutput } from './helpers.js';

const markets = [
  { name: "Rus gains ≥20% of Ukr by Aug 2024?", id: "goodjudgmentopen-3121" },
  { name: "Rus gains new territory by 2026?", id: "metaculus-19724" },
  { name: "Rus gains new territory?", id: "metaculus-10745" },
  { name: "Ukr retakes DNR/LNR by Jul 2024?", id: "goodjudgmentopen-2859" },
  { name: "Ukr retakes DNR/LNR by 2030", id: "metaculus-18865" },
  { name: "Ukr retakes DNR/LNR?", id: "metaculus-10738" },
  // { name: "Rus gains new territory by Oct?", id: "insight-146589" }
];

function getPoint(id, historyItem) {
  let targetOption;
  if (id === "goodjudgmentopen-3121") {
    targetOption = "20% or more";
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
fetchAll(markets, getPoint).then((data) => writeJSONOutput("Territory.json", data));

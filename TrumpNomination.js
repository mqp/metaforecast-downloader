import { fetchAll, writeJSONOutput } from './helpers.js';

const markets = [
//  { name: "by Oct?", id: "goodjudgmentopen-2617" },
{ id: "predictit-7053" },
{ id: "manifold-pz4dHnKYn49woBUK83Mq" },
{ id: "smarkets-11449665" },
{ name: "Most delegates?", id: "goodjudgmentopen-3014" },


];

function getPoint(id, historyItem) {
  let targetOption;
  if (id === "manifold-pz4dHnKYn49woBUK83Mq") {
    targetOption = "Yes";
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

fetchAll(markets, getPoint).then((data) => writeJSONOutput("IsraelHamasGazaControl.json", data));
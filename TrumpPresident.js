import { fetchAll, writeJSONOutput } from './helpers.js';

const markets = [
//  { name: "by Oct?", id: "goodjudgmentopen-2617" },
{ name: "Relected?", id: "goodjudgmentopen-2851" },
{ name: "Relected?", id: "manifold-SsAdHNNaI9hRRMe1XqgG" },
//{ name: "If vs Biden, then relected?", id: "metaculus-8483" },
{ name: "GOP wins?", id: "smarkets-11525542" },
{ name: "GOP wins?", id: "metaculus-6478" },
{ name: "GOP wins?", id: "predictit-6867" },
];

function getPoint(id, historyItem) {
  let targetOption;
  let inverse = false;

  if (id === "smarkets-11525542") {
    targetOption = "Republican";
  } else if (id === "predictit-6867") {
    targetOption = "Republican";
  } else if (id === "metaculus-6478") {
    targetOption = "Yes";
    inverse = true;
  } else {
    targetOption = "Yes";
  }

//  for (const option of historyItem.options) {
//    if (option.name === targetOption) {
//      return { x: historyItem.fetched * 1000, y: option.probability }
//    }
//  }

  for (const option of historyItem.options) {
    if (option.name === targetOption) {
      let probability = option.probability;
      if (inverse) {
        probability = 1 - probability;
      }
      return { x: historyItem.fetched * 1000, y: probability };
    }
  }

}

fetchAll(markets, getPoint).then((data) => writeJSONOutput("TrumpPresident.json", data));
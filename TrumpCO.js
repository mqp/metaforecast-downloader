import { fetchAll, writeJSONOutput } from './helpers.js';

const markets = [
//  { name: "by Oct?", id: "goodjudgmentopen-2617" },
//{ id: "predictit-7053" },
{ name: "On general ballot?", id: "metaculus-20708" },
{ name: "On primary ballot?", id: "manifold-z3rcPqJXZCVjaOxIpY6A" },
{ name: "On primary ballot?", id: "goodjudgmentopen-3210" },
{ name: "On primary ballot by Mar 5?", id: "smarkets-57942131" },

];

function getPoint(id, historyItem) {
  let targetOption;
  if (id === "metaculus-20708") {
    targetOption = "Yes";
  } else if (id === "manifold-z3rcPqJXZCVjaOxIpY6A") {
    targetOption = "Yes";
  } else if (id === "smarkets-57942131") {
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

fetchAll(markets, getPoint).then((data) => writeJSONOutput("IsraelHamasGazaControl.json", data));
import { fetchAll, writeJSONOutput } from './helpers.js';

const markets = [
//  { name: "Prigozhin quits or flees by Dec 9?", id: "goodjudgmentopen-2908" }, // Updated to take the inverse probability
//  { name: "Coup?", id: "metaculus-10246" },
{ name: "Next leader disapproves of UKR invasion?", id: "metaculus-10949" },
{ name: "Democracy 5 years post-Putin?", id: "metaculus-15098" },
  { name: "Federal subject breaks away by 2025?", id: "metaculus-12568" },
  { name: "Armed civil conflict by 2030?", id: "metaculus-11589" },
  { name: "Territory reduced by ≥1% by 2040?", id: "metaculus-15211" },
//  { name: "Prigozhin killed?", id: "manifold-qJTJAf9vafBmAbwnmiKI" },
//  { name: "Coup?", id: "manifold-onhTHDgQVDpX6V5inItM" },
];

function getPoint(id, historyItem) {
  for (const option of historyItem.options) {
    if (id === "goodjudgmentopen-2908" && option.name === 'Not before 9 December 2023') {
      return { x: historyItem.fetched * 1000, y: 1 - option.probability }; // Subtracting from 1
    } else if (option.name === 'Yes') {
      return { x: historyItem.fetched * 1000, y: option.probability };
    }
  }
}

fetchAll(markets, getPoint).then((data) => writeJSONOutput("Wagner.json", data));

import { fetchAll, writeJSONOutput } from './helpers.js';

const markets = [
//  { name: "by Oct?", id: "goodjudgmentopen-2617" },
  { name: "Normalised relations?", id: "goodjudgmentopen-2976" },
  { name: "Establish relations?", id: "manifold-7LxcLPJKi3jA86XghgQE" },
  { name: "Establish relations?", id: "metaculus-17990" },
  { name: "Peace or normalisation deal?", id: "polymarket-0x90cdb2d3" },
];

function getPoint(id, historyItem) {
  for (const option of historyItem.options) {
    if (option.name === 'Yes') {
      return { x: historyItem.fetched * 1000, y: option.probability }
    }
  }
}

fetchAll(markets, getPoint).then((data) => writeJSONOutput("IsraelHamasSaudi.json", data));
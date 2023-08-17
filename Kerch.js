import { fetchAll, writeJSONOutput } from './helpers.js';

const markets = [
  { name: "Kerch bridge cut?", id: "metaculus-13989" },
  { name: "Kerch bridge cut?", id: "manifold-7GJmdx2kAsqTiusZWppI" },
  { name: "Kerch bridge cut for 7 days?", id: "metaculus-12569" },
];

function getPoint(id, historyItem) {
  for (const option of historyItem.options) {
    if (option.name === 'Yes') {
      return { x: historyItem.fetched * 1000, y: option.probability }
    }
  }
}

fetchAll(markets, getPoint).then((data) => writeJSONOutput("Kerch.json", data));

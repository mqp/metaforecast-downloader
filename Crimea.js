import { fetchAll, writeJSONOutput } from './helpers.js';

const markets = [
  { name: "Crimean territory retaken by Aug 2024?", id: "goodjudgmentopen-3164" },
  //  { name: "Crimea any territory retaken by Dec 15?", id: "goodjudgmentopen-2967" },
  { name: "Crimea retaken in 2023?", id: "manifold-8dD3vNDbHnPCx3movLl9" },
  { name: "Crimea largest city retaken in 2023?", id: "metaculus-10737" },
];

function getPoint(id, historyItem) {
  for (const option of historyItem.options) {
    if (option.name === 'Yes') {
      return { x: historyItem.fetched * 1000, y: option.probability }
    }
  }
}

fetchAll(markets, getPoint).then((data) => writeJSONOutput("Crimea.json", data));
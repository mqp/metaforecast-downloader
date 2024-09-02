import { fetchAll, writeJSONOutput } from './helpers.js';

const markets = [
//  { name: "Crimean territory retaken by Aug 15?", id: "goodjudgmentopen-3164" },
//{ name: "Conventional land fighting in Crimea?", id: "manifold-c0RAHpOtHGvcTkhSkDN6" },
{ name: "Crimea land bridge cut in 2024?", id: "metaculus-20533" },
  { name: "Crimea partially retaken by 2027?", id: "manifold-el2oeAPlwm4u0LBKLQXx" },
  { name: "Crimea fully retaken by 2027?", id: "manifold-p3UsYkHmZ6Xj09ybEo08" },
  // { name: "Crimea any territory retaken by Dec 15?", id: "goodjudgmentopen-2967" },
  // { name: "Crimea retaken in 2023?", id: "manifold-8dD3vNDbHnPCx3movLl9" },
  // { name: "Crimea largest city retaken in 2023?", id: "metaculus-10737" },
];

function getPoint(id, historyItem) {
  for (const option of historyItem.options) {
    if (option.name === 'Yes') {
      return { x: historyItem.fetched * 1000, y: option.probability }
    }
  }
}

fetchAll(markets, getPoint).then((data) => writeJSONOutput("Crimea.json", data));
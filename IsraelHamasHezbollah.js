import { fetchAll, writeJSONOutput } from './helpers.js';

const markets = [
//  { name: "by Oct?", id: "goodjudgmentopen-2617" },
//  { name: "Israel-Hezbollah war?", id: "manifold-xpCT9MEzcBgYXIB8QO3B" },
//  { name: "Israel-Hezbollah conflict ≥400 deaths?", id: "metaculus-19375" },
//  { name: "Israel invades Lebanon?", id: "goodjudgmentopen-3062" },
{ name: "Israel-Hezbollah combat?", id: "manifold-l9dhLkCSjs5m0baSCsgf" },
{ name: "IDF invades Lebanon with AFVs by Mar 15?", id: "goodjudgmentopen-3163" },
// { name: "Israel war with Lebanon, Jordon or Egypt?", id: "metaculus-19850" },

];

function getPoint(id, historyItem) {
  for (const option of historyItem.options) {
    if (option.name === 'Yes') {
      return { x: historyItem.fetched * 1000, y: option.probability }
    }
  }
}

fetchAll(markets, getPoint).then((data) => writeJSONOutput("IsraelHamasHezbollah.json", data));
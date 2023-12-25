import { fetchAll, writeJSONOutput } from './helpers.js';

const markets = [
//  { name: "by Oct?", id: "goodjudgmentopen-2617" },
  { name: "Iran nuke facilities attacked?", id: "infer-1289" },
  { name: "90% enriched uranium in Iran?", id: "infer-1286" },
  { name: "Iran nukes 'likely' by Jul 2024?", id: "goodjudgmentopen-2552" },
];

function getPoint(id, historyItem) {
  for (const option of historyItem.options) {
    if (option.name === 'Yes') {
      return { x: historyItem.fetched * 1000, y: option.probability }
    }
  }
}

fetchAll(markets, getPoint).then((data) => writeJSONOutput("IsraelHamasIran2.json", data));
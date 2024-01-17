import { fetchAll, writeJSONOutput } from './helpers.js';

const markets = [
//  { name: "by Oct?", id: "goodjudgmentopen-2617" },
//  { name: "Iran nuke facilities attacked?", id: "infer-1289" },
//  { name: "90% enriched uranium in Iran by 2025?", id: "infer-1286" },
//Moved to Nuclear  { name: "Iran nukes 'likely' by Jul 2024?", id: "goodjudgmentopen-2552" },
//Moved to Nuclear  { name: "Iran has nukes by 2030?", id: "metaculus-5253" },
];

function getPoint(id, historyItem) {
  for (const option of historyItem.options) {
    if (option.name === 'Yes') {
      return { x: historyItem.fetched * 1000, y: option.probability }
    }
  }
}

fetchAll(markets, getPoint).then((data) => writeJSONOutput("IsraelHamasIran2.json", data));
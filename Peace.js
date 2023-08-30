import { fetchAll, writeJSONOutput } from './helpers.js';

const markets = [
  { name: "Ceasefire?", id: "metaculus-13985" },
//  { name: "Ceasefire?", id: "polymarket-0x30afc488" },
  { name: "War ends?", id: "goodjudgmentopen-2951" },
  { name: "War ends?", id: "manifold-IY4cZAXStA3cvcqCDJqR" },
  { name: "War ends?", id: "insight-224920" }
];

function getPoint(id, historyItem) {
  const targetOption = id === 'goodjudgmentopen-2951' ? 'Before 1 January 2024' : 'Yes';
  for (const option of historyItem.options) {
    if (option.name === targetOption) {
      return { x: historyItem.fetched * 1000, y: option.probability }
    }
  }
}

fetchAll(markets, getPoint).then((data) => writeJSONOutput("Peace.json", data));

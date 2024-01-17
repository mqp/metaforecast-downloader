import { fetchAll, writeJSONOutput } from './helpers.js';

const markets = [
{ name: "Putin stays in power in 2024", id: "manifold-Nc8DWWUyYm6CQp6PvOEv" },
{ name: "Putin wins next election with >80% vote", id: "goodjudgmentopen-2959" },
{ name: "Putin wins next election with >75% vote", id: "goodjudgment-f9e7328d1c" },
{ name: "Putin declares martial law in 2024", id: "metaculus-17682" },
  //  { name: "by Oct?", id: "goodjudgmentopen-2617" },
//  { id: "infer-1263" },
//  { id: "metaculus-13930" },
//  { id: "polymarket-0x9de1bbb5" },
//  { id: "manifold-LZuynBJB6zTiKm0HZuDK" },
//  { id: "insight-192967" }
];

function getPoint(id, historyItem) {
  let targetOption;
  if (id === 'goodjudgmentopen-2959') {
    targetOption = 'Vladimir Putin, who will win with 80% or more of the votes cast';
  } else if (id === 'goodjudgment-f9e7328d1c') {
    targetOption = 'Vladimir Putin, who will win with 75% or more of the votes cast';
  } else {
    targetOption = 'Yes';
  }

  for (const option of historyItem.options) {
    if (option.name === targetOption) {
      return { x: historyItem.fetched * 1000, y: option.probability };
    }
  }
}

fetchAll(markets, getPoint).then((data) => writeJSONOutput("Putin.json", data));
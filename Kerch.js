import { fetchAll, writeJSONOutput } from './helpers.js';

const markets = [
  { name: "Zelenskyy re-elected?", id: "metaculus-10807" },
  { name: "UKR joins EU by 2030?", id: "metaculus-10043" },
  { name: "UKR joins NATO by 2035?", id: "metaculus-18862" },
  { name: "UKR join Union State by 2040?", id: "metaculus-10806" },
//  { name: "Kerch bridge cut?", id: "metaculus-13989" },
//  { name: "Kerch bridge cut?", id: "manifold-7GJmdx2kAsqTiusZWppI" },
//  { name: "Kerch bridge cut for 7 days?", id: "metaculus-12569" },
];

function getPoint(id, historyItem) {
  for (const option of historyItem.options) {
    if (option.name === 'Yes') {
      return { x: historyItem.fetched * 1000, y: option.probability }
    }
  }
}

fetchAll(markets, getPoint).then((data) => writeJSONOutput("Kerch.json", data));

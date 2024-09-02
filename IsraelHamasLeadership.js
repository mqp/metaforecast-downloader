import { fetchAll, writeJSONOutput } from './helpers.js';

const markets = [
//  { name: "by Oct?", id: "goodjudgmentopen-2617" },
  //{ name: "Gaza head Sinwar replaced or captured/killed?", id: "metaculus-19333" },
  //{ name: "Army head Deif captured/killed?", id: "manifold-kVw4c6CXZlCUAhY1laVR" },
  { name: "Netanyahu stays Israel leader in 2024?", id: "metaculus-20753" },
  { name: "Khamenei stays Iran leader in 2024?", id: "metaculus-20783" },
  { name: "Hamas leader Sinwar captured/killed by Oct 2024?", id: "goodjudgmentopen-3286" },
  { name: "ICC charges Netanyahu by 2026?", id: "metaculus-19824" },
];

//function getPoint(id, historyItem) {
//  for (const option of historyItem.options) {
//    if (option.name === 'Yes') {
//      return { x: historyItem.fetched * 1000, y: option.probability }
//    }
//  }
// }

function getPoint(id, historyItem) {
  for (const option of historyItem.options) {
    if (id === 'metaculus-20753' && option.name === 'Yes') {
      return { x: historyItem.fetched * 1000, y: option.probability };
    } else if (id === 'metaculus-20783' && option.name === 'Yes') {
      return { x: historyItem.fetched * 1000, y: 1 - option.probability };
    } else if (id === 'goodjudgmentopen-3286' && option.name === 'Not before 20 October 2024') {
      return { x: historyItem.fetched * 1000, y: 1 - option.probability };
    } else if (id == 'metaculus-19824' && option.name === 'Yes') {
      return { x: historyItem.fetched * 1000, y: option.probability };
    } else if (id !== 'metaculus-20783' && option.name === 'Yes') {
      return { x: historyItem.fetched * 1000, y: option.probability };
    }
  }
}

fetchAll(markets, getPoint).then((data) => writeJSONOutput("IsraelHamasLeadership.json", data));
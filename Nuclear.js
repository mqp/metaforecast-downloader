import { fetchAll, writeJSONOutput } from './helpers.js';

const markets = [
  { name: "RUS detonates nuke outside of RUS/BLR by May?", id: "goodjudgmentopen-3017" },
  { name: "RUS moves nuke into UKR boundries by May?", id: "goodjudgmentopen-3016" },
  { name: "ISR uses nuke in combat by Oct 7?", id: "metaculus-19554" },
  { name: "UKR starts nuke program by 2025?", id: "metaculus-17791" },
//  { name: "Radiation incident at Ukr plant?", id: "metaculus-10154" },
//  { name: "Rus nukes Ukr?", id: "metaculus-13171" },
//  { name: "Non-test nuke used?", id: "metaculus-2797" }, // Updated to capture No
//  { name: "Nuke used in combat?", id: "manifold-CBCpG7AUU4pnsbyBn0bg" },
//  { name: "Rus nukes Ukr by Oct?", id: "goodjudgmentopen-2634" },
];

function getPoint(id, historyItem) {
  for (const option of historyItem.options) {
    if ((id === "metaculus-2797") && option.name === 'No') {
      return { x: historyItem.fetched * 1000, y: option.probability };
    } else if (id !== "metaculus-2797" && option.name === 'Yes') {
      return { x: historyItem.fetched * 1000, y: option.probability };
    }
  }
}

fetchAll(markets, getPoint).then((data) => writeJSONOutput("Nuclear.json", data));

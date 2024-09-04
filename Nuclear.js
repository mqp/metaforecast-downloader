import { fetchAll, writeJSONOutput } from './helpers.js';

const markets = [
//  { name: "RUS detonates nuke outside of RUS/BLR by May?", id: "goodjudgmentopen-3017" },
 // { name: "RUS moves nuke into UKR boundries by May?", id: "goodjudgmentopen-3016" },
//Broken on Poly but good for 2024  { name: "ISR uses nuke in combat by Oct 7?", id: "metaculus-19554" },
//Broken on Poly but good for 2024  { name: "UKR starts nuke program by 2025?", id: "metaculus-17791" },
// { name: "Iran nukes 'likely' by Jul 2024?", id: "goodjudgmentopen-2552" },

{ name: "Israel uses nuke in combat by Oct 2024?", id: "metaculus-19554" },
{ name: "Russia uses nuke vs Ukraine by Oct 2024?", id: "metaculus-27538" },
{ name: "Nuke kills ≥10 people in 2024?", id: "metaculus-20768" },
{ name: "Ukraine plant radiation incident in 2024?", id: "metaculus-20790" },
{ name: "Ukraine starts nuke program by 2026?", id: "metaculus-17791" },

//{ name: "Iran gets nukes by 2030?", id: "metaculus-5253" },
//{ name: "China ≥1k nukes by 2030?", id: "metaculus-19554" },
//{ name: "New nuclear state by 2030?", id: "metaculus-15537" },
//{ name: "Non-state actor gets nukes by 2030?", id: "metaculus-8614" },
//{ name: "Major nuclear accident by 2030?", id: "metaculus-6378" },
//{ name: "Nuke detonated (non-test) by 2035?", id: "metaculus-3150" },

//  { name: "Radiation incident at Ukr plant?", id: "metaculus-10154" },
//  { name: "Rus nukes Ukr?", id: "metaculus-13171" },
//  { name: "Non-test nuke used?", id: "metaculus-2797" },
//  { name: "Nuke used in combat?", id: "manifold-CBCpG7AUU4pnsbyBn0bg" },
//  { name: "Rus nukes Ukr by Oct?", id: "goodjudgmentopen-2634" },
];

function getPoint(id, historyItem) {
  for (const option of historyItem.options) {
    if ((id === "metaculus-2797") && option.name === 'No') {
      return { x: historyItem.fetched * 1000, y: option.probability };
    } else if (id === 'metaculus-3150' && option.name === 'Yes') {
      return { x: historyItem.fetched * 1000, y: 1 - option.probability };
    } else if (id !== "metaculus-2797" && option.name === 'Yes') {
      return { x: historyItem.fetched * 1000, y: option.probability };
    }
  }
    // Log if 'Yes' option is not found
    console.log(`'Yes' option not found for ${id} at ${historyItem.fetched}`);
    return null; // Explicitly return null if 'Yes' is not found
}

//fetchAll(markets, getPoint).then((data) => writeJSONOutput("Nuclear.json", data));

fetchAll(markets, getPoint).then((data) => {
  // Filter out nulls before saving
  const cleanedData = data.map(market => ({
    ...market,
    points: market.points.filter(point => point !== null)
  }));
  writeJSONOutput("Nuclear.json", cleanedData);
});
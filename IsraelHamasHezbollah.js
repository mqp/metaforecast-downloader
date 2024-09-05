import { fetchAll, writeJSONOutput } from './helpers.js';

const markets = [
//  { name: "by Oct?", id: "goodjudgmentopen-2617" },
//  { name: "Israel-Hezbollah war?", id: "manifold-xpCT9MEzcBgYXIB8QO3B" },
//  { name: "Israel-Hezbollah conflict ≥400 deaths?", id: "metaculus-19375" },
//  { name: "Israel invades Lebanon?", id: "goodjudgmentopen-3062" },
{ name: "Israel invades Lebanon by Oct 2024?", id: "metaculus-25846" },
{ name: "Israel-Hezbollah conflict ≥1k deaths in 2024?", id: "metaculus-21320" },
{ name: "Israel-Hezbollah combat by 2027?", id: "manifold-l9dhLkCSjs5m0baSCsgf" },
// { name: "IDF invades Lebanon with AFVs by Mar 15?", id: "goodjudgmentopen-3163" },
// { name: "Israel war with Lebanon, Jordon or Egypt?", id: "metaculus-19850" },

];

function getPoint(id, historyItem) {
  for (const option of historyItem.options) {
    if (option.name === 'Yes') {
      return { x: historyItem.fetched * 1000, y: option.probability }
    }
  }
          // Log if 'Yes' option is not found
          console.log(`'Yes' option not found for ${id} at ${historyItem.fetched}`);
          return null; // Explicitly return null if 'Yes' is not found
}

//fetchAll(markets, getPoint).then((data) => writeJSONOutput("IsraelHamasHezbollah.json", data));

fetchAll(markets, getPoint).then((data) => {
  // Filter out nulls before saving
  const cleanedData = data.map(market => ({
    ...market,
    points: market.points.filter(point => point !== null)
  }));
  writeJSONOutput("IsraelHamasHezbollah.json", cleanedData);
});
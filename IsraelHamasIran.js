import { fetchAll, writeJSONOutput } from './helpers.js';

const markets = [
//  { name: "by Oct?", id: "goodjudgmentopen-2617" },
  //{ name: "Iran attacked by Israel?", id: "metaculus-19332" },
  //{ name: "IDF strikes Irani territory by Oct?", id: "goodjudgmentopen-3037" },
  { name: "Israel-Iran conflict ≥1k deaths in 2024?", id: "metaculus-14899" },
  { name: "Israel-Iran conflict ≥1k deaths in 2024?", id: "manifold-IXPA4v7waElX2BUZ6TzF" },
  { name: "Iran deadly attack within Israel by Oct 2024?", id: "metaculus-27132" },
  { name: "IDF strike within Iran in 2024?", id: "goodjudgmentopen-3561" },
 // { name: "Israel-Iran conflict?", id: "manifold-7kBOoB9ORfCDDqYMbXD4" },
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

//fetchAll(markets, getPoint).then((data) => writeJSONOutput("IsraelHamasIran.json", data));

fetchAll(markets, getPoint).then((data) => {
  // Filter out nulls before saving
  const cleanedData = data.map(market => ({
    ...market,
    points: market.points.filter(point => point !== null)
  }));
  writeJSONOutput("IsraelHamasIran.json", cleanedData);
});
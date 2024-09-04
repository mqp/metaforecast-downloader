import { fetchAll, writeJSONOutput } from './helpers.js';

const markets = [
// { name: "Rus-NATO conflict by Sept 2024?", id: "goodjudgmentopen-3173" },
// { name: "Rus-NATO excl. US clash?", id: "metaculus-8148" },
// { name: "Rus-NATO incl. US clash?", id: "metaculus-7449" },
// { name: "China involvement?", id: "metaculus-9969" },
// { name: "Ukr joins EU?", id: "metaculus-10081" },
// { name: "Rus-US clash by Dec 16?", id: "goodjudgmentopen-2913" },

//{ name: "RUS-NATO lethal confrontation by Jan 2025?", id: "goodjudgmentopen-3687" },
//{ name: "RUS-NATO direct conflict by 2027?", id: "metaculus-21548" },
//{ name: "NATO troops openly in UKR by 2027?", id: "metaculus-21761" },
{ name: "RUS-NATO excl. US war by 2035?", id: "metaculus-8636" },
{ name: "RUS-US war by 2050?", id: "metaculus-7452" },
{ name: "RUS annxes part of Baltics by 2035?", id: "metaculus-8786" },
];

//function getPoint(id, historyItem) {
//  for (const option of historyItem.options) {
//    if (option.name === 'Yes') {
//      return { x: historyItem.fetched * 1000, y: option.probability }
//    }
//  }
//}

//fetchAll(markets, getPoint).then((data) => writeJSONOutput("Escalation.json", data));

function getPoint(id, historyItem) {
  for (const option of historyItem.options) {
    if (option.name === 'Yes') {
      return { x: historyItem.fetched * 1000, y: option.probability }; // Only 'Yes'
    }
  }
  // Log if 'Yes' option is not found
  console.log(`'Yes' option not found for ${id} at ${historyItem.fetched}`);
  return null; // Explicitly return null if 'Yes' is not found
}

fetchAll(markets, getPoint).then((data) => {
  // Filter out nulls before saving
  const cleanedData = data.map(market => ({
    ...market,
    points: market.points.filter(point => point !== null)
  }));
  writeJSONOutput("Escalation2.json", cleanedData);
});
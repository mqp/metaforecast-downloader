import { fetchAll, writeJSONOutput } from './helpers.js';

const markets = [
//  { name: "Ceasefire in 2023?", id: "metaculus-13985" },
//  { name: "Ceasefire in 2023?", id: "polymarket-0x30afc488" },
//  { name: "War ends by Jul 2024?", id: "goodjudgmentopen-2951" },
  { name: "Peace by Oct 2024?", id: "goodjudgmentopen-3114" },
  { name: "Peace talks in 2024?", id: "manifold-YYKCHy5ITvvCU00g8hEr" },
  { name: "Peace in 2024?", id: "manifold-a01aHewEJNDOl4fIKaAU" },
  { name: "Peace or ceasefire in 2024?", id: "metaculus-20752" },
//  { name: "War ends in 2023?", id: "manifold-IY4cZAXStA3cvcqCDJqR" },
//  { name: "War ends?", id: "insight-224920" }
];

function getPoint(id, historyItem) {
  let targetOption;
  let inverse = false;

  if (id === 'goodjudgmentopen-2951') {
    targetOption = 'Between 1 January 2024 and 30 June 2024';
  } else if (id === 'goodjudgmentopen-3114') {
    targetOption = 'Not before 1 October 2024';
    inverse = true;
  } else {
    targetOption = 'Yes';
  }

  for (const option of historyItem.options) {
    if (option.name === targetOption) {
      let probability = option.probability;
      // Invert the probability if the targetOption is 'Not before 1 October 2024'
      if (inverse) {
        probability = 1 - probability;
      }
      return { x: historyItem.fetched * 1000, y: probability };
    }
  }
      // Log if 'Yes' option is not found
      console.log(`'Yes' option not found for ${id} at ${historyItem.fetched}`);
      return null; // Explicitly return null if 'Yes' is not found
}

//fetchAll(markets, getPoint).then((data) => writeJSONOutput("Peace.json", data));

fetchAll(markets, getPoint).then((data) => {
  // Filter out nulls before saving
  const cleanedData = data.map(market => ({
    ...market,
    points: market.points.filter(point => point !== null)
  }));
  writeJSONOutput("Peace.json", cleanedData);
});
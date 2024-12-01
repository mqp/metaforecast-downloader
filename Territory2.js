import { fetchAll, writeJSONOutput } from './helpers.js';

const markets = [
//  { name: "UKR exits Kursk by Dec 2024?", id: "metaculus-27191" },
  { name: "UKR exits RUS by Feb 2025?", id: "goodjudgmentopen-3658" },
  { name: "UKR controls Bakhmut in 2024?", id: "metaculus-20761" },
  { name: "UKR controls DNR/LNR by 2030?", id: "metaculus-18865" },
];

function getPoint(id, historyItem) {
  let targetOption;
  
  // Check if the market ID is "goodjudgmentopen-3658"
  if (id === "goodjudgmentopen-3658") {
    targetOption = "Not before 19 February 2025";
    
    // Find the target option in the history item
    for (const option of historyItem.options) {
      if (option.name === targetOption) {
        // Return the inverse probability (1 - target probability)
        return { x: historyItem.fetched * 1000, y: 1 - option.probability };
      }
    }
  } else {
    targetOption = "Yes";
  }
  
  // Default behavior for non-inverse cases
  for (const option of historyItem.options) {
    if (option.name === targetOption) {
      return { x: historyItem.fetched * 1000, y: option.probability };
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
  writeJSONOutput("Territory2.json", cleanedData);
});
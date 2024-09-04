import { fetchAll, writeJSONOutput } from './helpers.js';

const markets = [
//  { name: "RUS gains oblast near BLR by May?", id: "goodjudgmentopen-3088" },
//  { name: "RUS gains ≥20% of UKR by Aug?", id: "goodjudgmentopen-3121" },
  // { name: "Rus gains new territory?", id: "metaculus-10745" },
//  { name: "UKR retakes DNR/LNR by Jul 2024?", id: "goodjudgmentopen-2859" },
  // { name: "Ukr retakes DNR/LNR?", id: "metaculus-10738" },
  // { name: "Rus gains new territory by Oct?", id: "insight-146589" },

  { name: "RUS gains Chasiv Yar by Oct 2024?", id: "metaculus-25749" },
  { name: "RUS gains Kharkiv by Nov 2024?", id: "goodjudgmentopen-3477" },
  { name: "RUS gains new territory by 2026?", id: "metaculus-19724" },

  { name: "UKR exits Kursk by Dec 2024?", id: "metaculus-27191" },
  { name: "UKR exits RUS by Feb 2025?", id: "goodjudgmentopen-3658" },
  { name: "UKR controls Bakhmut in 2024?", id: "metaculus-20761" },
  { name: "UKR controls DNR/LNR by 2030?", id: "metaculus-18865" },
  
  { name: "Frontline changes in 2024?", id: "manifold-Cjc9jjkQvT0hBWFGoaN7" },
];

//function getPoint(id, historyItem) {
//  let targetOption;
//  if (id === "goodjudgmentopen-3658") {
//    targetOption = "Not before 19 February 2025";
//  } else if (id === "goodjudgmentopen-2859") {
//    targetOption = "Between 1 January 2024 and 30 June 2024";
//  } else {
//    targetOption = "Yes";
//  }
//
//  for (const option of historyItem.options) {
//    if (option.name === targetOption) {
//      return { x: historyItem.fetched * 1000, y: option.probability }
//    }
//  }
//}

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
}

fetchAll(markets, getPoint).then((data) => writeJSONOutput("Territory.json", data));

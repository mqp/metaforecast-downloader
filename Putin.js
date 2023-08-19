import { fetchAll, writeJSONOutput } from './helpers.js';

const markets = [
  { name: "by Oct?", id: "goodjudgmentopen-2617" },
  { id: "infer-1263" },
  { id: "metaculus-13930" },
  { id: "polymarket-0x9de1bbb5" },
  { id: "manifold-LZuynBJB6zTiKm0HZuDK" },
  { id: "insight-192967" }
];

function getPoint(id, historyItem) {
  for (const option of historyItem.options) {
    if ((id === "goodjudgmentopen-2617" || id === "infer-1263") && option.name === 'No') {
      return { x: historyItem.fetched * 1000, y: option.probability };
    } else if (id !== "goodjudgmentopen-2617" && id !== "infer-1263" && option.name === 'Yes') {
      return { x: historyItem.fetched * 1000, y: option.probability };
    }
  }
}

fetchAll(markets, getPoint).then((data) => writeJSONOutput("Putin.json", data));

// Automatically updating headlines

fetchAll(markets, getPoint).then((data) => {
  // Extract the latest probability values for each market
  const latestProbabilities = data.map(market => {
    const points = market.points;
    const lastPoint = points[points.length - 1];
    return lastPoint.y; // Assuming y represents the probability
  });

  // Calculate the min and max probabilities
  const minProbability = Math.min(...latestProbabilities);
  const maxProbability = Math.max(...latestProbabilities);

  let headline;
  // Check if all probabilities are within 5% of each other
  if (maxProbability - minProbability <= 5) {
    // Calculate the median
    latestProbabilities.sort((a, b) => a - b);
    const midIndex = Math.floor(latestProbabilities.length / 2);
    const medianProbability = latestProbabilities.length % 2 === 0
      ? (latestProbabilities[midIndex - 1] + latestProbabilities[midIndex]) / 2
      : latestProbabilities[midIndex];

    // Create the headline with the median probability
    headline = `Putin: ${medianProbability.toFixed(2)}% likely to remain in power`;
  } else {
    // Create the headline with the range of probabilities
    headline = `Putin: ${minProbability.toFixed(2)}% - ${maxProbability.toFixed(2)}% likely to remain in power`;
  }

  // Insert the headline into the HTML element with id "headline"
  document.getElementById("headlinePutin").textContent = headline;
});
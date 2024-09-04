import { fetchAll, writeJSONOutput } from './helpers.js';

const markets = [
// { name: "by Oct?", id: "goodjudgmentopen-2617" },
// { id: "metaculus-19308" },
// { id: "manifold-kVw4c6CXZlCUAhY1laVR" },
// { name: "Hamas loses power by Feb?", id: "polymarket-0xfeabd92e" },
// { name: "Hamas loses power by Jan 15?", id: "manifold-FsaZWdy6oL6gRZJe8RGJ" },
// { name: "UN troops enter Gaza by Apr?", id: "metaculus-19849" },
// { name: "Hamas loses power in Gaza by Apr?", id: "manifold-JNk4oJ5uVu6nsnsXJeOH" },

{ name: "IDF exits Gaza by Oct 2024?", id: "goodjudgmentopen-3069" },
{ name: "Israel occupies Gaza in 2024?", id: "manifold-r8ll07OIvKvXOryaTKT1" },
{ name: "Palestinians: ≥500k displaced from Gaza before 2026?", id: "metaculus-19949" },
];

function getPoint(id, historyItem) {
  for (const option of historyItem.options) {
    if (id === 'metaculus-19949' && option.name === 'Yes') {
      return { x: historyItem.fetched * 1000, y: option.probability };
    } else if (id === 'goodjudgmentopen-3069' && option.name === 'Not before 10 October 2024') {
      return { x: historyItem.fetched * 1000, y: 1 - option.probability };
    } else if (id !== 'goodjudgmentopen-3069' && option.name === 'Yes') {
      return { x: historyItem.fetched * 1000, y: option.probability };
    }
  }
}

fetchAll(markets, getPoint).then((data) => writeJSONOutput("IsraelHamasGazaControl.json", data));
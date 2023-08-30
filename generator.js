// Function to Calculate Median
function calculateMedian(arr) {
  const sorted = arr.sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }
  return sorted[middle];
}

// Function to Calculate Latest Probabilities and Last Day Probabilities
function calculateProbabilitiesAndTimestamps(datasets) {
  const dataMap = {};
  
  // Find the latest timestamp across all datasets
  let overallLatestTimestamp = new Date(0);  // Initialize to a very old date
  datasets.forEach((dataset) => {
    if (dataset.data && Array.isArray(dataset.data) && dataset.data.length > 0) {
      const lastPoint = dataset.data[dataset.data.length - 1];
      const lastTimestamp = new Date(lastPoint.x);
      if (lastTimestamp > overallLatestTimestamp) {
        overallLatestTimestamp = lastTimestamp;
      }
    }
  });
  
  // Calculate the last day of the previous month based on the overall latest timestamp
  const lastDayPrevMonth = new Date(overallLatestTimestamp.getFullYear(), overallLatestTimestamp.getMonth(), 0);
  
  // Iterate through each dataset to populate dataMap
  datasets.forEach((dataset) => {
    const id = dataset.id;
    if (dataset.data && Array.isArray(dataset.data) && dataset.data.length > 0) {
      const lastPoint = dataset.data[dataset.data.length - 1];
      const lastTimestamp = new Date(lastPoint.x);
      const closestPoint = dataset.data.reduce((prev, curr) => {
        return (Math.abs(new Date(curr.x) - lastDayPrevMonth) < Math.abs(new Date(prev.x) - lastDayPrevMonth) ? curr : prev);
      });
      const twoDays = 2 * 24 * 60 * 60 * 1000;
      if (Math.abs(new Date(closestPoint.x) - lastDayPrevMonth) <= twoDays) {
        dataMap[id] = {
          latestProbability: lastPoint.y,
          latestTimestamp: lastTimestamp.toString(),
          lastDayProbability: closestPoint.y,
          lastDayTimestamp: new Date(closestPoint.x).toString()
        };
      } else {
        dataMap[id] = {
          latestProbability: lastPoint.y,
          latestTimestamp: lastTimestamp.toString(),
          lastDayProbability: 'Data missing',
          lastDayTimestamp: 'Timestamp missing'
        };
      }
    } else {
      dataMap[id] = {
        latestProbability: 'Data missing',
        latestTimestamp: 'Timestamp missing',
        lastDayProbability: 'Data missing',
        lastDayTimestamp: 'Timestamp missing'
      };
    }
  });
  return dataMap;
}

// Function to Create Table
function createTable(datasets, dataMap, container) {
  const tableContainer = container.querySelector('.tableContainer');
  const table = document.createElement('table');
  const headerRow = document.createElement('tr');
  ['ID', 'Latest Probability', 'Latest Timestamp', 'Last Day of Previous Month Probability', 'Last Day of Previous Month Timestamp'].forEach(text => {
    const th = document.createElement('th');
    th.appendChild(document.createTextNode(text));
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  datasets.forEach((dataset) => {
    const row = document.createElement('tr');
    const id = dataset.id || 'ID Missing';
    if (!dataset.id) {
      console.debug('Debug: Missing ID for dataset:', dataset);
    }
    const data = dataMap[id];
    [id, data.latestProbability, data.latestTimestamp, data.lastDayProbability, data.lastDayTimestamp].forEach(text => {
      const td = document.createElement('td');
      td.appendChild(document.createTextNode(text));
      row.appendChild(td);
    });
    table.appendChild(row);
  });
  tableContainer.appendChild(table);
}

// Function to display the medians
function displayMedians(container, medianLatest, medianLastDay) {
  const medianDisplayElement = container.querySelector('.medianDisplay');
  if (medianDisplayElement) {
    medianDisplayElement.textContent = `Latest Median: ${medianLatest}, Last Day of Previous Month Median: ${medianLastDay}`;
  } else {
    console.error('Median display element not found in the container.');
  }
}

// Function to create headlines
function createHeadline(container, medianLatest, percentagePointDifference, dataMap, dataFileName) {
  const headlineElement = container.querySelector('.headline');
  if (headlineElement) {
    let headlineText = '';
    const medianLatestPercent = Math.round(medianLatest * 100);
    const percentagePointDifferencePoints = Math.round(percentagePointDifference * 100);
    switch (dataFileName) {
      //Crimea     
      case 'Crimea.json':
        const idsForCrimea = ['goodjudgmentopen-2967', 'manifold-8dD3vNDbHnPCx3movLl9', 'metaculus-10737'];
        const highestProb = Math.max(...idsForCrimea.map(id => dataMap[id]?.latestProbability || 0));
        const highestLastDayProb = Math.max(...idsForCrimea.map(id => dataMap[id]?.lastDayProbability).filter(x => !isNaN(x)));
        const highestProbPercent = Math.round(highestProb * 100);
        const highestProbPointDifference = Math.round((highestProb - highestLastDayProb) * 100);
        headlineText = `Crimea: up to ${highestProbPercent}% chance of territory being retaken`;
        //if (Math.abs(highestProbPointDifference) >= 1) {
        //  const direction = (highestProbPointDifference > 0) ? 'up' : 'down';
        //  headlineText += `, ${direction} ${highestProbPointDifference >= 0 ? '+' : ''}${highestProbPointDifference} points this month`;
        //}
        break;
      
      //Crimea2
      case 'Crimea2.json':
        const octProb = Math.round(dataMap['insight-154445'].latestProbability * 100);
        const novProb = Math.round(dataMap['polymarket-0xda2cef9f'].latestProbability * 100);
        const yearProb = Math.round(dataMap['metaculus-13531'].latestProbability * 100);
        headlineText = `Crimea land bridge: ${novProb}% chance of being cut by Nov, ${yearProb}% by 2024`;
        break;
     
     //Kerch
      case 'Kerch.json':
        const idsForKerch = ['metaculus-13989', 'manifold-7GJmdx2kAsqTiusZWppI'];
        const latestProbabilitiesKerch = idsForKerch.map(id => dataMap[id]?.latestProbability || 0).filter(x => !isNaN(x));
        const lastDayProbabilitiesKerch = idsForKerch.map(id => dataMap[id]?.lastDayProbability).filter(x => !isNaN(x));
        const medianLatestKerch = calculateMedian(latestProbabilitiesKerch);
        const medianLastDayKerch = calculateMedian(lastDayProbabilitiesKerch);
        const percentagePointDifferenceKerch = Math.round((medianLatestKerch - medianLastDayKerch) * 100);
        const medianLatestPercentKerch = Math.round(medianLatestKerch * 100);
        headlineText = `Kerch: ~${medianLatestPercentKerch}% chance of being cut`;
        if (Math.abs(percentagePointDifferenceKerch) >= 1) {
          const direction = (percentagePointDifferenceKerch > 0) ? 'up' : 'down';
          headlineText += `, ${direction} ${percentagePointDifferenceKerch >= 0 ? '+' : ''}${percentagePointDifferenceKerch} points this month`;
        }
        break;
      
      //Putin
      case 'Putin.json':
        headlineText = `Putin: ~${medianLatestPercent}% likely to stay in power`;
        if (Math.abs(percentagePointDifferencePoints) >= 1) {
          const direction = (percentagePointDifferencePoints > 0) ? 'up' : 'down';
          headlineText += `, ${direction} ${percentagePointDifferencePoints >= 0 ? '+' : ''}${percentagePointDifferencePoints} points this month`;
        }
        break;
      
      //Default
      default:
        headlineText = `Latest ${medianLatestPercent}%`;
        if (Math.abs(percentagePointDifferencePoints) >= 1) {
          const direction = (percentagePointDifferencePoints > 0) ? 'up' : 'down';
          headlineText += `, ${direction} ${percentagePointDifferencePoints >= 0 ? '+' : ''}${percentagePointDifferencePoints} points this month`;
        }
        break;
    }
    //Create element
    const h4 = document.createElement('h4');
    h4.textContent = headlineText;
    headlineElement.appendChild(h4);
  } else {
    console.error('Headline element not found in the container.');
  }
}

// Main part of the script
document.addEventListener('DOMContentLoaded', (event) => {
  const baseUrl = 'https://raw.githubusercontent.com/mqp/metaforecast-downloader/master/data';
  Chart.Interaction.modes.priorX = priorXInteractionMode;
  for (const container of document.querySelectorAll('.chart-container')) {
    fetchChartDatasets(`${baseUrl}/${container.dataset.file}`).then((datasets) => {
      buildChart(container, datasets);
      const dataMap = calculateProbabilitiesAndTimestamps(datasets);
      const latestProbabilities = Object.values(dataMap).map(data => data.latestProbability);
      const lastDayProbabilities = Object.values(dataMap).map(data => data.lastDayProbability);
      const medianLatest = calculateMedian(latestProbabilities.filter(x => x !== 'Data missing'));
      const medianLastDay = calculateMedian(lastDayProbabilities.filter(x => x !== 'Data missing'));
      const percentagePointDifference = medianLatest - medianLastDay;
      createTable(datasets, dataMap, container);
      displayMedians(container, medianLatest, medianLastDay);
      const dataFileName = container.dataset.file;
      createHeadline(container, medianLatest, percentagePointDifference, dataMap, dataFileName);
    });
  }
});
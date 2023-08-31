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

// Function to create headlines
function createHeadline(container, medianLatest, percentagePointDifference, dataMap, dataFileName) {
  const headlineElement = container.querySelector('.headline');
  if (headlineElement) {
    let headlineText = '';
    let subHeadlineText = '';
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
          
        //Escalation
          case 'Escalation.json':
            const escalationId = 'metaculus-8148';
            const latestProbabilityEscalation = dataMap[escalationId]?.latestProbability || 0;
            const lastDayProbabilityEscalation = dataMap[escalationId]?.lastDayProbability || 0;
            const percentagePointDifferenceEscalation = Math.round((latestProbabilityEscalation - lastDayProbabilityEscalation) * 100);
            const latestPercentEscalation = Math.round(latestProbabilityEscalation * 100);
            headlineText = `Escalation: ${latestPercentEscalation}% risk of Russian clash with NATO excl. US`;
            if (Math.abs(percentagePointDifferenceEscalation) >= 1) {
              const direction = (percentagePointDifferenceEscalation > 0) ? 'up' : 'down';
              headlineText += `, ${direction} ${percentagePointDifferenceEscalation >= 0 ? '+' : ''}${percentagePointDifferenceEscalation} points this month`;
            }
         
         //sub-Escalation
            const idsForSubEscalation = ['metaculus-7449', 'goodjudgmentopen-2913'];
            const latestProbabilitiesSubEscalation = idsForSubEscalation.map(id => dataMap[id]?.latestProbability || 0).filter(x => !isNaN(x));
            const lastDayProbabilitiesSubEscalation = idsForSubEscalation.map(id => dataMap[id]?.lastDayProbability || 0).filter(x => !isNaN(x));
            const medianLatestSubEscalation = calculateMedian(latestProbabilitiesSubEscalation);
            const medianLastDaySubEscalation = calculateMedian(lastDayProbabilitiesSubEscalation);
            const percentagePointDifferenceSubEscalation = Math.round((medianLatestSubEscalation - medianLastDaySubEscalation) * 100);
            const medianLatestPercentSubEscalation = Math.round(medianLatestSubEscalation * 100);
            subHeadlineText = `~${medianLatestPercentSubEscalation}% risk of Russian clash with NATO incl. US`;
            if (Math.abs(percentagePointDifferenceSubEscalation) >= 1) {
              const directionSub = (percentagePointDifferenceSubEscalation > 0) ? 'up' : 'down';
              subHeadlineText += `, ${directionSub} ${percentagePointDifferenceSubEscalation >= 0 ? '+' : ''}${percentagePointDifferenceSubEscalation} points this month`;
            }
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
            headlineText = `Kerch bridge: ~${medianLatestPercentKerch}% chance of being cut`;
            if (Math.abs(percentagePointDifferenceKerch) >= 1) {
              const direction = (percentagePointDifferenceKerch > 0) ? 'up' : 'down';
              headlineText += `, ${direction} ${percentagePointDifferenceKerch >= 0 ? '+' : ''}${percentagePointDifferenceKerch} points this month`;
            }
         
         //sub-Kerch
            const kerchSubId = 'metaculus-12569';
            const latestProbabilityKerchSub = dataMap[kerchSubId]?.latestProbability || 0;
            const lastDayProbabilityKerchSub = dataMap[kerchSubId]?.lastDayProbability || 0;
            const percentagePointDifferenceKerchSub = Math.round((latestProbabilityKerchSub - lastDayProbabilityKerchSub) * 100);
            const latestPercentKerchSub = Math.round(latestProbabilityKerchSub * 100);
            subHeadlineText = `${latestPercentKerchSub}% chance of being made impassible for 7 days`;
            if (Math.abs(percentagePointDifferenceKerchSub) >= 1) {
              const directionSub = (percentagePointDifferenceKerchSub > 0) ? 'up' : 'down';
              subHeadlineText += `, ${directionSub} ${percentagePointDifferenceKerchSub >= 0 ? '+' : ''}${percentagePointDifferenceKerchSub} points this month`;
            }
          break;
         
     //Nuclear
     case 'Nuclear.json':
  const idsForNuclear = ['metaculus-13171', 'metaculus-2797', 'manifold-CBCpG7AUU4pnsbyBn0bg', 'goodjudgmentopen-2634'];
  const highestProbNuclear = Math.max(...idsForNuclear.map(id => dataMap[id]?.latestProbability || 0));
  const highestLastDayProbNuclear = Math.max(...idsForNuclear.map(id => dataMap[id]?.lastDayProbability).filter(x => !isNaN(x)));
  const highestProbPercentNuclear = Math.round(highestProbNuclear * 100);
  const highestProbPointDifferenceNuclear = Math.round((highestProbNuclear - highestLastDayProbNuclear) * 100);
  headlineText = `Atomic bomb: up to ~${highestProbPercentNuclear}% risk of use in combat`;
  if (Math.abs(highestProbPointDifferenceNuclear) >= 1) {
    const direction = (highestProbPointDifferenceNuclear > 0) ? 'up' : 'down';
    headlineText += `, ${direction} ${highestProbPointDifferenceNuclear >= 0 ? '+' : ''}${highestProbPointDifferenceNuclear} points this month`;
  }

  //sub-Nuclear
  const latestProbabilityNuclearSub = dataMap['metaculus-10154']?.latestProbability || 0;
  const lastDayProbabilityNuclearSub = dataMap['metaculus-10154']?.lastDayProbability || 0;
  const percentagePointDifferenceNuclearSub = Math.round((latestProbabilityNuclearSub - lastDayProbabilityNuclearSub) * 100);
  const latestPercentNuclearSub = Math.round(latestProbabilityNuclearSub * 100);
  subHeadlineText = `Radiation incident at Ukrainian plant: ${latestPercentNuclearSub}% risk`;
  if (Math.abs(percentagePointDifferenceNuclearSub) >= 1) {
    const directionSub = (percentagePointDifferenceNuclearSub > 0) ? 'up' : 'down';
    subHeadlineText += `, ${directionSub} ${percentagePointDifferenceNuclearSub >= 0 ? '+' : ''}${percentagePointDifferenceNuclearSub} points this month`;
  }
  break;
       
      // Peace
case 'Peace.json':
  const idsForPeaceHeader = ['metaculus-13985']; // Add , 'polymarket-0x30afc488' when fixed on Metafct
  const latestProbabilitiesPeaceHeader = idsForPeaceHeader.map(id => dataMap[id]?.latestProbability || 0).filter(x => !isNaN(x));
  const lastDayProbabilitiesPeaceHeader = idsForPeaceHeader.map(id => dataMap[id]?.lastDayProbability || 0).filter(x => !isNaN(x));
  const medianLatestPeaceHeader = calculateMedian(latestProbabilitiesPeaceHeader);
  const medianLastDayPeaceHeader = calculateMedian(lastDayProbabilitiesPeaceHeader);
  const percentagePointDifferencePeaceHeader = Math.round((medianLatestPeaceHeader - medianLastDayPeaceHeader) * 100);
  const medianLatestPercentPeaceHeader = Math.round(medianLatestPeaceHeader * 100);
  headlineText = `Ceasefire: ~${medianLatestPercentPeaceHeader}% chance`;
  if (Math.abs(percentagePointDifferencePeaceHeader) >= 1) {
    const direction = (percentagePointDifferencePeaceHeader > 0) ? 'up' : 'down';
    headlineText += `, ${direction} ${percentagePointDifferencePeaceHeader >= 0 ? '+' : ''}${percentagePointDifferencePeaceHeader} points this month`;
  }

      // Sub-Peace
      const idsForPeaceSubHeader = ['goodjudgmentopen-2951', 'manifold-IY4cZAXStA3cvcqCDJqR']; // Add , 'insight-224920' once Metafct is fixed
      const latestProbabilitiesPeaceSubHeader = idsForPeaceSubHeader.map(id => dataMap[id]?.latestProbability || 0).filter(x => !isNaN(x));
      const lastDayProbabilitiesPeaceSubHeader = idsForPeaceSubHeader.map(id => dataMap[id]?.lastDayProbability || 0).filter(x => !isNaN(x));
      const medianLatestPeaceSubHeader = calculateMedian(latestProbabilitiesPeaceSubHeader);
      const medianLastDayPeaceSubHeader = calculateMedian(lastDayProbabilitiesPeaceSubHeader);
      const percentagePointDifferencePeaceSubHeader = Math.round((medianLatestPeaceSubHeader - medianLastDayPeaceSubHeader) * 100);
      const medianLatestPercentPeaceSubHeader = Math.round(medianLatestPeaceSubHeader * 100);
      subHeadlineText = `War ends: ~${medianLatestPercentPeaceSubHeader}% chance`;
      if (Math.abs(percentagePointDifferencePeaceSubHeader) >= 1) {
        const directionSub = (percentagePointDifferencePeaceSubHeader > 0) ? 'up' : 'down';
        subHeadlineText += `, ${directionSub} ${percentagePointDifferencePeaceSubHeader >= 0 ? '+' : ''}${percentagePointDifferencePeaceSubHeader} points this month`;
}
break;
         
//Putin
          case 'Putin.json':
            headlineText = `Putin: ~${medianLatestPercent}% likely to stay in power`;
            if (Math.abs(percentagePointDifferencePoints) >= 1) {
              const direction = (percentagePointDifferencePoints > 0) ? 'up' : 'down';
              headlineText += `, ${direction} ${percentagePointDifferencePoints >= 0 ? '+' : ''}${percentagePointDifferencePoints} points this month`;
            }
         
         //sub-Putin
           subHeadlineText += `Recovered beyond pre-Wagner mutiny level (~92%)`;
          break;
      
                 //Territory
    case 'Territory.json':
      const idsForTerritoryHeadline = ['metaculus-10745', 'insight-146589'];
      const latestProbabilitiesTerritoryHeadline = idsForTerritoryHeadline.map(id => dataMap[id]?.latestProbability || 0).filter(x => !isNaN(x));
      const lastDayProbabilitiesTerritoryHeadline = idsForTerritoryHeadline.map(id => dataMap[id]?.lastDayProbability || 0).filter(x => !isNaN(x));
      const medianLatestTerritoryHeadline = calculateMedian(latestProbabilitiesTerritoryHeadline);
      const medianLastDayTerritoryHeadline = calculateMedian(lastDayProbabilitiesTerritoryHeadline);
      const percentagePointDifferenceTerritoryHeadline = Math.round((medianLatestTerritoryHeadline - medianLastDayTerritoryHeadline) * 100);
      const medianLatestPercentTerritoryHeadline = Math.round(medianLatestTerritoryHeadline * 100);
      headlineText = `Russia gains territory: ~${medianLatestPercentTerritoryHeadline}% likely`;
      if (Math.abs(percentagePointDifferenceTerritoryHeadline) >= 1) {
        const direction = (percentagePointDifferenceTerritoryHeadline > 0) ? 'up' : 'down';
        headlineText += `, ${direction} ${percentagePointDifferenceTerritoryHeadline >= 0 ? '+' : ''}${percentagePointDifferenceTerritoryHeadline} points this month`;
      }
      
      //sub-Territory
      const idsForTerritorySubHeadline = ['goodjudgmentopen-2859', 'metaculus-10738'];
      const latestProbabilitiesTerritorySubHeadline = idsForTerritorySubHeadline.map(id => dataMap[id]?.latestProbability || 0).filter(x => !isNaN(x));
      const lastDayProbabilitiesTerritorySubHeadline = idsForTerritorySubHeadline.map(id => dataMap[id]?.lastDayProbability || 0).filter(x => !isNaN(x));
      const medianLatestTerritorySubHeadline = calculateMedian(latestProbabilitiesTerritorySubHeadline);
      const medianLastDayTerritorySubHeadline = calculateMedian(lastDayProbabilitiesTerritorySubHeadline);
      const percentagePointDifferenceTerritorySubHeadline = Math.round((medianLatestTerritorySubHeadline - medianLastDayTerritorySubHeadline) * 100);
      const medianLatestPercentTerritorySubHeadline = Math.round(medianLatestTerritorySubHeadline * 100);
      subHeadlineText = `DNR/LNR: ~${medianLatestPercentTerritorySubHeadline}% chance of being retaken by Ukraine`;
      if (Math.abs(percentagePointDifferenceTerritorySubHeadline) >= 1) {
        const directionSub = (percentagePointDifferenceTerritorySubHeadline > 0) ? 'up' : 'down';
        subHeadlineText += `, ${directionSub} ${percentagePointDifferenceTerritorySubHeadline >= 0 ? '+' : ''}${percentagePointDifferenceTerritorySubHeadline} points this month`;
      }      
    break;

      // Wagner
      case 'Wagner.json':
        const idsForWagner = ['manifold-onhTHDgQVDpX6V5inItM', 'metaculus-10246'];
        const latestProbabilitiesWagner = idsForWagner.map(id => dataMap[id]?.latestProbability || 0).filter(x => !isNaN(x));
        const lastDayProbabilitiesWagner = idsForWagner.map(id => dataMap[id]?.lastDayProbability || 0).filter(x => !isNaN(x));
        const medianLatestWagner = calculateMedian(latestProbabilitiesWagner);
        const medianLastDayWagner = calculateMedian(lastDayProbabilitiesWagner);
        const percentagePointDifferenceWagner = Math.round((medianLatestWagner - medianLastDayWagner) * 100);
        const medianLatestPercentWagner = Math.round(medianLatestWagner * 100);
        headlineText = `Russian coup: ~${medianLatestPercentWagner}% chance`;
        if (Math.abs(percentagePointDifferenceWagner) >= 1) {
          const direction = (percentagePointDifferenceWagner > 0) ? 'up' : 'down';
          headlineText += `, ${direction} ${percentagePointDifferenceWagner >= 0 ? '+' : ''}${percentagePointDifferenceWagner} points this month`;
        }
        break;

        // Threads
case 'Threads.json':
  const idsForThreads = ['metaculus-14259', 'manifold-qqFkvYHzzpTuonxnBWpN'];
  const latestProbabilitiesThreads = idsForThreads.map(id => dataMap[id]?.latestProbability || 0).filter(x => !isNaN(x));
  const lastDayProbabilitiesThreads = idsForThreads.map(id => dataMap[id]?.lastDayProbability || 0).filter(x => !isNaN(x));
  const medianLatestThreads = calculateMedian(latestProbabilitiesThreads);
  const medianLastDayThreads = calculateMedian(lastDayProbabilitiesThreads);
  const percentagePointDifferenceThreads = Math.round((medianLatestThreads - medianLastDayThreads) * 100);
  const medianLatestPercentThreads = Math.round(medianLatestThreads * 100);
  headlineText = `Twitter user growth: ~${medianLatestPercentThreads}% likely`;
  if (Math.abs(percentagePointDifferenceThreads) >= 1) {
    const direction = (percentagePointDifferenceThreads > 0) ? 'up' : 'down';
    headlineText += `, ${direction} ${percentagePointDifferenceThreads >= 0 ? '+' : ''}${percentagePointDifferenceThreads} points this month`;
  }

  // Sub-Threads
  const xxProb = Math.round(dataMap['manifold-FxpNqBVG6NIvmZFVqG1P'].latestProbability * 100);
  const yyProb = Math.round(dataMap['manifold-JxcpJTGSurSdSMlFxYhL'].latestProbability * 100);
  subHeadlineText = `Threads overtakes Twitter: ${xxProb}% chance by 2024, ${yyProb}% by 2025`;
  break;

  // Threads2
case 'Threads2.json':
  const idsForThreads2 = ['goodjudgmentopen-2631', 'polymarket-0x950eb697'];
  const latestProbabilitiesThreads2 = idsForThreads2.map(id => dataMap[id]?.latestProbability || 0).filter(x => !isNaN(x));
  const lastDayProbabilitiesThreads2 = idsForThreads2.map(id => dataMap[id]?.lastDayProbability || 0).filter(x => !isNaN(x));
  const medianLatestThreads2 = calculateMedian(latestProbabilitiesThreads2);
  const medianLastDayThreads2 = calculateMedian(lastDayProbabilitiesThreads2);
  const percentagePointDifferenceThreads2 = Math.round((medianLatestThreads2 - medianLastDayThreads2) * 100);
  const medianLatestPercentThreads2 = Math.round(medianLatestThreads2 * 100);
  headlineText = `Twitter bankruptcy: ~${medianLatestPercentThreads2}% chance`;
  if (Math.abs(percentagePointDifferenceThreads2) >= 1) {
    const direction = (percentagePointDifferenceThreads2 > 0) ? 'up' : 'down';
    headlineText += `, ${direction} ${percentagePointDifferenceThreads2 >= 0 ? '+' : ''}${percentagePointDifferenceThreads2} points this month`;
  }

  // Sub-Threads2
  const idsForSubThreads2 = ['metaculus-14257', 'manifold-SttdxBP4Edxqzq0ScDCH'];
  const latestProbabilitiesSubThreads2 = idsForSubThreads2.map(id => dataMap[id]?.latestProbability || 0).filter(x => !isNaN(x));
  const lastDayProbabilitiesSubThreads2 = idsForSubThreads2.map(id => dataMap[id]?.lastDayProbability || 0).filter(x => !isNaN(x));
  const medianLatestSubThreads2 = calculateMedian(latestProbabilitiesSubThreads2);
  const medianLastDaySubThreads2 = calculateMedian(lastDayProbabilitiesSubThreads2);
  const percentagePointDifferenceSubThreads2 = Math.round((medianLatestSubThreads2 - medianLastDaySubThreads2) * 100);
  const medianLatestPercentSubThreads2 = Math.round(medianLatestSubThreads2 * 100);
  subHeadlineText = `Elon Musk stays the owner of Twitter: ~${medianLatestPercentSubThreads2}% likely`;
  if (Math.abs(percentagePointDifferenceSubThreads2) >= 1) {
    const directionSub = (percentagePointDifferenceSubThreads2 > 0) ? 'up' : 'down';
    subHeadlineText += `, ${directionSub} ${percentagePointDifferenceSubThreads2 >= 0 ? '+' : ''}${percentagePointDifferenceSubThreads2} points this month`;
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
    //Create header
    const h4 = document.createElement('h4');
    h4.textContent = headlineText;
    headlineElement.appendChild(h4);
    //Create sub-header
    const subHeadlineElement = document.createElement('h5');
    subHeadlineElement.textContent = subHeadlineText;
    headlineElement.appendChild(subHeadlineElement);
    //Create error msg
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
      const dataFileName = container.dataset.file;
      createHeadline(container, medianLatest, percentagePointDifference, dataMap, dataFileName);
    });
  }
});
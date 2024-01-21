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
        const idsForCrimea = ['goodjudgmentopen-3164', 'manifold-el2oeAPlwm4u0LBKLQXx', 'manifold-p3UsYkHmZ6Xj09ybEo08'];
        const highestProb = Math.max(...idsForCrimea.map(id => dataMap[id]?.latestProbability || 0));
        const highestLastDayProb = Math.max(...idsForCrimea.map(id => dataMap[id]?.lastDayProbability).filter(x => !isNaN(x)));
        const highestProbPercent = Math.round(highestProb * 100);
        const highestProbPointDifference = Math.round((highestProb - highestLastDayProb) * 100);
        headlineText = `Crimea: up to ${highestProbPercent}% chance of territory being retaken by 2027`;
        if (Math.abs(highestProbPointDifference) >= 1) {
          const direction = (highestProbPointDifference > 0) ? 'up' : 'down';
          headlineText += `, ${direction} ${highestProbPointDifference >= 0 ? '+' : ''}${highestProbPointDifference} points this month`;
        }
        break;
      
      //Crimea2
      case 'Crimea2.json':
        const idsForCrimea2 = ['metaculus-20533', 'goodjudgmentopen-3089'];
        const highestProbCrimea2 = Math.max(...idsForCrimea2.map(id => dataMap[id]?.latestProbability || 0));
        const highestLastDayProbCrimea2 = Math.max(...idsForCrimea2.map(id => dataMap[id]?.lastDayProbability).filter(x => !isNaN(x)));
        const highestProbPercentCrimea2 = Math.round(highestProbCrimea2 * 100);
        const highestProbPointDifferenceCrimea2 = Math.round((highestProbCrimea2 - highestLastDayProbCrimea2) * 100);
        headlineText = `Crimea land bridge: up to ${highestProbPercentCrimea2}% chance of being cut in 2024`;
        if (Math.abs(highestProbPointDifferenceCrimea2) >= 1) {
          const direction = (highestProbPointDifferenceCrimea2 > 0) ? 'up' : 'down';
          headlineText += `, ${direction} ${highestProbPointDifferenceCrimea2 >= 0 ? '+' : ''}${highestProbPointDifferenceCrimea2} points this month`;
        }
        break;
          
      //Escalation
        case 'Escalation.json':
            const escalationId = 'goodjudgmentopen-3173';
            const latestProbabilityEscalation = dataMap[escalationId]?.latestProbability || 0;
            const lastDayProbabilityEscalation = dataMap[escalationId]?.lastDayProbability || 0;
            const percentagePointDifferenceEscalation = Math.round((latestProbabilityEscalation - lastDayProbabilityEscalation) * 100);
            const latestPercentEscalation = Math.round(latestProbabilityEscalation * 100);
            headlineText = `Escalation: ${latestPercentEscalation}% risk of Russian clash with NATO by Sept`;
            if (Math.abs(percentagePointDifferenceEscalation) >= 1) {
              const direction = (percentagePointDifferenceEscalation > 0) ? 'up' : 'down';
              headlineText += `, ${direction} ${percentagePointDifferenceEscalation >= 0 ? '+' : ''}${percentagePointDifferenceEscalation} points this month`;
            }
         
         //sub-Escalation
            const idsForSubEscalation = ['metaculus-7452'];
            const latestProbabilitiesSubEscalation = idsForSubEscalation.map(id => dataMap[id]?.latestProbability || 0).filter(x => !isNaN(x));
            const lastDayProbabilitiesSubEscalation = idsForSubEscalation.map(id => dataMap[id]?.lastDayProbability || 0).filter(x => !isNaN(x));
            const medianLatestSubEscalation = calculateMedian(latestProbabilitiesSubEscalation);
            const medianLastDaySubEscalation = calculateMedian(lastDayProbabilitiesSubEscalation);
            const percentagePointDifferenceSubEscalation = Math.round((medianLatestSubEscalation - medianLastDaySubEscalation) * 100);
            const medianLatestPercentSubEscalation = Math.round(medianLatestSubEscalation * 100);
            subHeadlineText = `Russia-US war ~${medianLatestPercentSubEscalation}% likely by 2050`;
            if (Math.abs(percentagePointDifferenceSubEscalation) >= 1) {
              const directionSub = (percentagePointDifferenceSubEscalation > 0) ? 'up' : 'down';
              subHeadlineText += `, ${directionSub} ${percentagePointDifferenceSubEscalation >= 0 ? '+' : ''}${percentagePointDifferenceSubEscalation} points this month`;
            }
            break;
         
      //Kerch
          case 'Kerch.json':
            const idsForKerch = ['metaculus-10043'];
            const latestProbabilitiesKerch = idsForKerch.map(id => dataMap[id]?.latestProbability || 0).filter(x => !isNaN(x));
            const lastDayProbabilitiesKerch = idsForKerch.map(id => dataMap[id]?.lastDayProbability).filter(x => !isNaN(x));
            const medianLatestKerch = calculateMedian(latestProbabilitiesKerch);
            const medianLastDayKerch = calculateMedian(lastDayProbabilitiesKerch);
            const percentagePointDifferenceKerch = Math.round((medianLatestKerch - medianLastDayKerch) * 100);
            const medianLatestPercentKerch = Math.round(medianLatestKerch * 100);
            headlineText = `Ukraine ~${medianLatestPercentKerch}% likely to join the EU by 2030`;
            if (Math.abs(percentagePointDifferenceKerch) >= 1) {
              const direction = (percentagePointDifferenceKerch > 0) ? 'up' : 'down';
              headlineText += `, ${direction} ${percentagePointDifferenceKerch >= 0 ? '+' : ''}${percentagePointDifferenceKerch} points this month`;
            }
         
         //sub-Kerch
            const kerchSubId = 'metaculus-18862';
            const latestProbabilityKerchSub = dataMap[kerchSubId]?.latestProbability || 0;
            const lastDayProbabilityKerchSub = dataMap[kerchSubId]?.lastDayProbability || 0;
            const percentagePointDifferenceKerchSub = Math.round((latestProbabilityKerchSub - lastDayProbabilityKerchSub) * 100);
            const latestPercentKerchSub = Math.round(latestProbabilityKerchSub * 100);
            subHeadlineText = `Ukraine ~${latestPercentKerchSub}% likely to join NATO by 2035`;
            if (Math.abs(percentagePointDifferenceKerchSub) >= 1) {
              const directionSub = (percentagePointDifferenceKerchSub > 0) ? 'up' : 'down';
              subHeadlineText += `, ${directionSub} ${percentagePointDifferenceKerchSub >= 0 ? '+' : ''}${percentagePointDifferenceKerchSub} points this month`;
            }
          break;
         
     //Nuclear
     case 'Nuclear.json':
  const idsForNuclear = ['goodjudgmentopen-3017'];
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
  const latestProbabilityNuclearSub = dataMap['goodjudgmentopen-3016']?.latestProbability || 0;
const lastDayProbabilityNuclearSub = dataMap['goodjudgmentopen-3016']?.lastDayProbability || 0;
  const percentagePointDifferenceNuclearSub = Math.round((latestProbabilityNuclearSub - lastDayProbabilityNuclearSub) * 100);
  const latestPercentNuclearSub = Math.round(latestProbabilityNuclearSub * 100);
  subHeadlineText = `Russia ~${latestPercentNuclearSub}% likely to move nuclear weapons into Ukrainian boundries`;
  if (Math.abs(percentagePointDifferenceNuclearSub) >= 1) {
    const directionSub = (percentagePointDifferenceNuclearSub > 0) ? 'up' : 'down';
    subHeadlineText += `, ${directionSub} ${percentagePointDifferenceNuclearSub >= 0 ? '+' : ''}${percentagePointDifferenceNuclearSub} points this month`;
  }
  break;
       
      // Peace
case 'Peace.json':
  //const idsForPeaceHeader = ['metaculus-13985', 'polymarket-0x30afc488'];
  //const latestProbabilitiesPeaceHeader = idsForPeaceHeader.map(id => dataMap[id]?.latestProbability || 0).filter(x => !isNaN(x));
  //const lastDayProbabilitiesPeaceHeader = idsForPeaceHeader.map(id => dataMap[id]?.lastDayProbability || 0).filter(x => !isNaN(x));
  //const medianLatestPeaceHeader = calculateMedian(latestProbabilitiesPeaceHeader);
  //const medianLastDayPeaceHeader = calculateMedian(lastDayProbabilitiesPeaceHeader);
  //const percentagePointDifferencePeaceHeader = Math.round((medianLatestPeaceHeader - medianLastDayPeaceHeader) * 100);
  //const medianLatestPercentPeaceHeader = Math.round(medianLatestPeaceHeader * 100);
  //headlineText = `Russia-Ukraine ceasefire: ~${medianLatestPercentPeaceHeader}% chance`;
  //if (Math.abs(percentagePointDifferencePeaceHeader) >= 1) {
  //  const direction = (percentagePointDifferencePeaceHeader > 0) ? 'up' : 'down';
  //  headlineText += `, ${direction} ${percentagePointDifferencePeaceHeader >= 0 ? '+' : ''}${percentagePointDifferencePeaceHeader} points this month`;
  //}

  const idsForPeace2 = ['goodjudgmentopen-2951', 'goodjudgmentopen-3114', 'manifold-a01aHewEJNDOl4fIKaAU'];
  const highestProbPeace2 = Math.max(...idsForPeace2.map(id => dataMap[id]?.latestProbability || 0));
  const highestLastDayProbPeace2 = Math.max(...idsForPeace2.map(id => dataMap[id]?.lastDayProbability).filter(x => !isNaN(x)));
  const highestProbPercentPeace2 = Math.round(highestProbPeace2 * 100);
  const highestProbPointDifferencePeace2 = Math.round((highestProbPeace2 - highestLastDayProbPeace2) * 100);
  headlineText = `Russia-Ukraine peace: up to ${highestProbPercentPeace2}% chance in 2024`;
  if (Math.abs(highestProbPointDifferencePeace2) >= 1) {
    const direction = (highestProbPointDifferencePeace2 > 0) ? 'up' : 'down';
    headlineText += `, ${direction} ${highestProbPointDifferencePeace2 >= 0 ? '+' : ''}${highestProbPointDifferencePeace2} points this month`;
  }


      // Sub-Peace
      const idsForPeaceSubHeader = ['manifold-YYKCHy5ITvvCU00g8hEr'];
      const latestProbabilitiesPeaceSubHeader = idsForPeaceSubHeader.map(id => dataMap[id]?.latestProbability || 0).filter(x => !isNaN(x));
      const lastDayProbabilitiesPeaceSubHeader = idsForPeaceSubHeader.map(id => dataMap[id]?.lastDayProbability || 0).filter(x => !isNaN(x));
      const medianLatestPeaceSubHeader = calculateMedian(latestProbabilitiesPeaceSubHeader);
      const medianLastDayPeaceSubHeader = calculateMedian(lastDayProbabilitiesPeaceSubHeader);
      const percentagePointDifferencePeaceSubHeader = Math.round((medianLatestPeaceSubHeader - medianLastDayPeaceSubHeader) * 100);
      const medianLatestPercentPeaceSubHeader = Math.round(medianLatestPeaceSubHeader * 100);
      subHeadlineText = `Russia-Ukraine peace talks ~${medianLatestPercentPeaceSubHeader}% likely in 2024`;
      if (Math.abs(percentagePointDifferencePeaceSubHeader) >= 1) {
        const directionSub = (percentagePointDifferencePeaceSubHeader > 0) ? 'up' : 'down';
        subHeadlineText += `, ${directionSub} ${percentagePointDifferencePeaceSubHeader >= 0 ? '+' : ''}${percentagePointDifferencePeaceSubHeader} points this month`;
}
break;
         
//Putin
          case 'Putin.json':
          const idsForPutin = ['manifold-Nc8DWWUyYm6CQp6PvOEv'];
          const latestProbabilitiesPutin = idsForPutin.map(id => dataMap[id]?.latestProbability || 0).filter(x => !isNaN(x));
          const lastDayProbabilitiesPutin = idsForPutin.map(id => dataMap[id]?.lastDayProbability || 0).filter(x => !isNaN(x));
          const medianLatestPutin = calculateMedian(latestProbabilitiesPutin);
          const medianLastDayPutin = calculateMedian(lastDayProbabilitiesPutin);
          const percentagePointDifferencePutin = Math.round((medianLatestPutin - medianLastDayPutin) * 100);
          const medianLatestPercentPutin = Math.round(medianLatestPutin * 100);
          headlineText = `Putin ~${medianLatestPercentPutin}% likely stay President in 2024`;
          if (Math.abs(percentagePointDifferencePutin) >= 1) {
            const direction = (percentagePointDifferencePutin > 0) ? 'up' : 'down';
            headlineText += `, ${direction} ${percentagePointDifferencePutin >= 0 ? '+' : ''}${percentagePointDifferencePutin} points this month`;
          }

          const idsForMartialLawSubHeadline = ['metaculus-17682'];
          const latestProbabilitiesMartialLawSubHeadline = idsForMartialLawSubHeadline.map(id => dataMap[id]?.latestProbability || 0).filter(x => !isNaN(x));
          const lastDayProbabilitiesMartialLawSubHeadline = idsForMartialLawSubHeadline.map(id => dataMap[id]?.lastDayProbability || 0).filter(x => !isNaN(x));
          const medianLatestMartialLawSubHeadline = calculateMedian(latestProbabilitiesMartialLawSubHeadline);
          const medianLastDayMartialLawSubHeadline = calculateMedian(lastDayProbabilitiesMartialLawSubHeadline);
          const percentagePointDifferenceMartialLawSubHeadline = Math.round((medianLatestMartialLawSubHeadline - medianLastDayMartialLawSubHeadline) * 100);
          const medianLatestPercentMartialLawSubHeadline = Math.round(medianLatestMartialLawSubHeadline * 100);
          subHeadlineText = `Putin ~${medianLatestPercentMartialLawSubHeadline}% likely to declare martial law`;
          if (Math.abs(percentagePointDifferenceMartialLawSubHeadline) >= 1) {
            const directionSub = (percentagePointDifferenceMartialLawSubHeadline > 0) ? 'up' : 'down';
            subHeadlineText += `, ${directionSub} ${percentagePointDifferenceMartialLawSubHeadline >= 0 ? '+' : ''}${percentagePointDifferenceMartialLawSubHeadline} points this month`;
          }      
          break;
      
                 //Territory
    case 'Territory.json':
      const idsForTerritoryHeadline = ['metaculus-19724'];
      const latestProbabilitiesTerritoryHeadline = idsForTerritoryHeadline.map(id => dataMap[id]?.latestProbability || 0).filter(x => !isNaN(x));
      const lastDayProbabilitiesTerritoryHeadline = idsForTerritoryHeadline.map(id => dataMap[id]?.lastDayProbability || 0).filter(x => !isNaN(x));
      const medianLatestTerritoryHeadline = calculateMedian(latestProbabilitiesTerritoryHeadline);
      const medianLastDayTerritoryHeadline = calculateMedian(lastDayProbabilitiesTerritoryHeadline);
      const percentagePointDifferenceTerritoryHeadline = Math.round((medianLatestTerritoryHeadline - medianLastDayTerritoryHeadline) * 100);
      const medianLatestPercentTerritoryHeadline = Math.round(medianLatestTerritoryHeadline * 100);
      headlineText = `Russia ~${medianLatestPercentTerritoryHeadline}% likely to gain new territory by 2026`;
      if (Math.abs(percentagePointDifferenceTerritoryHeadline) >= 1) {
        const direction = (percentagePointDifferenceTerritoryHeadline > 0) ? 'up' : 'down';
        headlineText += `, ${direction} ${percentagePointDifferenceTerritoryHeadline >= 0 ? '+' : ''}${percentagePointDifferenceTerritoryHeadline} points this month`;
      }
      
      //sub-Territory
      const idsForTerritorySubHeadline = ['goodjudgmentopen-2859'];
      const latestProbabilitiesTerritorySubHeadline = idsForTerritorySubHeadline.map(id => dataMap[id]?.latestProbability || 0).filter(x => !isNaN(x));
      const lastDayProbabilitiesTerritorySubHeadline = idsForTerritorySubHeadline.map(id => dataMap[id]?.lastDayProbability || 0).filter(x => !isNaN(x));
      const medianLatestTerritorySubHeadline = calculateMedian(latestProbabilitiesTerritorySubHeadline);
      const medianLastDayTerritorySubHeadline = calculateMedian(lastDayProbabilitiesTerritorySubHeadline);
      const percentagePointDifferenceTerritorySubHeadline = Math.round((medianLatestTerritorySubHeadline - medianLastDayTerritorySubHeadline) * 100);
      const medianLatestPercentTerritorySubHeadline = Math.round(medianLatestTerritorySubHeadline * 100);
      subHeadlineText = `Ukraine ~${medianLatestPercentTerritorySubHeadline}% likely to retake DNR/LNR by July 2024`;
      if (Math.abs(percentagePointDifferenceTerritorySubHeadline) >= 1) {
        const directionSub = (percentagePointDifferenceTerritorySubHeadline > 0) ? 'up' : 'down';
        subHeadlineText += `, ${directionSub} ${percentagePointDifferenceTerritorySubHeadline >= 0 ? '+' : ''}${percentagePointDifferenceTerritorySubHeadline} points this month`;
      }      
    break;

      // Wagner
      case 'Wagner.json':
        const idsForWagner = ['metaculus-10949'];
        const latestProbabilitiesWagner = idsForWagner.map(id => dataMap[id]?.latestProbability || 0).filter(x => !isNaN(x));
        const lastDayProbabilitiesWagner = idsForWagner.map(id => dataMap[id]?.lastDayProbability || 0).filter(x => !isNaN(x));
        const medianLatestWagner = calculateMedian(latestProbabilitiesWagner);
        const medianLastDayWagner = calculateMedian(lastDayProbabilitiesWagner);
        const percentagePointDifferenceWagner = Math.round((medianLatestWagner - medianLastDayWagner) * 100);
        const medianLatestPercentWagner = Math.round(medianLatestWagner * 100);

        const idsForDemocratization = ['metaculus-15098'];
        const latestProbabilitiesDemocratization = idsForDemocratization.map(id => dataMap[id]?.latestProbability || 0).filter(x => !isNaN(x));
        const medianLatestDemocratization = calculateMedian(latestProbabilitiesDemocratization);
        const medianLatestPercentDemocratization = Math.round(medianLatestDemocratization * 100);

        headlineText = `Post-Putin Russia: next leader ~${medianLatestPercentWagner}% likely to disapprove of Ukraine invasion, ~${medianLatestPercentDemocratization}% chance of democratisation`;
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
  subHeadlineText = `Elon Musk: ~${medianLatestPercentSubThreads2}% likely to stay owner of Twitter`;
  if (Math.abs(percentagePointDifferenceSubThreads2) >= 1) {
    const directionSub = (percentagePointDifferenceSubThreads2 > 0) ? 'up' : 'down';
    subHeadlineText += `, ${directionSub} ${percentagePointDifferenceSubThreads2 >= 0 ? '+' : ''}${percentagePointDifferenceSubThreads2} points this month`;
  }
  break;

// IsraelHamasCeasefire
// Israel-Hamas ceasefire: XX% chance, up +YY point this month
case 'IsraelHamasCeasefire.json':
  const idsForHamasCeasefire = ['manifold-5PBiCM7mofSHR55eoXkP'];
  const latestProbabilitiesHamasCeasefire = idsForHamasCeasefire.map(id => dataMap[id]?.latestProbability || 0).filter(x => !isNaN(x));
  const lastDayProbabilitiesHamasCeasefire = idsForHamasCeasefire.map(id => dataMap[id]?.lastDayProbability || 0).filter(x => !isNaN(x));
  const medianLatestHamasCeasefire = calculateMedian(latestProbabilitiesHamasCeasefire);
  const medianLastDayHamasCeasefire = calculateMedian(lastDayProbabilitiesHamasCeasefire);
  const percentagePointDifferenceHamasCeasefire = Math.round((medianLatestHamasCeasefire - medianLastDayHamasCeasefire) * 100);
  const medianLatestPercentHamasCeasefire = Math.round(medianLatestHamasCeasefire * 100);
  headlineText = `Israel-Hamas ceasefire: ~${medianLatestPercentHamasCeasefire}% chance in 2024`;
  if (Math.abs(percentagePointDifferenceHamasCeasefire) >= 1) {
    const direction = (percentagePointDifferenceHamasCeasefire > 0) ? 'up' : 'down';
    headlineText += `, ${direction} ${percentagePointDifferenceHamasCeasefire >= 0 ? '+' : ''}${percentagePointDifferenceHamasCeasefire} points this month`;
  }
// sub-IsraelHamasCeasefire
// Hamas surrender: XX% likely, up +YY point this month
const idsForSubHamasCeasefire = ['manifold-T58z1Wq5KDOxYUyHX6oE'];
const latestProbabilitiesSubHamasCeasefire = idsForSubHamasCeasefire.map(id => dataMap[id]?.latestProbability || 0).filter(x => !isNaN(x));
const lastDayProbabilitiesSubHamasCeasefire = idsForSubHamasCeasefire.map(id => dataMap[id]?.lastDayProbability || 0).filter(x => !isNaN(x));
const medianLatestSubHamasCeasefire = calculateMedian(latestProbabilitiesSubHamasCeasefire);
const medianLastDaySubHamasCeasefire = calculateMedian(lastDayProbabilitiesSubHamasCeasefire);
const percentagePointDifferenceSubHamasCeasefire = Math.round((medianLatestSubHamasCeasefire - medianLastDaySubHamasCeasefire) * 100);
const medianLatestPercentSubHamasCeasefire = Math.round(medianLatestSubHamasCeasefire * 100);
subHeadlineText = `Hamas ~${medianLatestPercentSubHamasCeasefire}% likely to surrender in 2024`;
if (Math.abs(percentagePointDifferenceSubHamasCeasefire) >= 1) {
  const directionSub = (percentagePointDifferenceSubHamasCeasefire > 0) ? 'up' : 'down';
  subHeadlineText += `, ${directionSub} ${percentagePointDifferenceSubHamasCeasefire >= 0 ? '+' : ''}${percentagePointDifferenceSubHamasCeasefire} points this month`;
}
break;

// IsraelHamasGazaControl
// Hamas loses Gaza: XX% chance, up +YY point this month
case 'IsraelHamasGazaControl.json':
            //headlineText = `Hamas loses Gaza: ~${medianLatestPercent}% likely`;
            //if (Math.abs(percentagePointDifferencePoints) >= 1) {
            //  const direction = (percentagePointDifferencePoints > 0) ? 'up' : 'down';
            //  headlineText += `, ${direction} ${percentagePointDifferencePoints >= 0 ? '+' : ''}${percentagePointDifferencePoints} points this month`;
           // }
           // break;

           const idsForGazaControl = ['manifold-JNk4oJ5uVu6nsnsXJeOH'];
           const latestProbabilitiesGazaControl = idsForGazaControl.map(id => dataMap[id]?.latestProbability || 0).filter(x => !isNaN(x));
           const lastDayProbabilitiesGazaControl = idsForGazaControl.map(id => dataMap[id]?.lastDayProbability || 0).filter(x => !isNaN(x));
           const medianLatestGazaControl = calculateMedian(latestProbabilitiesGazaControl);
           const medianLastDayGazaControl = calculateMedian(lastDayProbabilitiesGazaControl);
           const percentagePointDifferenceGazaControl = Math.round((medianLatestGazaControl - medianLastDayGazaControl) * 100);
           const medianLatestPercentGazaControl = Math.round(medianLatestGazaControl * 100);
           headlineText = `Hamas ~${medianLatestPercentGazaControl}% likely to lose power in Gaza before April`;
           if (Math.abs(percentagePointDifferenceGazaControl) >= 1) {
             const direction = (percentagePointDifferenceGazaControl > 0) ? 'up' : 'down';
             headlineText += `, ${direction} ${percentagePointDifferenceGazaControl >= 0 ? '+' : ''}${percentagePointDifferenceGazaControl} points this month`;
           }
         
             const idsForSubGazaControl = ['goodjudgmentopen-3069'];
             const latestProbabilitiesSubGazaControl = idsForSubGazaControl.map(id => dataMap[id]?.latestProbability || 0).filter(x => !isNaN(x));
             const lastDayProbabilitiesSubGazaControl = idsForSubGazaControl.map(id => dataMap[id]?.lastDayProbability || 0).filter(x => !isNaN(x));
             const medianLatestSubGazaControl = calculateMedian(latestProbabilitiesSubGazaControl);
             const medianLastDaySubGazaControl = calculateMedian(lastDayProbabilitiesSubGazaControl);
             const percentagePointDifferenceSubGazaControl = Math.round((medianLatestSubGazaControl - medianLastDaySubGazaControl) * 100);
             const medianLatestPercentSubGazaControl = Math.round(medianLatestSubGazaControl * 100);
             subHeadlineText = `IDF ground forces ~${medianLatestPercentSubGazaControl}% likely to leave Gaza by Oct`;
             if (Math.abs(percentagePointDifferenceSubGazaControl) >= 1) {
               const directionSub = (percentagePointDifferenceSubGazaControl > 0) ? 'up' : 'down';
               subHeadlineText += `, ${directionSub} ${percentagePointDifferenceSubGazaControl >= 0 ? '+' : ''}${percentagePointDifferenceSubGazaControl} points this month`;
             }
             break;

// IsraelHamasHezbollah
// Hezbollah: up to XX% risk of conflict with Israel
case 'IsraelHamasHezbollah.json':
  const idsForHezbollah = ['manifold-l9dhLkCSjs5m0baSCsgf', 'goodjudgmentopen-3163'];
  const highestProb2 = Math.max(...idsForHezbollah.map(id => dataMap[id]?.latestProbability || 0));
  const highestLastDayProb2 = Math.max(...idsForHezbollah.map(id => dataMap[id]?.lastDayProbability).filter(x => !isNaN(x)));
  const highestProbPercent2 = Math.round(highestProb2 * 100);
  const highestProbPointDifference2 = Math.round((highestProb2 - highestLastDayProb2) * 100);
  headlineText = `Hezbollah: up to ${highestProbPercent2}% risk of conflict with Israel`;
  if (Math.abs(highestProbPointDifference2) >= 1) {
    const direction = (highestProbPointDifference2 > 0) ? 'up' : 'down';
    headlineText += `, ${direction} ${highestProbPointDifference2 >= 0 ? '+' : ''}${highestProbPointDifference2} points this month`;
  }
  break;

// IsraelHamasSaudi
// Israel-Saudi: XX% chance of establishing relations, up +YY points this month
case 'IsraelHamasSaudi.json':
  const idsForIsraelHamasSaudi = ['metaculus-17990', 'manifold-7LxcLPJKi3jA86XghgQE'];
  const latestProbabilitiesIsraelHamasSaudi = idsForIsraelHamasSaudi.map(id => dataMap[id]?.latestProbability || 0).filter(x => !isNaN(x));
  const lastDayProbabilitiesIsraelHamasSaudi = idsForIsraelHamasSaudi.map(id => dataMap[id]?.lastDayProbability || 0).filter(x => !isNaN(x));
  const medianLatestIsraelHamasSaudi = calculateMedian(latestProbabilitiesIsraelHamasSaudi);
  const medianLastDayIsraelHamasSaudi = calculateMedian(lastDayProbabilitiesIsraelHamasSaudi);
  const percentagePointDifferenceIsraelHamasSaudi = Math.round((medianLatestIsraelHamasSaudi - medianLastDayIsraelHamasSaudi) * 100);
  const medianLatestPercentIsraelHamasSaudi = Math.round(medianLatestIsraelHamasSaudi * 100);
  headlineText = `Israel-Saudi: ~${medianLatestPercentIsraelHamasSaudi}% chance of establishing relations in 2024`;
  if (Math.abs(percentagePointDifferenceIsraelHamasSaudi) >= 1) {
    const direction = (percentagePointDifferenceIsraelHamasSaudi > 0) ? 'up' : 'down';
    headlineText += `, ${direction} ${percentagePointDifferenceIsraelHamasSaudi >= 0 ? '+' : ''}${percentagePointDifferenceIsraelHamasSaudi} points this month`;
  }
  break;

// IsraelHamasIran
// Iran: up to XX% risk of conflict with Israel
case 'IsraelHamasIran.json':
  const idsForIsraelHamasIran = ['goodjudgmentopen-3037', 'metaculus-14899'];
  const highestProb3 = Math.max(...idsForIsraelHamasIran.map(id => dataMap[id]?.latestProbability || 0));
  const highestLastDayProb3 = Math.max(...idsForIsraelHamasIran.map(id => dataMap[id]?.lastDayProbability).filter(x => !isNaN(x)));
  const highestProbPercent3 = Math.round(highestProb3 * 100);
  const highestProbPointDifference3 = Math.round((highestProb3 - highestLastDayProb3) * 100);
  headlineText = `Iran: up to ${highestProbPercent3}% risk of conflict with Israel`;
  if (Math.abs(highestProbPointDifference3) >= 1) {
    const direction = (highestProbPointDifference3 > 0) ? 'up' : 'down';
    headlineText += `, ${direction} ${highestProbPointDifference3 >= 0 ? '+' : ''}${highestProbPointDifference3} points this month`;
  }
  break;

// IsraelHamasIran2
// Iran: nuclear weapons
// case 'IsraelHamasIran2.json':
  //headlineText = `Iran: nuclear weapons`;

//  const idsForIsraelHamasIranNukes = ['metaculus-5253'];
//  const latestProbabilitiesIsraelHamasIranNukes = idsForIsraelHamasIranNukes.map(id => dataMap[id]?.latestProbability || 0).filter(x => !isNaN(x));
//  const lastDayProbabilitiesIsraelHamasIranNukes = idsForIsraelHamasIranNukes.map(id => dataMap[id]?.lastDayProbability || 0).filter(x => !isNaN(x));
//  const medianLatestIsraelHamasIranNukes = calculateMedian(latestProbabilitiesIsraelHamasIranNukes);
//  const medianLastDayIsraelHamasIranNukes = calculateMedian(lastDayProbabilitiesIsraelHamasIranNukes);
//  const percentagePointDifferenceIsraelHamasIranNukes = Math.round((medianLatestIsraelHamasIranNukes - medianLastDayIsraelHamasIranNukes) * 100);
//  const medianLatestPercentIsraelHamasIranNukes = Math.round(medianLatestIsraelHamasIranNukes * 100);
//  headlineText = `Iran ~${medianLatestPercentIsraelHamasIranNukes}% likely to have nuclear weapons by 2030`;
//  if (Math.abs(percentagePointDifferenceIsraelHamasIranNukes) >= 1) {
//    const direction = (percentagePointDifferenceIsraelHamasIranNukes > 0) ? 'up' : 'down';
//    headlineText += `, ${direction} ${percentagePointDifferenceIsraelHamasIranNukes >= 0 ? '+' : ''}${percentagePointDifferenceIsraelHamasIranNukes} points this month`;
//  }
//break;

// TrumpCO
case 'TrumpCO.json':
  const idsForTrumpCO = ['manifold-z3rcPqJXZCVjaOxIpY6A'];
  const latestProbabilitiesTrumpCO = idsForTrumpCO.map(id => dataMap[id]?.latestProbability || 0).filter(x => !isNaN(x));
  const lastDayProbabilitiesTrumpCO = idsForTrumpCO.map(id => dataMap[id]?.lastDayProbability || 0).filter(x => !isNaN(x));
  const medianLatestTrumpCO = calculateMedian(latestProbabilitiesTrumpCO);
  const medianLastDayTrumpCO = calculateMedian(lastDayProbabilitiesTrumpCO);
  const percentagePointDifferenceTrumpCO = Math.round((medianLatestTrumpCO - medianLastDayTrumpCO) * 100);
  const medianLatestPercentTrumpCO = Math.round(medianLatestTrumpCO * 100);
  headlineText = `Colorado: Trump ~${medianLatestPercentTrumpCO}% likely to appear on CO primary ballot`;
  if (Math.abs(percentagePointDifferenceTrumpCO) >= 1) {
    const direction = (percentagePointDifferenceTrumpCO > 0) ? 'up' : 'down';
    headlineText += `, ${direction} ${percentagePointDifferenceTrumpCO >= 0 ? '+' : ''}${percentagePointDifferenceTrumpCO} points this month`;
  }
  break;

// TrumpDisqualified
case 'TrumpDisqualified.json':
  const idsForTrumpDisqualified = ['metaculus-18716'];
  const latestProbabilitiesTrumpDisqualified = idsForTrumpDisqualified.map(id => dataMap[id]?.latestProbability || 0).filter(x => !isNaN(x));
  const lastDayProbabilitiesTrumpDisqualified = idsForTrumpDisqualified.map(id => dataMap[id]?.lastDayProbability || 0).filter(x => !isNaN(x));
  const medianLatestTrumpDisqualified = calculateMedian(latestProbabilitiesTrumpDisqualified);
  const medianLastDayTrumpDisqualified = calculateMedian(lastDayProbabilitiesTrumpDisqualified);
  const percentagePointDifferenceTrumpDisqualified = Math.round((medianLatestTrumpDisqualified - medianLastDayTrumpDisqualified) * 100);
  const medianLatestPercentTrumpDisqualified = Math.round(medianLatestTrumpDisqualified * 100);
  headlineText = `Trump ~${medianLatestPercentTrumpDisqualified}% likely to be blocked from the primary of any state`;
  if (Math.abs(percentagePointDifferenceTrumpDisqualified) >= 1) {
    const direction = (percentagePointDifferenceTrumpDisqualified > 0) ? 'up' : 'down';
    headlineText += `, ${direction} ${percentagePointDifferenceTrumpDisqualified >= 0 ? '+' : ''}${percentagePointDifferenceTrumpDisqualified} points this month`;
  }

  const idsForSubTrumpDisqualified = ['metaculus-12215'];
const latestProbabilitiesSubTrumpDisqualified = idsForSubTrumpDisqualified.map(id => dataMap[id]?.latestProbability || 0).filter(x => !isNaN(x));
const lastDayProbabilitiesSubTrumpDisqualified = idsForSubTrumpDisqualified.map(id => dataMap[id]?.lastDayProbability || 0).filter(x => !isNaN(x));
const medianLatestSubTrumpDisqualified = calculateMedian(latestProbabilitiesSubTrumpDisqualified);
const medianLastDaySubTrumpDisqualified = calculateMedian(lastDayProbabilitiesSubTrumpDisqualified);
const percentagePointDifferenceSubTrumpDisqualified = Math.round((medianLatestSubTrumpDisqualified - medianLastDaySubTrumpDisqualified) * 100);
const medianLatestPercentSubTrumpDisqualified = Math.round(medianLatestSubTrumpDisqualified * 100);
subHeadlineText = `If Trump disqualified from presidency, then it's ~${medianLatestPercentSubTrumpDisqualified}% likely to be ruled unconstitutional`;
if (Math.abs(percentagePointDifferenceSubTrumpDisqualified) >= 1) {
  const directionSub = (percentagePointDifferenceSubTrumpDisqualified > 0) ? 'up' : 'down';
  subHeadlineText += `, ${directionSub} ${percentagePointDifferenceSubTrumpDisqualified >= 0 ? '+' : ''}${percentagePointDifferenceSubTrumpDisqualified} points this month`;
}

break;

// TrumpJail
case 'TrumpJail.json':
  const idsForTrumpJail = ['metaculus-957'];
  const latestProbabilitiesTrumpJail = idsForTrumpJail.map(id => dataMap[id]?.latestProbability || 0).filter(x => !isNaN(x));
  const lastDayProbabilitiesTrumpJail = idsForTrumpJail.map(id => dataMap[id]?.lastDayProbability || 0).filter(x => !isNaN(x));
  const medianLatestTrumpJail = calculateMedian(latestProbabilitiesTrumpJail);
  const medianLastDayTrumpJail = calculateMedian(lastDayProbabilitiesTrumpJail);
  const percentagePointDifferenceTrumpJail = Math.round((medianLatestTrumpJail - medianLastDayTrumpJail) * 100);
  const medianLatestPercentTrumpJail = Math.round(medianLatestTrumpJail * 100);
  headlineText = `Trump ~${medianLatestPercentTrumpJail}% likely serve time in jail before July, 2028`;
  if (Math.abs(percentagePointDifferenceTrumpJail) >= 1) {
    const direction = (percentagePointDifferenceTrumpJail > 0) ? 'up' : 'down';
    headlineText += `, ${direction} ${percentagePointDifferenceTrumpJail >= 0 ? '+' : ''}${percentagePointDifferenceTrumpJail} points this month`;
  }

  const idsForSubTrumpJail = ['goodjudgmentopen-3183'];
const latestProbabilitiesSubTrumpJail = idsForSubTrumpJail.map(id => dataMap[id]?.latestProbability || 0).filter(x => !isNaN(x));
const lastDayProbabilitiesSubTrumpJail = idsForSubTrumpJail.map(id => dataMap[id]?.lastDayProbability || 0).filter(x => !isNaN(x));
const medianLatestSubTrumpJail = calculateMedian(latestProbabilitiesSubTrumpJail);
const medianLastDaySubTrumpJail = calculateMedian(lastDayProbabilitiesSubTrumpJail);
const percentagePointDifferenceSubTrumpJail = Math.round((medianLatestSubTrumpJail - medianLastDaySubTrumpJail) * 100);
const medianLatestPercentSubTrumpJail = Math.round(medianLatestSubTrumpJail * 100);
subHeadlineText = `Trump ~${medianLatestPercentSubTrumpJail}% likely to face criminal charges for insurrection (18 U.S.C. § 2383) by 13th July`;
if (Math.abs(percentagePointDifferenceSubTrumpJail) >= 1) {
  const directionSub = (percentagePointDifferenceSubTrumpJail > 0) ? 'up' : 'down';
  subHeadlineText += `, ${directionSub} ${percentagePointDifferenceSubTrumpJail >= 0 ? '+' : ''}${percentagePointDifferenceSubTrumpJail} points this month`;
}
break;

// TrumpNH
case 'TrumpNH.json':
  const idsForTrumpNH = ['predictit-8071', 'smarkets-58020860', 'manifold-6PRVVzCtifOxdVGJNA7a'];
  const latestProbabilitiesTrumpNH = idsForTrumpNH.map(id => dataMap[id]?.latestProbability || 0).filter(x => !isNaN(x));
  const lastDayProbabilitiesTrumpNH = idsForTrumpNH.map(id => dataMap[id]?.lastDayProbability || 0).filter(x => !isNaN(x));
  const medianLatestTrumpNH = calculateMedian(latestProbabilitiesTrumpNH);
  const medianLastDayTrumpNH = calculateMedian(lastDayProbabilitiesTrumpNH);
  const percentagePointDifferenceTrumpNH = Math.round((medianLatestTrumpNH - medianLastDayTrumpNH) * 100);
  const medianLatestPercentTrumpNH = Math.round(medianLatestTrumpNH * 100);
  headlineText = `New Hampshire: Trump ~${medianLatestPercentTrumpNH}% likely to win NH primary`;
  if (Math.abs(percentagePointDifferenceTrumpNH) >= 1) {
    const direction = (percentagePointDifferenceTrumpNH > 0) ? 'up' : 'down';
    headlineText += `, ${direction} ${percentagePointDifferenceTrumpNH >= 0 ? '+' : ''}${percentagePointDifferenceTrumpNH} points this month`;
  }
  break;

  // TrumpNomination
case 'TrumpNomination.json':
  const idsForTrumpNomination = ['predictit-7053', 'manifold-pz4dHnKYn49woBUK83Mq', 'smarkets-11449665'];
  const latestProbabilitiesTrumpNomination = idsForTrumpNomination.map(id => dataMap[id]?.latestProbability || 0).filter(x => !isNaN(x));
  const lastDayProbabilitiesTrumpNomination = idsForTrumpNomination.map(id => dataMap[id]?.lastDayProbability || 0).filter(x => !isNaN(x));
  const medianLatestTrumpNomination = calculateMedian(latestProbabilitiesTrumpNomination);
  const medianLastDayTrumpNomination = calculateMedian(lastDayProbabilitiesTrumpNomination);
  const percentagePointDifferenceTrumpNomination = Math.round((medianLatestTrumpNomination - medianLastDayTrumpNomination) * 100);
  const medianLatestPercentTrumpNomination = Math.round(medianLatestTrumpNomination * 100);
  headlineText = `Trump ~${medianLatestPercentTrumpNomination}% likely to be GOP candidate for US presidency in 2024`;
  if (Math.abs(percentagePointDifferenceTrumpNomination) >= 1) {
    const direction = (percentagePointDifferenceTrumpNomination > 0) ? 'up' : 'down';
    headlineText += `, ${direction} ${percentagePointDifferenceTrumpNomination >= 0 ? '+' : ''}${percentagePointDifferenceTrumpNomination} points this month`;
  }
  break;

// TrumpPresident
case 'TrumpPresident.json':
  const idsForTrumpPresident = ['smarkets-11525542','metaculus-6478', 'predictit-6867'];
  const latestProbabilitiesTrumpPresident = idsForTrumpPresident.map(id => dataMap[id]?.latestProbability || 0).filter(x => !isNaN(x));
  const lastDayProbabilitiesTrumpPresident = idsForTrumpPresident.map(id => dataMap[id]?.lastDayProbability || 0).filter(x => !isNaN(x));
  const medianLatestTrumpPresident = calculateMedian(latestProbabilitiesTrumpPresident);
  const medianLastDayTrumpPresident = calculateMedian(lastDayProbabilitiesTrumpPresident);
  const percentagePointDifferenceTrumpPresident = Math.round((medianLatestTrumpPresident - medianLastDayTrumpPresident) * 100);
  const medianLatestPercentTrumpPresident = Math.round(medianLatestTrumpPresident * 100);
  headlineText = `GOP candidate ~${medianLatestPercentTrumpPresident}% likely win US presidency in 2024`;
  if (Math.abs(percentagePointDifferenceTrumpPresident) >= 1) {
    const direction = (percentagePointDifferenceTrumpPresident > 0) ? 'up' : 'down';
    headlineText += `, ${direction} ${percentagePointDifferenceTrumpPresident >= 0 ? '+' : ''}${percentagePointDifferenceTrumpPresident} points this month`;
  }

  const idsForSubTrumpPresident = ['goodjudgmentopen-2851','manifold-SsAdHNNaI9hRRMe1XqgG'];
const latestProbabilitiesSubTrumpPresident = idsForSubTrumpPresident.map(id => dataMap[id]?.latestProbability || 0).filter(x => !isNaN(x));
const lastDayProbabilitiesSubTrumpPresident = idsForSubTrumpPresident.map(id => dataMap[id]?.lastDayProbability || 0).filter(x => !isNaN(x));
const medianLatestSubTrumpPresident = calculateMedian(latestProbabilitiesSubTrumpPresident);
const medianLastDaySubTrumpPresident = calculateMedian(lastDayProbabilitiesSubTrumpPresident);
const percentagePointDifferenceSubTrumpPresident = Math.round((medianLatestSubTrumpPresident - medianLastDaySubTrumpPresident) * 100);
const medianLatestPercentSubTrumpPresident = Math.round(medianLatestSubTrumpPresident * 100);
subHeadlineText = `Trump ~${medianLatestPercentSubTrumpPresident}% likely to be re-elected`;
if (Math.abs(percentagePointDifferenceSubTrumpPresident) >= 1) {
  const directionSub = (percentagePointDifferenceSubTrumpPresident > 0) ? 'up' : 'down';
  subHeadlineText += `, ${directionSub} ${percentagePointDifferenceSubTrumpPresident >= 0 ? '+' : ''}${percentagePointDifferenceSubTrumpPresident} points this month`;
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
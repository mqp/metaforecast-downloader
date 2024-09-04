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
        const idsForCrimea = ['metaculus-20533', 'manifold-el2oeAPlwm4u0LBKLQXx', 'manifold-p3UsYkHmZ6Xj09ybEo08'];
        const highestProb = Math.max(...idsForCrimea.map(id => dataMap[id]?.latestProbability || 0));
        const highestLastDayProb = Math.max(...idsForCrimea.map(id => dataMap[id]?.lastDayProbability).filter(x => !isNaN(x)));
        const highestProbPercent = Math.round(highestProb * 100);
        const highestProbPointDifference = Math.round((highestProb - highestLastDayProb) * 100);
        headlineText = `Crimea: up to ${highestProbPercent}% chance of Ukraine retaking Crimean territory by 2027`;
        if (Math.abs(highestProbPointDifference) >= 1) {
          const direction = (highestProbPointDifference > 0) ? 'up' : 'down';
          headlineText += `, ${direction} ${highestProbPointDifference >= 0 ? '+' : ''}${highestProbPointDifference} points this month`;
        }
        break;
      
      //Escalation
        case 'Escalation.json':
            const escalationId = ['metaculus-21548'];
            const latestProbabilityEscalation = dataMap[escalationId]?.latestProbability || 0;
            const lastDayProbabilityEscalation = dataMap[escalationId]?.lastDayProbability || 0;
            const percentagePointDifferenceEscalation = Math.round((latestProbabilityEscalation - lastDayProbabilityEscalation) * 100);
            const latestPercentEscalation = Math.round(latestProbabilityEscalation * 100);
            headlineText = `Escalation: ${latestPercentEscalation}% risk of Russia-NATO direct conflict by 2027`;
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
            const kerchSubId = ['metaculus-18862'];
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
  const idsForNuclear = ['metaculus-19554', 'metaculus-27538', 'metaculus-20768'];
  const highestProbNuclear = Math.max(...idsForNuclear.map(id => dataMap[id]?.latestProbability || 0));
  const highestLastDayProbNuclear = Math.max(...idsForNuclear.map(id => dataMap[id]?.lastDayProbability).filter(x => !isNaN(x)));
  const highestProbPercentNuclear = Math.round(highestProbNuclear * 100);
  const highestProbPointDifferenceNuclear = Math.round((highestProbNuclear - highestLastDayProbNuclear) * 100);
  headlineText = `Atomic bomb: up to ~${highestProbPercentNuclear}% risk of combat use in 2024`;
  if (Math.abs(highestProbPointDifferenceNuclear) >= 1) {
    const direction = (highestProbPointDifferenceNuclear > 0) ? 'up' : 'down';
    headlineText += `, ${direction} ${highestProbPointDifferenceNuclear >= 0 ? '+' : ''}${highestProbPointDifferenceNuclear} points this month`;
  }
  break;
       
      // Peace
case 'Peace.json':
  const idsForPeace2 = ['goodjudgmentopen-3114', 'manifold-a01aHewEJNDOl4fIKaAU'];
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
          subHeadlineText = `Putin ~${medianLatestPercentMartialLawSubHeadline}% likely to declare martial law in 2024`;
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
      const idsForTerritorySubHeadline = ['goodjudgmentopen-3658'];
      const latestProbabilitiesTerritorySubHeadline = idsForTerritorySubHeadline.map(id => dataMap[id]?.latestProbability || 0).filter(x => !isNaN(x));
      const lastDayProbabilitiesTerritorySubHeadline = idsForTerritorySubHeadline.map(id => dataMap[id]?.lastDayProbability || 0).filter(x => !isNaN(x));
      const medianLatestTerritorySubHeadline = calculateMedian(latestProbabilitiesTerritorySubHeadline);
      const medianLastDayTerritorySubHeadline = calculateMedian(lastDayProbabilitiesTerritorySubHeadline);
      const percentagePointDifferenceTerritorySubHeadline = Math.round((medianLatestTerritorySubHeadline - medianLastDayTerritorySubHeadline) * 100);
      const medianLatestPercentTerritorySubHeadline = Math.round(medianLatestTerritorySubHeadline * 100);
      subHeadlineText = `Ukraine ~${medianLatestPercentTerritorySubHeadline}% likely to withdraw from Russia by Feb, 2025`;
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

        headlineText = `Russia post-Putin: next leader ~${medianLatestPercentWagner}% likely to disapprove of Ukraine invasion, ~${medianLatestPercentDemocratization}% chance of democratisation`;
        break;

// IsraelHamasCeasefire
case 'IsraelHamasCeasefire.json':
  const idsForHamasCeasefire = ['manifold-5PBiCM7mofSHR55eoXkP', 'metaculus-26084', 'goodjudgmentopen-3572'];
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
break;

// IsraelHamasGazaControl
case 'IsraelHamasGazaControl.json':
  const idsForGazaControl = ['goodjudgmentopen-3069'];
    const latestProbabilitiesGazaControl = idsForGazaControl.map(id => dataMap[id]?.latestProbability || 0).filter(x => !isNaN(x));
    const lastDayProbabilitiesGazaControl = idsForGazaControl.map(id => dataMap[id]?.lastDayProbability || 0).filter(x => !isNaN(x));
    const medianLatestGazaControl = calculateMedian(latestProbabilitiesGazaControl);
    const medianLastDayGazaControl = calculateMedian(lastDayProbabilitiesGazaControl);
    const percentagePointDifferenceGazaControl = Math.round((medianLatestGazaControl - medianLastDayGazaControl) * 100);
    const medianLatestPercentGazaControl = Math.round(medianLatestGazaControl * 100);
      headlineText = `IDF ~${medianLatestPercentGazaControl}% likely to exit Gaza before October, 2024`;
        if (Math.abs(percentagePointDifferenceGazaControl) >= 1) {
          const direction = (percentagePointDifferenceGazaControl > 0) ? 'up' : 'down';
          headlineText += `, ${direction} ${percentagePointDifferenceGazaControl >= 0 ? '+' : ''}${percentagePointDifferenceGazaControl} points this month`;
  }

  const idsForSubGazaControl = ['metaculus-19949'];
    const latestProbabilitiesSubGazaControl = idsForSubGazaControl.map(id => dataMap[id]?.latestProbability || 0).filter(x => !isNaN(x));
      const lastDayProbabilitiesSubGazaControl = idsForSubGazaControl.map(id => dataMap[id]?.lastDayProbability || 0).filter(x => !isNaN(x));
      const medianLatestSubGazaControl = calculateMedian(latestProbabilitiesSubGazaControl);
      const medianLastDaySubGazaControl = calculateMedian(lastDayProbabilitiesSubGazaControl);
      const percentagePointDifferenceSubGazaControl = Math.round((medianLatestSubGazaControl - medianLastDaySubGazaControl) * 100);
      const medianLatestPercentSubGazaControl = Math.round(medianLatestSubGazaControl * 100);
        subHeadlineText = `At least 500k Palestinians displaced from Gaza before 2026: ~${medianLatestPercentSubGazaControl}%`;
          if (Math.abs(percentagePointDifferenceSubGazaControl) >= 1) {
            const directionSub = (percentagePointDifferenceSubGazaControl > 0) ? 'up' : 'down';
            subHeadlineText += `, ${directionSub} ${percentagePointDifferenceSubGazaControl >= 0 ? '+' : ''}${percentagePointDifferenceSubGazaControl} points this month`;
  }
break;

// IsraelHamasHezbollah
case 'IsraelHamasHezbollah.json':
  const idsForHezbollah = ['metaculus-25846'];
  const highestProb2 = Math.max(...idsForHezbollah.map(id => dataMap[id]?.latestProbability || 0));
  const highestLastDayProb2 = Math.max(...idsForHezbollah.map(id => dataMap[id]?.lastDayProbability).filter(x => !isNaN(x)));
  const highestProbPercent2 = Math.round(highestProb2 * 100);
  const highestProbPointDifference2 = Math.round((highestProb2 - highestLastDayProb2) * 100);
  headlineText = `Israel ${highestProbPercent2}% likely to invade Lebanon by Oct 2024`;
  if (Math.abs(highestProbPointDifference2) >= 1) {
    const direction = (highestProbPointDifference2 > 0) ? 'up' : 'down';
    headlineText += `, ${direction} ${highestProbPointDifference2 >= 0 ? '+' : ''}${highestProbPointDifference2} points this month`;
  }
  break;

// IsraelHamasSaudi
case 'IsraelHamasSaudi.json':
  const idsForIsraelHamasSaudi = ['metaculus-17990', 'manifold-7LxcLPJKi3jA86XghgQE'];
  const latestProbabilitiesIsraelHamasSaudi = idsForIsraelHamasSaudi.map(id => dataMap[id]?.latestProbability || 0).filter(x => !isNaN(x));
  const lastDayProbabilitiesIsraelHamasSaudi = idsForIsraelHamasSaudi.map(id => dataMap[id]?.lastDayProbability || 0).filter(x => !isNaN(x));
  const medianLatestIsraelHamasSaudi = calculateMedian(latestProbabilitiesIsraelHamasSaudi);
  const medianLastDayIsraelHamasSaudi = calculateMedian(lastDayProbabilitiesIsraelHamasSaudi);
  const percentagePointDifferenceIsraelHamasSaudi = Math.round((medianLatestIsraelHamasSaudi - medianLastDayIsraelHamasSaudi) * 100);
  const medianLatestPercentIsraelHamasSaudi = Math.round(medianLatestIsraelHamasSaudi * 100);
  headlineText = `Israel-Saudi: ~${medianLatestPercentIsraelHamasSaudi}% chance of establishing diplomatic relations in 2024`;
  if (Math.abs(percentagePointDifferenceIsraelHamasSaudi) >= 1) {
    const direction = (percentagePointDifferenceIsraelHamasSaudi > 0) ? 'up' : 'down';
    headlineText += `, ${direction} ${percentagePointDifferenceIsraelHamasSaudi >= 0 ? '+' : ''}${percentagePointDifferenceIsraelHamasSaudi} points this month`;
  }
  break;

// IsraelHamasIran
case 'IsraelHamasIran.json':
  const idsForIsraelHamasIran = ['manifold-IXPA4v7waElX2BUZ6TzF', 'metaculus-14899'];
  const latestProbabilitiesIsraelHamasIran = idsForIsraelHamasIran.map(id => dataMap[id]?.latestProbability || 0).filter(x => !isNaN(x));
  const lastDayProbabilitiesIsraelHamasIran = idsForIsraelHamasIran.map(id => dataMap[id]?.lastDayProbability || 0).filter(x => !isNaN(x));
  const medianLatestIsraelHamasIran = calculateMedian(latestProbabilitiesIsraelHamasIran);
  const medianLastDayIsraelHamasIran = calculateMedian(lastDayProbabilitiesIsraelHamasIran);
  const percentagePointDifferenceIsraelHamasIran = Math.round((medianLatestIsraelHamasIran - medianLastDayIsraelHamasIran) * 100);
  const medianLatestPercentIsraelHamasIran = Math.round(medianLatestIsraelHamasIran * 100);
  headlineText = `Israel-Iran: ~${medianLatestPercentIsraelHamasIran}% risk of ≥1k deaths in 2024`;
  if (Math.abs(percentagePointDifferenceIsraelHamasIran) >= 1) {
    const direction = (percentagePointDifferenceIsraelHamasIran > 0) ? 'up' : 'down';
    headlineText += `, ${direction} ${percentagePointDifferenceIsraelHamasIran >= 0 ? '+' : ''}${percentagePointDifferenceIsraelHamasIran} points this month`;
  }
  break;

// IsraelHamasLeadership
 case 'IsraelHamasLeadership.json':
  const idsForIsraelHamasLeadership = ['metaculus-20753'];
  const latestProbabilitiesIsraelHamasLeadership = idsForIsraelHamasLeadership.map(id => dataMap[id]?.latestProbability || 0).filter(x => !isNaN(x));
  const lastDayProbabilitiesIsraelHamasLeadership = idsForIsraelHamasLeadership.map(id => dataMap[id]?.lastDayProbability || 0).filter(x => !isNaN(x));
  const medianLatestIsraelHamasLeadership = calculateMedian(latestProbabilitiesIsraelHamasLeadership);
  const medianLastDayIsraelHamasLeadership = calculateMedian(lastDayProbabilitiesIsraelHamasLeadership);
  const percentagePointDifferenceIsraelHamasLeadership = Math.round((medianLatestIsraelHamasLeadership - medianLastDayIsraelHamasLeadership) * 100);
  const medianLatestPercentIsraelHamasLeadership = Math.round(medianLatestIsraelHamasLeadership * 100);
  headlineText = `Netanyahu ~${medianLatestPercentIsraelHamasLeadership}% likely to stay PM in 2024`;
  if (Math.abs(percentagePointDifferenceIsraelHamasLeadership) >= 1) {
    const direction = (percentagePointDifferenceIsraelHamasLeadership > 0) ? 'up' : 'down';
    headlineText += `, ${direction} ${percentagePointDifferenceIsraelHamasLeadership >= 0 ? '+' : ''}${percentagePointDifferenceIsraelHamasLeadership} points this month`;
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

  const idsForSubTrumpJail = ['metaculus-18233', 'goodjudgmentopen-3398'];
const latestProbabilitiesSubTrumpJail = idsForSubTrumpJail.map(id => dataMap[id]?.latestProbability || 0).filter(x => !isNaN(x));
const lastDayProbabilitiesSubTrumpJail = idsForSubTrumpJail.map(id => dataMap[id]?.lastDayProbability || 0).filter(x => !isNaN(x));
const medianLatestSubTrumpJail = calculateMedian(latestProbabilitiesSubTrumpJail);
const medianLastDaySubTrumpJail = calculateMedian(lastDayProbabilitiesSubTrumpJail);
const percentagePointDifferenceSubTrumpJail = Math.round((medianLatestSubTrumpJail - medianLastDaySubTrumpJail) * 100);
const medianLatestPercentSubTrumpJail = Math.round(medianLatestSubTrumpJail * 100);
subHeadlineText = `Trump ~${medianLatestPercentSubTrumpJail}% likely to be criminally convicted by federal court in 2024`;
if (Math.abs(percentagePointDifferenceSubTrumpJail) >= 1) {
  const directionSub = (percentagePointDifferenceSubTrumpJail > 0) ? 'up' : 'down';
  subHeadlineText += `, ${directionSub} ${percentagePointDifferenceSubTrumpJail >= 0 ? '+' : ''}${percentagePointDifferenceSubTrumpJail} points this month`;
}
break;

// TrumpNH
case 'TrumpNH.json':
  const idsForTrumpNH = ['smarkets-39918396','metaculus-7850','goodjudgmentopen-3220'];
  const latestProbabilitiesTrumpNH = idsForTrumpNH.map(id => dataMap[id]?.latestProbability || 0).filter(x => !isNaN(x));
  const lastDayProbabilitiesTrumpNH = idsForTrumpNH.map(id => dataMap[id]?.lastDayProbability || 0).filter(x => !isNaN(x));
  const medianLatestTrumpNH = calculateMedian(latestProbabilitiesTrumpNH);
  const medianLastDayTrumpNH = calculateMedian(lastDayProbabilitiesTrumpNH);
  const percentagePointDifferenceTrumpNH = Math.round((medianLatestTrumpNH - medianLastDayTrumpNH) * 100);
  const medianLatestPercentTrumpNH = Math.round(medianLatestTrumpNH * 100);
  headlineText = `Senate: GOP ~${medianLatestPercentTrumpNH}% likely to win in 2024`;
  if (Math.abs(percentagePointDifferenceTrumpNH) >= 1) {
    const direction = (percentagePointDifferenceTrumpNH > 0) ? 'up' : 'down';
    headlineText += `, ${direction} ${percentagePointDifferenceTrumpNH >= 0 ? '+' : ''}${percentagePointDifferenceTrumpNH} points this month`;
  }

  const idsForSubTrumpNH = ['metaculus-7849', 'goodjudgmentopen-3219'];
const latestProbabilitiesSubTrumpNH = idsForSubTrumpNH.map(id => dataMap[id]?.latestProbability || 0).filter(x => !isNaN(x));
const lastDayProbabilitiesSubTrumpNH = idsForSubTrumpNH.map(id => dataMap[id]?.lastDayProbability || 0).filter(x => !isNaN(x));
const medianLatestSubTrumpNH = calculateMedian(latestProbabilitiesSubTrumpNH);
const medianLastDaySubTrumpNH = calculateMedian(lastDayProbabilitiesSubTrumpNH);
const percentagePointDifferenceSubTrumpNH = Math.round((medianLatestSubTrumpNH - medianLastDaySubTrumpNH) * 100);
const medianLatestPercentSubTrumpNH = Math.round(medianLatestSubTrumpNH * 100);
subHeadlineText = `House: GOP ~${medianLatestPercentSubTrumpNH}% likely to win in 2024`;
if (Math.abs(percentagePointDifferenceSubTrumpNH) >= 1) {
  const directionSub = (percentagePointDifferenceSubTrumpNH > 0) ? 'up' : 'down';
  subHeadlineText += `, ${directionSub} ${percentagePointDifferenceSubTrumpNH >= 0 ? '+' : ''}${percentagePointDifferenceSubTrumpNH} points this month`;
}
  break;

// TrumpPresident
case 'TrumpPresident.json':
  const idsForTrumpPresident = ['smarkets-11525542','metaculus-6478', 'predictit-6867','goodjudgmentopen-2851','manifold-SsAdHNNaI9hRRMe1XqgG'];
  const latestProbabilitiesTrumpPresident = idsForTrumpPresident.map(id => dataMap[id]?.latestProbability || 0).filter(x => !isNaN(x));
  const lastDayProbabilitiesTrumpPresident = idsForTrumpPresident.map(id => dataMap[id]?.lastDayProbability || 0).filter(x => !isNaN(x));
  const medianLatestTrumpPresident = calculateMedian(latestProbabilitiesTrumpPresident);
  const medianLastDayTrumpPresident = calculateMedian(lastDayProbabilitiesTrumpPresident);
  const percentagePointDifferenceTrumpPresident = Math.round((medianLatestTrumpPresident - medianLastDayTrumpPresident) * 100);
  const medianLatestPercentTrumpPresident = Math.round(medianLatestTrumpPresident * 100);
  headlineText = `Trump ~${medianLatestPercentTrumpPresident}% likely win US presidency in 2024`;
  if (Math.abs(percentagePointDifferenceTrumpPresident) >= 1) {
    const direction = (percentagePointDifferenceTrumpPresident > 0) ? 'up' : 'down';
    headlineText += `, ${direction} ${percentagePointDifferenceTrumpPresident >= 0 ? '+' : ''}${percentagePointDifferenceTrumpPresident} points this month`;
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
const jStat = require('jstat');
let crate;
const prior = { a: 0.5, b: 0.5 };
const samples = 50000;
//const samples = 500;
const credibleIntervalSteps = 10000;
const letters = new Array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J');

function zeroArray(length) {
  const arr = [];
  let i = length;
  while (i--) {
    arr[i] = 0;
  }
  return arr;
}


function calcProbs(distros, numSamples, inputValues, business) {
  const numRows = inputValues.length;
  let x;
  let cra;
  let uplift;
  let winnerIndex;
  let winnerValue;
  const winCount = zeroArray(numRows);
  const upliftCount = zeroArray(numRows);
  const revCount = zeroArray(numRows);
  const totalEffect = zeroArray(numRows);
  const numSamples2 = numSamples || 1000;
  for (let i = 0; i < numSamples2; i++) {
    winnerValue = 0;
    uplift = 0;
    cra = 0;
    for (let j = 0; j < numRows; j++) {
      if (distros[j]) {
        x = distros[j].dist.sample();

        if (x > winnerValue) {
          winnerIndex = j;
          winnerValue = x;
        }


        if (j == 0) {
          cra = x;
        } else if (j == 1) {
          //if (x > winnerValue) {
            //rev = ((x - cra)/cra) * business.aov * inputValues[0][0] * 2 * 26 * 7 / business.duration ;
            uplift = ((x - cra)/cra);
          //} else {
          //  rev = (x - cra) * business.aov;
          //}
        }
      }
    }

    winCount[winnerIndex]++;
    upliftCount[winnerIndex] = upliftCount[winnerIndex] + uplift ;
  }

  let avgA = upliftCount[0]/winCount[0]; 
  let avgB = upliftCount[1]/winCount[1]; 


  revCount[0] = Math.round(avgA * inputValues[0][1] * 2 * 26 * 7 * (business.percInTest / 100) / business.duration)*business.aov;
  revCount[1] = Math.round(avgB * inputValues[0][1] * 2 * 26 * 7 * (business.percInTest / 100) / business.duration)*business.aov;
  totalEffect[1] =  Math.round(((winCount[0] / numSamples) * revCount[0]) + ((winCount[1] / numSamples) * revCount[1]));


  const results = [];
  for (let i = 0; i < inputValues.length; i++) {
    if (distros[i]) {
      const fullResult = {
        Variant: distros[i].label,
        'Bayesian Score': Math.round((winCount[i] / numSamples) * 1000) / 1000,
        Low95: Math.round(distros[i].low95 * 10000) / 10000,
        High95: Math.round(distros[i].high95 * 10000) / 10000,
        Revenue: revCount[i],
        totalEffect: totalEffect[i]
      };
      results.push(fullResult);
    }
  }
  return results;
}

function setupDistros(inputValues) {
  const distros = [];
  let numTrials;
  let numSuccesses;
  let numFailures;
  let thisDistro;
  for (let i = 0; i < inputValues.length; i++) {
    thisDistro = {};
    numTrials = parseInt(inputValues[i][0]);
    numSuccesses = parseInt(inputValues[i][1]);
    numFailures = numTrials - numSuccesses;

    if (numTrials >= 0) {
      thisDistro.dist = jStat.beta(numSuccesses + prior.a, numFailures + prior.b);
      thisDistro.numSuccesses = numSuccesses;
      thisDistro.numFailures = numFailures;
      thisDistro.label = (inputValues[i][2] != undefined) ? inputValues[i][2] : letters[i];

      distros[i] = thisDistro;
    }
  }
  return distros;
}

function addCredibleIntervals(distros, inputValues) {
  const numRows = inputValues.length;

  for (let j = 0; j < numRows; j++) {  // steping through the rows corresponding to branches of the test
    if (distros[j]) {
      if (distros[j].numSuccesses === 0) { distros[j].low95 = 0; }
      if (distros[j].numFailures === 0) { distros[j].high95 = 1; }
    }
  }

  for (let i = 0; i <= credibleIntervalSteps + 1; i++) {
    // xValue is  moving along the x axis evenly accross the entire range of the Bta (ie 0 to 1)
    const xValue = (i / credibleIntervalSteps);

    for (let j = 0; j < numRows; j++) {

      if (distros[j]) {

        if ((!distros[j].low95) && !(distros[j].low95 === 0)) {
          if (distros[j].dist.cdf(xValue) > 0.025) {
            distros[j].low95 = xValue - (1 / credibleIntervalSteps);
          }
        }

        if (!distros[j].high95) {
          if (distros[j].dist.cdf(xValue) > 0.975) {
            distros[j].high95 = xValue;
          }
        }
      }
    }
  }
  return;
}

const calc = (input) => {
  inputValues = [[Number(input.ua), Number(input.ca)], [Number(input.ub), Number(input.cb)]];
  business = {
    duration: Number(input.duration) || 14,
    aov: Number(input.aov) || 1000,
    percInTest: Number(input.percInTest) || 100,
  };

  const distros = setupDistros(inputValues);
  addCredibleIntervals(distros, inputValues);
  return calcProbs(distros, samples, inputValues, business);
};

module.exports = calc;

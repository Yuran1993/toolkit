const jStat = require('jstat');

let result = null;

const tools = {
  perc(temp) {
    return (temp * 100).toFixed(2) + '%';
  },

  NormalDensityZx(x, Mean, StdDev) {
    const a = x - Mean;
    return Math.exp(-(a * a) / (2 * StdDev * StdDev)) / (Math.sqrt(2 * Math.PI) * StdDev);
  },

  normDist(x, mean, sd, cumulative) {
    // Check parameters
    if (isNaN(x) || isNaN(mean) || isNaN(sd)) { return '#VALUE!'; }
    if (sd <= 0) { return '#NUM!'; }
    // Return normal distribution computed by jStat [http://jstat.org]
    return (cumulative) ? jStat.normal.cdf(x, mean, sd) : jStat.normal.pdf(x, mean, sd);
  },

  round(num, dec) {
    return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
  }
};

const calc = (dataValues) => {
  return new Promise((resolve) => {
    Object.keys(dataValues).forEach(key => {
      dataValues[key] = Number(dataValues[key]);
    });
    
    const zTable = {
      1: {
        0.9: 1.281551,
        0.95: 1.644853,
        0.99: 2.326348
      },
      2: {
        0.9: 1.644853,
        0.95: 1.959964,
        0.99: 2.575829
      },
    };

    let power;
    const crA = dataValues.ca / dataValues.ua;
    const crB = dataValues.cb / dataValues.ub;
    const crUplift = (crB - crA) / crA;
    const seA = Math.sqrt((crA * (1 - crA)) / dataValues.ua);
    const seB = Math.sqrt((crB * (1 - crB)) / dataValues.ub);
    const hypothesis = Number(dataValues.tail);
    const confidence = Number(dataValues.sig || '0.95');

    const seDiff = Math.sqrt(Math.pow(seA, 2) + Math.pow(seB, 2));
    const zScore = (crB - crA) / seDiff;
    const zCritical = zTable[hypothesis][confidence];
    const lowerA = crA - (zCritical * seA);
    const upperA = crA + (zCritical * seA);
    const pValue = 1 - tools.normDist(zScore, 0, 1, true);
    const significant = (pValue < (1 - confidence) && hypothesis === 1 || ((pValue > (confidence + (1 - confidence) / 2) || pValue < (1 - confidence - (1 - confidence) / 2)) && hypothesis === 2)) ? true : false;
    const positive = (crB > crA) ? true : false;

    if (positive || hypothesis === 1) {
      power = 1 - tools.normDist(((crA + seA * zCritical - crB) / seB), 0, 1, true);
    } else {
      power = 1 - tools.normDist(((crB + seB * zCritical - crA) / seA), 0, 1, true);
    }

    const srmN = dataValues.ua + dataValues.ub;
    const srmP = dataValues.ub / srmN;
    const srmPvalue = jStat.ztest(srmP, 0.5, Math.sqrt(srmP * (1 - srmP) / srmN));
    let srmError = false;

    if (srmPvalue < 0.001) {
      srmError = true;
    } else {
      srmError = false;
    }

    let state;

    for (let i2 = (crB - seB * 4); i2 < (crB + seB * 4); i2 += seB / 20) {
      if (i2 > upperA && significant === true) {
        state = 'positive';
      } else if (i2 < lowerA && significant === true && positive !== true) {
        state = 'negative';
      } else if (i2 > upperA) {
        state = 'neutral';
      }
    }

    result = {
      crA,
      crB,
      crUplift: Math.abs(crUplift),
      crUplift2: crUplift,
      seA: tools.round(seA, 6),
      seB: tools.round(seB, 6),
      seDiff: tools.round(seDiff, 6),
      zScore: tools.round(zScore, 4),
      zCritical,
      lowerA,
      upperA,
      power: (power).toFixed(2),
      pValue: (pValue).toFixed(4),
      confidence,
      hypothesis,
      significant,
      positive,
      state,
      highLow: crB > crA ? 'higher' : 'lower',
      srmError,
    };

    resolve(result);
  });
};

module.exports = calc;

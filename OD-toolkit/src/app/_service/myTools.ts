import { jStat } from './jstat';

export const myTools = {
  perc(temp: number) {
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

  round(num: number, dec: number) {
    return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
  }
};


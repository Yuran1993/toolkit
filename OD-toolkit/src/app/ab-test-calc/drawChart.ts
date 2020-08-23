import { GoogleCharts } from '../_service/google-charts';
import { myTools } from '../_service/myTools';

export const drawBasic = (result) => {
  const {
    crA,
    crB,
    significant,
    positive
  } = result;

  const c = result.zCritical * result.seA;
  const d = result.zCritical * result.seB;

  const minV = Math.min(crA - c, crB - d);
  const maxV = Math.max(crA + c, crB + d);
  const min = minV - (maxV - minV) / 8;
  const max = maxV + (maxV - minV) / 8;
  const color1 = (significant === true) ? ((positive) ? '#b4e6b4' : '#feb5a4') : '#c1daf0';
  const color2 = (significant === true) ? ((positive) ? '#5cb85c' : '#fd8163') : '#428bca';
  const data = GoogleCharts.api.visualization.arrayToDataTable([
    ['Group', 'Zero', { role: 'style' }, 'Left', { role: 'style' }, 'Middle', { role: 'style' },
      'Right', { role: 'style' }, { role: 'annotation' }],
    ['A', crA - c, 'opacity: 0.0', c, '#ccc', c / 17, '#555', c, '#ccc', myTools.perc(crA)],
    ['B', crB - d, 'opacity: 0.0', d, color1, d / 17, color2, d, color1, myTools.perc(crB)]
  ]);

  const options = {
    hAxis: {
      gridlines: {
        color: '#eee',
        count: 0
      },
      minorGridlines: {
        count: 0
      },
      format: '##.##%',
      viewWindowMode: 'explicit',
      viewWindow: {
        max: (max + max * 0.05),
        min
      }
    },
    backgroundColor: { fill: 'transparent' },
    height: '70',
    width: '100%',
    chartArea: {
      height: '70'
    },
    legend: 'none',
    bar: { groupWidth: '22' },
    isStacked: true,
    enableInteractivity: false,
    annotations: {
      textStyle: {
        fontSize: 14,
        bold: true,
      }
    }
  };

  const chart = new GoogleCharts.api.visualization.BarChart(document.getElementById('smallChart'));
  chart.draw(data, options);
}

export const drawLargeChart = (result) => {
  const {
    crA,
    seA,
    crB,
    seB,
    lowerA,
    upperA,
    confidence,
    hypothesis,
    significant,
    positive
  } = result;

  const options = {
    enableInteractivity: false,
    tooltip: {
      isHtml: true
    },
    series: {
      0: { lineWidth: 22 },
      1: { lineWidth: 2 }
    },
    height: '90%',
    width: '90%',
    chartArea: { left: '10%', top: '5%', width: '85%', height: '90%' },
    legend: 'none',
    hAxis: {
      format: '##.##%',
      gridlines: {
        count: 8,
        color: 'transparent'
      },
      minorGridlines: {
        count: 0
      }
    },
    vAxis: {
      gridlines: {
        count: 0
      },
      minorGridlines: {
        count: 0
      }
    },
    annotations: {
      stemColor: '#ddd',
      style: 'line',
      textStyle: {
        opacity: 0.5,
      }
    }
  };

  const data = new GoogleCharts.api.visualization.DataTable();
  data.addColumn('number', 'Conversion rate');
  data.addColumn({ type: 'string', role: 'annotation' });
  data.addColumn({ type: 'string', role: 'annotationText' });
  data.addColumn('number', 'Probability density1');
  data.addColumn('number', 'Probability density2');
  data.addColumn({ type: 'string', role: 'style' });

  // Draw Bell curve variation A
  const chartData = new Array([]);
  let index = 0;
  for (let i = (crA - seA * 4); i < (crA + seA * 4); i += seA / 20) {
    chartData[index] = new Array();
    chartData[index][0] = i;
    if (i >= crA && i < (crA + seA / 20)) {
      chartData[index][1] = 'CR A: ' + myTools.perc(crA);
      chartData[index][2] = 'Conversion Rate A: ' + crA * 100 + '%';
    } else if (i < (upperA + (seA / 20)) && i > (upperA)) {
      chartData[index][1] = confidence * 100 + '%';
      chartData[index][2] = confidence * 100 + '% interval';
    } else if ((i > (lowerA - (seA / 20)) && i < (lowerA)) && hypothesis === 2) {
      chartData[index][1] = confidence * 100 + '%';
      chartData[index][2] = confidence * 100 + '% interval';
    } else {
      chartData[index][1] = null;
      chartData[index][2] = null;
    }

    chartData[index][4] = myTools.NormalDensityZx(i, crA, seA);
    chartData[index][3] = null;
    chartData[index][5] = 'color: rgb(255, 255, 255);stroke-color: #ccc';

    index++;
  }

  data.addRows(chartData);

  // Draw Bell curve variation B
  const chartData2 = new Array([]);
  let index2 = 0;

  for (let i2 = (crB - seB * 4); i2 < (crB + seB * 4); i2 += seB / 20) {
    chartData2[index2] = new Array();
    chartData2[index2][0] = i2;

    if (i2 >= crB && i2 < (crB + seB / 20)) {
      chartData2[index2][1] = 'CR B: ' + myTools.perc(crB);
      chartData2[index2][2] = 'Conversion Rate B: ' + myTools.perc(crB);
    } else {
      chartData2[index2][1] = null;
      chartData2[index2][2] = null;
    }
    chartData2[index2][3] = null;
    chartData2[index2][4] = myTools.NormalDensityZx(i2, crB, seB);
    if (i2 > upperA && significant === true) {
      chartData2[index2][5] = 'color: rgb(180, 230, 180);stroke-color: #5cb85c';
    } else if (i2 < lowerA && significant === true && positive !== true) {
      chartData2[index2][5] = 'color: rgb(253,129,99);stroke-color: #fd8163';
    } else if (i2 > upperA) {
      chartData2[index2][5] = 'color: rgb(180, 180, 180);stroke-color: #555';
    } else {
      chartData2[index2][5] = 'color: rgb(250, 250, 250);stroke-color: #999';
    }
    index2++;
  }
  data.addRows(chartData2);

  const chart = new GoogleCharts.api.visualization.AreaChart(document.getElementById('largeChart'));
  chart.draw(data, options);
}
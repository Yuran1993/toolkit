import { Component, OnInit, HostListener, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { InputDataControllerService } from '../_service/input-data-controller.service';
import { GoogleCharts } from '../_service/google-charts';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-bayes-calc',
  templateUrl: './bayes-calc.component.html',
  styleUrls: ['./bayes-calc.component.scss']
})
export class BayesCalcComponent implements OnInit, OnDestroy {
  dataController = this.inputDataController.start(this);
  dataValues = this.dataController.inputData;
  businessCorrect = false;
  business = {
    duration: {
      value: null,
      err: null
    },
    percInTest: {
      value: 100,
      err: null
    },
    aov: {
      value: null,
      err: null
    },
  };

  @ViewChild('table', { static: false }) largeTable: ElementRef;
  tableHeight = this.largeTable ? this.largeTable.nativeElement.offsetHeight : 200;
  smallTable = false;
  tableValues = null;

  addBusiness = false;
  hideBusiness = 'opacs';

  result = null;
  hideHtml = 'hideHtml';
  error = false;

  constructor(
    private router: Router,
    private inputDataController: InputDataControllerService,
    private activeRoute: ActivatedRoute,
    private http: HttpClient
  ) { }

  drawChart(result) {
    const valueA = result[0]['Bayesian Score'] * 100;
    const valueB = result[1]['Bayesian Score'] * 100;
    const data = new GoogleCharts.api.visualization.arrayToDataTable([
      ['variation', 'bayes', { role: 'style' }, { role: 'annotation' } ],
      ['A', valueA, '#D05662', valueA.toFixed(2) + '%'],
      ['B', valueB, '#0A5504', valueB.toFixed(2) + '%'],
    ]);

    const view = new GoogleCharts.api.visualization.DataView(data);

    const options = {
      width: '100%',
      height: '50%',
      bar: { groupWidth: '85%' },
      chartArea: {
        width: '100%',

      },
      legend: { position: 'none' },
      enableInteractivity: false,
      hAxis: {
        gridlines: {
          color: 'transparent'
        },
      },
      vAxis: {
        ticks: [0, 20, 40, 60, 80, 100],
        textPosition: 'none',
        gridlines: {
          color: 'transparent'
        }
      }
    };
    const chart = new GoogleCharts.api.visualization.ColumnChart(document.querySelector('#chart > div'));
    chart.draw(view, options);
  }

  getData(params: string): Observable<object> {
    return this.http.get('api/calc/bayescalculator?' + params);
  }

  async getValues() {
    return new Promise((resolve) => {
      const cra = this.dataValues.ca / this.dataValues.ua;
      const crb = this.dataValues.cb / this.dataValues.ub;
      const uplift = crb / cra - 1;
      this.tableValues = { ... this.dataValues, cra, crb, uplift };

      let queryString = Object.keys(this.dataValues).map(key => key + '=' + this.dataValues[key]).join('&');

      if (this.addBusiness) {
        queryString += '&';
        queryString += Object.keys(this.business).map(key => key + '=' + this.business[key].value).join('&');
      }

      this.getData(queryString)
        .subscribe(data => {
          this.result = data;
          if (this.addBusiness) {
            this.hideBusiness = '';
          }
          resolve();
        });
    });
  }

  async go() {
    if (this.dataValues.ua < this.dataValues.ca || this.dataValues.ub < this.dataValues.cb) {
      this.hideHtml = 'hideHtml';
      setTimeout(() => {
        this.error = true;
      }, 300);
    } else {
      this.dataController.setQueryParams();

      await this.getValues();
      this.error = false;

      setTimeout(async () => {
        this.drawChart(this.result);
        this.hideHtml = '';
      }, 0);
    }
  }

  getBusiness() {
    this.businessCorrect = true;

    Object.values(this.business).forEach(e => {
      if (this.businessCorrect) {
        if (e.value === null) {
          this.businessCorrect = false;
          e.err = 'err';
        } else {
          this.businessCorrect = true;
          e.err = null;
        }
      } else if (e.value === null) {
        e.err = 'err';
      }
    });
    if (this.businessCorrect) {
      this.addBusiness = true;
      this.getValues();
      this.hideBusiness = '';
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize($event: Event) {
    this.drawChart(this.result);

    // this.smallTable = window.innerWidth < 635;
    // this.tableHeight = this.largeTable ? this.largeTable.nativeElement.offsetHeight : 200;
  }

  async ngOnInit() {
    document.body.className = "backgroundColor";
    window.scrollTo(0, 0);
    await this.getValues();

    const loadChart = () => {
      this.drawChart(this.result);
      this.hideHtml = '';
    };
    GoogleCharts.load(loadChart);

    this.smallTable = window.innerWidth < 635;
  }

  ngOnDestroy(){
    document.body.className="";
  }
}

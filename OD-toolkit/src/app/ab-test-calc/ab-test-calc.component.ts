import { Component, OnInit, HostListener, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InputDataControllerService } from '../_service/input-data-controller.service';
import { GoogleCharts } from '../_service/google-charts';
import { drawBasic, drawLargeChart } from './drawChart';

interface LooseObject {
  [key: string]: any;
}

@Component({
  selector: 'app-ab-test-calc',
  templateUrl: './ab-test-calc.component.html',
  styleUrls: ['./ab-test-calc.component.scss'],
})

export class AbTestCalcComponent implements OnInit, OnDestroy {
  dataController = this.inputDataController.start(this);
  dataValues = this.dataController.inputData;
  result: LooseObject;
  myTimeout = null;
  hideHtml = 'hideHtml';
  error = false;

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private http: HttpClient,
    private inputDataController: InputDataControllerService,
  ) { }

  getData(params: string): Observable<object> {
    return this.http.get('./api/calc/abtestcalculator?' + params);
  }

  async getValues() {
    return new Promise((resolve) => {
      const queryString = Object.keys(this.dataValues).map(key => key + '=' + this.dataValues[key]).join('&');


      this.getData(queryString)
        .subscribe(data => {
          this.result = data;
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
      setTimeout(() => {
        drawBasic(this.result);
        drawLargeChart(this.result);
        this.hideHtml = '';
      }, 0);
    }
  }

  timeoutFunc = () => {
    clearTimeout(this.myTimeout);
    this.myTimeout = setTimeout(async () => {
      this.go();
    }, 300);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.timeoutFunc();
  }

  async ngOnInit() {
    document.body.className = "backgroundColor";
    window.scrollTo(0, 0);
    await this.getValues();
    if (this.dataValues.ua < this.dataValues.ca || this.dataValues.ub < this.dataValues.cb) {
      this.error = true;
    }

    const loadChart = () => {
      drawBasic(this.result);
      drawLargeChart(this.result);
      this.hideHtml = '';
    };
    setTimeout(() => {
      GoogleCharts.load(loadChart);
    }, 0);
  }

  ngOnDestroy(){
    document.body.className="";
  }
}

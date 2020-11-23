import { Component, OnDestroy, OnInit } from '@angular/core';
import { AnalyticsSettingsService } from '../analytics-settings.service';
import { ReadyStateService } from '../ready-state.service';
import { GoogleAuthService } from '../_service/google-auth.service';

@Component({
  selector: 'app-sample-size-calc',
  templateUrl: './sample-size-calc.component.html',
  styleUrls: ['./sample-size-calc.component.scss']
})
export class SampleSizeCalcComponent implements OnInit, OnDestroy {
  ready = false;
  gotGoogleAuth: any;
  currentStep = 'step_1'
  step1 = {
    pageType: {
      options: ['Pages', 'Content group'],
      selected: 'Pages'
    },
    methodes: {
      options: ['Equal to', 'Includes', 'Regex'],
      selected: 'Equal to'
    },
    contentGroups: {
      options: ['content group 1', 'content group 1', 'content group 1'],
      selected: ''
    },
  }

  constructor(
    private readyState: ReadyStateService,
    public googleAuth: GoogleAuthService,
    public analyticsSettings: AnalyticsSettingsService
  ) { }

  openGaSettings() {
    this.analyticsSettings.open();
    this.currentStep = 'step_1';
  }

  async ngOnInit() {
    document.body.className = "backgroundColor";

    this.gotGoogleAuth = await this.googleAuth.findGoogleToken();
    await this.analyticsSettings.getUserSettings();
    this.ready = true;
    this.readyState.ready = true;
  }
  ngOnDestroy() {
    document.body.className = "";
    this.readyState.ready = false;
  }
}

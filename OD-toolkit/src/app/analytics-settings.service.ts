import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GoogleAuthService } from './_service/google-auth.service';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsSettingsService {
  loader: boolean;

  allAccounts: any = [];
  allProperties: any = [];
  allViews: any = [];

  standardSettings = {
    account: '',
    property: '',
    view: '',
    settingsSet: false,
  }

  userSettings = { ...this.standardSettings }

  constructor(
    private http: HttpClient
  ) { }

  saveUserSettings() {
    this.http.post<any>('api/googleAuth/saveUserSettings', this.userSettings).subscribe(result => {
      this.userSettings.settingsSet = true;
    });
  }

  getUserSettings() {
    return new Promise(async resolve => {
      this.http.get<any>('api/googleAuth/getUserSettings').subscribe(async result => {
        this.loader = true;
        if (result) {
          this.userSettings.settingsSet = true;

          await this.getAnalyticsAccounts();
          this.userSettings.account = result.account;
          await this.getAnalyticsProperties();
          this.userSettings.property = result.property;
          await this.getAnalyticsViews();
          this.userSettings.view = result.view;

          this.loader = false;
          resolve()
        } else {
          await this.getAnalyticsAccounts();

          this.loader = false;
          resolve()
        }
      });
    });
  }

  async getAnalyticsAccounts() {
    this.http.get<any>('api/googleAuth/getAnalyticsAccounts').subscribe(result => {
      this.loader = true;
      this.allAccounts = result;
      this.loader = false;
    });
  }
  async getAnalyticsProperties() {
    this.loader = true;
    this.allProperties = [];
    this.allViews = [];
    this.userSettings.property = '';
    this.userSettings.view = '';

    console.log('propery: ', this.userSettings.property);

    const httpOptions = {
      headers: new HttpHeaders({ 'accountID': this.userSettings.account })
    };
    this.http.get<any>('api/googleAuth/getAnalyticsProperties', httpOptions).subscribe(result => {
      this.allProperties = result;
      this.loader = false;
    });
  }

  async getAnalyticsViews() {
    this.loader = true;
    this.allViews = [];
    this.userSettings.view = '';

    const httpOptions = {
      headers: new HttpHeaders({ 'accountID': this.userSettings.account, 'PropertyID': this.userSettings.property })
    };
    this.http.get<any>('api/googleAuth/getAnalyticsViews', httpOptions).subscribe(result => {
      this.allViews = result;
      this.loader = false;
    });
  }

  async open() {
    const userSettingsClone = { ...this.userSettings };
    this.userSettings = { ...this.standardSettings };

    await this.getAnalyticsAccounts();
    this.userSettings.account = userSettingsClone.account;
    await this.getAnalyticsProperties();
    this.userSettings.property = userSettingsClone.property;
    await this.getAnalyticsViews();
    this.userSettings.view = userSettingsClone.view;

    this.userSettings.settingsSet = false;
  }

  reset() {
    this.userSettings = { ...this.standardSettings };
  }
}

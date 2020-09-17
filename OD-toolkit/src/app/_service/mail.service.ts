import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MailService {
  private _mailUrl = 'api/addToolReq';
  private _registerUrl = 'api/register';
  private _forgotPassword = 'api/forgotPassword';

  constructor(private http: HttpClient) {}

  addToolsReq(tool) {
    this.http.post<any>(this._mailUrl, {tool})
  }
  
  register(data) {
    return this.http.post<any>(this._registerUrl, data);
  }
  
  forgotPassword(data) {
    return this.http.post<any>(this._forgotPassword, data);
  }
}

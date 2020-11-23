import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  findGoogleToken() {
    return new Promise((resolve) => {
      //? find google auth token, set it and redirect user to the calc page or send user to the google auth screen
      this.http.get<any>('api/googleAuth/findToken').subscribe(result => {
        
        if (result.auth) {
          resolve(true);
        } else if (!result.auth) {
          this.route.queryParams.subscribe(params => {
            if (params.code) {
              //? set google token
              this.http.post<any>('api/googleAuth/setToken', params).subscribe(result => {
                //? send user back to the calculation page
                window.location.href = JSON.parse(params.state).component;
                resolve(true);
              });
            } else {
              //? send user to the google auth screen
              resolve(false);
            }
          });
        }
      });
    });
  }

  getGoogleAuth() {
    //? get url for google auth screen
    this.http.get<any>('api/googleAuth/login').subscribe(result => {
      const url = result.url;
      window.location.href = url;
    });
  }
}

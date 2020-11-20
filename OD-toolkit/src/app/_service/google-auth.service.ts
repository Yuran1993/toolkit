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
      // callback end for a token
      this.http.get<any>('api/googleAuth/findToken').subscribe(result => {
        
        if (result.auth) {
          resolve(true);
        } else if (!result.auth) {
          this.route.queryParams.subscribe(params => {
            if (params.code) {
              this.http.post<any>('api/googleAuth/setToken', params).subscribe(result => {
                // Send user back to the calculation page
                window.location.href = JSON.parse(params.state).component;
                resolve(true);
              });
            } else {
              // send user to the google auth screen
              resolve(false);
            }
          });
        }
      });
    });
  }

  getGoogleAuth() {
    this.http.get<any>('api/googleAuth/login').subscribe(result => {
      const url = result.url;
      window.location.href = url;
    });
  }
}

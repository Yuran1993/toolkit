import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GetUser } from './getUser.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class authService {
  tools: [];

  private _loginUrl = "api/login";

  constructor(
    private http: HttpClient,
    private router: Router,
    private user: GetUser,
  ) { }

  loginUser(user) {
    return this.http.post<any>(this._loginUrl, user);
  }

  loggedIn() {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.user.reset();
    this.router.navigate(['']);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getTools() {
    return new Promise<[]>((resolve) => {
      if (!this.tools) {
        this.http.get<[]>('api/getTools').subscribe(result => {
          this.tools = result
          resolve(this.tools);
        });
      } else {
        resolve(this.tools);
      }
    });
  }

  getUser() {
    const token = localStorage.getItem('token');

    if (token) {
      return new Promise<[]>((resolve) => {
        this.http.get<[]>('api/toolsAuth').subscribe(result => {

          this.user.changeToolsAuth(result);

          resolve();
        });
      });
    } else {
      this.user.reset();
    }
  }

  async getToolsWAuth() {
    return new Promise<[]>(async (resolve) => {
      this.getUser();
      await this.getTools();
      this.user.currentToolAuth.subscribe(async user => {

        if (user) {
          this.tools.forEach((e: any, i: number) => {
            e.auth = false;

            const currentAuth = user.tools.find((element) => element.url === e.url);
            if (currentAuth) {
              e.auth = currentAuth.auth;
            }
          });
        }
        resolve(this.tools);
      });
    });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class authService {
  tools: any;

  noAccount = {
    name: '',
    tools: [],
  };

  private authArray = new BehaviorSubject(this.noAccount);
  currentToolAuth = this.authArray.asObservable();

  private _loginUrl = "api/login";

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  loginUser(user) {
    return this.http.post<any>(this._loginUrl, user);
  }

  loggedIn() {
    return !!localStorage.getItem('token');
  }

  async logout() {
    localStorage.removeItem('token');
    this.reset();
    this.router.navigate(['']);
  }

  getTools() {
    return new Promise<[]>((resolve) => { //! have to find out where to mix authentication from the tools.js with costum auth in the users account: here or in the backend api
      if (!this.tools) {
        this.http.get<[]>('api/getTools').subscribe(result => {
          this.tools = result;
          resolve(this.tools);
        });
      } else {
        resolve(this.tools);
      }
    });
  }

  getUser() {
    return new Promise(async (resolve) => {
      const token = localStorage.getItem('token');

      if (token) {
        this.http.get<[]>('api/getUser').subscribe(result => {
          this.changeToolsAuth(result);
          resolve();
        });
      } else {
        await this.reset();
        resolve();
      }
    });
  }

  async changeToolsAuth(userTools: any) {
    await this.getTools();

    this.tools.forEach((e) => {
      if (e.openForAccounts) {
        e.auth = true;
      }
    });

    userTools.tools.forEach(userTool => {
      const tempTool = this.tools.find(e => e.url === userTool.url);
      tempTool.auth = userTool.auth;
    });

    console.log(userTools);

    userTools.tools = this.tools;
    this.authArray.next(userTools);
  }

  reset() {
    return new Promise(async (resolve) => {
      await this.getTools();

      this.tools.forEach((e) => {
        if (e.open) {
          e.auth = true;
        } else {
          e.auth = false;
        }
      });

      this.noAccount.tools = this.tools;
      this.authArray.next(this.noAccount);
      resolve();
    });
  }
}

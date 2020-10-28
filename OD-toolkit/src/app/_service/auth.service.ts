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
  private _registerUrl = 'api/register';
  private _forgotPassword = 'api/forgotPasswordMail';
  private _changePassword = 'api/changePassword';
  private _verify = 'api/sendVerifyMail';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }


  register(data) {
    return this.http.post<any>(this._registerUrl, data);
  }

  forgotPassword(data) {
    return this.http.post<any>(this._forgotPassword, data);
  }

  changePassword(userData) {
    return new Promise(async (resolve) => {
      console.log(userData);

      this.http.post<any>(this._changePassword, userData).subscribe(
        res => {
          console.log(res);
          
          localStorage.setItem('token', res.token);
          this.changeToolsAuth(res.user);
          resolve();
        },
        err => {
          resolve(err);
        }
      );
    });
  }

  getUser() {
    return new Promise(async (resolve) => {
      const token = localStorage.getItem('token');

      if (token) {
        this.http.get<[]>('api/getUser').subscribe(result => {
          this.changeToolsAuth(result);
          resolve(result);
        });
      } else {
        await this.reset();
        resolve();
      }
    });
  }

  sendVerifyMails(email) {
    return this.http.post<any>(this._verify, email);
  }

  verifyUser(id) {
    console.log(id);

    this.http.post<any>('api/verifyUser', id).subscribe(result => {
      localStorage.setItem('token', result.token);
      this.changeToolsAuth(result.user);
      console.log(result);

      this.router.navigate([], {
        queryParams: [],
        replaceUrl: true,
      });
    });
  }

  loginUser(user) {
    return this.http.post<any>(this._loginUrl, user);
  }

  loggedIn() {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.reset();
    this.router.navigate(['']);
  }

  getTools() {
    return new Promise<[]>((resolve) => { //! have to find out where to mix authentication from the tools.js with custom auth in the users account: here or in the backend api
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

  async changeToolsAuth(userTools: any) {
    return new Promise(async (resolve) => {
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

      userTools.tools = this.tools;
      this.authArray.next(userTools);
      resolve();
    });
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

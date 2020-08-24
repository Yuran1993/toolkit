import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToolsService } from './tools.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class authService {

  private _loginUrl = "api/login";

  constructor(
    private http: HttpClient,
    private getToolsAuth: ToolsService, 
    private router:Router
  ) { }

  loginUser(user) {
    return this.http.post<any>(this._loginUrl, user);
  }

  loggedIn() {
    return !!localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    this.getToolsAuth.reset();
    setTimeout(() => {
      this.router.navigate(['']);
    }, 2000);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getToolsAuthServer() {
    const token = localStorage.getItem('token');
    
    if (token) {
      this.http.get<[]>('api/toolsAuth').subscribe(result => {
        this.getToolsAuth.changeToolsAuth(result)
      });
    } else {
      this.getToolsAuth.reset();
    }
  }
}

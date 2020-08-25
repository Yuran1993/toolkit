import { Injectable } from '@angular/core';
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, Router } from '@angular/router';

import { ToolsService } from './_service/tools.service';
import { authService } from './_service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private getToolsAuth: ToolsService, private router: Router, public auth: authService) { }

  async canActivate(activeRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let pageAuth:any;

    let tools:any = await this.auth.getToolsAuthServer();
    if (!tools) {
      this.getToolsAuth.currentToolAuth.subscribe(result => {
        tools = result;
      });
    }

    const page = state.url.replace('/', '');
    pageAuth = tools.find(e => e.url === page);

    if (pageAuth && pageAuth.auth) {
      return true;
    } else {
      this.router.navigate(['']);
      return false;
    }
  }
}

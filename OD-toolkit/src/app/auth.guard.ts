import { Injectable } from '@angular/core';
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, Router } from '@angular/router';

import { GetUser } from './_service/getUser.service';
import { authService } from './_service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private getToolsAuth: GetUser, private router: Router, public auth: authService) { }

  async canActivate(activeRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let pageAuth:any;

    let user:any = await this.auth.getUser();
    if (!user) {
      this.getToolsAuth.currentToolAuth.subscribe(result => {
        user = result;
      });
    }

    const page = state.url.replace('/', '');
    pageAuth = user.tools.find(e => e.url === page);

    if (pageAuth && pageAuth.auth) {
      return true;
    } else {
      this.router.navigate(['']);
      return false;
    }
  }
}

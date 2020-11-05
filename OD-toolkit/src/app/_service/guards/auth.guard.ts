import { Injectable } from '@angular/core';
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, Router } from '@angular/router';

import { authService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, public auth: authService) { }

  async canActivate(activeRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let user;
    const page = state.url.replace('/', '');

    this.auth.currentToolAuth.subscribe(result => {
      user = result;
    });

    let pageAuth = user.tools.find(e => e.url === page);

    if (!pageAuth) {
      pageAuth = await this.auth.getUser();
      pageAuth = pageAuth.tools.find(e => e.url === page);
    }

    if (pageAuth && pageAuth.auth) {
      return true;
    } else {
      this.router.navigate(['']);
      return false;
    }
  }
}

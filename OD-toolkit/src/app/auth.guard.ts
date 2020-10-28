import { Injectable } from '@angular/core';
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, Router } from '@angular/router';

import { authService } from './_service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, public auth: authService) { }

  async canActivate(activeRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let user;
    let pageAuth;
    const page = state.url.replace('/', '');

    this.auth.currentToolAuth.subscribe(result => {
      user = result;
    });

    pageAuth = user.tools.find(e => e.url === page);

    if (!pageAuth) { //? Heeft het een tijd niet gedaan, lijkt het nu toe doen, maar kan nog onverwacht breken 
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

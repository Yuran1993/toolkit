import { Injectable } from '@angular/core';
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, Router } from '@angular/router';

import { ToolsService } from './_service/tools.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private getToolsAuth: ToolsService, private router:Router) {}

  canActivate(activeRoute: ActivatedRouteSnapshot,  state: RouterStateSnapshot): boolean {
    let pageAuth;
    this.getToolsAuth.currentToolAuth.subscribe(result => {
      const tools = result;
      const page = state.url.replace('/', '');

      pageAuth = tools.find(e => e.url === page);
    });

    if (pageAuth && pageAuth.auth) {
      return true;
    } else {
      this.router.navigate(['']);
      return false;
    }
  }
}

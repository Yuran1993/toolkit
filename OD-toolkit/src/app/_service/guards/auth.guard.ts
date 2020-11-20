import { Injectable } from '@angular/core';
import { CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { authService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, public auth: authService) { }

  canActivate(activeRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> {
    let user;
    const page = state.url.replace('/', '');

    this.auth.currentToolAuth.subscribe(result => {
      user = result;
    });

    let pageAuth = user.tools.find(e => e.url === page);

    if (!pageAuth) {
      return new Observable<boolean>((observer) => {
        this.auth.getUser().then((value) => {
          pageAuth = value;
          setTimeout(() => {
            if (pageAuth) {
              pageAuth = pageAuth.tools.find(e => e.url === page);
              if (pageAuth && pageAuth.auth) {
                observer.next(true);
              } else {
                observer.next(false);
                this.router.navigate(['']);
              }
            } else {
              observer.next(false);
              this.router.navigate(['']);
            }
            observer.complete();
          }, 500);
        });
      });
    } else if (pageAuth && pageAuth.auth) {
      return true;
    }
  }
}

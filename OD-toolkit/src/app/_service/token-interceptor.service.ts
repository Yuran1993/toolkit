import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor } from "@angular/common/http";
import { authService } from "./auth.service";
import { GoogleAuthService } from './google-auth.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private injector: Injector) { }

  intercept(req, next){
    const auth = this.injector.get(authService);
    const googleAuth = this.injector.get(GoogleAuthService);
    const tokenizedReq = req.clone({
      setHeaders: {
        Authorization: 'Bearer ' + localStorage.getItem('token') 
      }
    })
    return next.handle(tokenizedReq);
  };
}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetUser {
  standard = {
    name: false,
    tools: [
      { url: 'abtest-calculator', auth: true },
    ]
  };

  private authArray = new BehaviorSubject(this.standard);
  currentToolAuth = this.authArray.asObservable();

  constructor() { }

  changeToolsAuth(tools:any) {
    tools.tools = tools.tools.concat(this.standard.tools);
    this.authArray.next(tools);
  }

  reset() {    
    this.authArray.next(this.standard);
  }
}

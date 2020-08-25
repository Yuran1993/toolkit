import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ToolsService {
  standard = [
    { url: '1', auth: true },
    { url: '2', auth: false },
    { url: '3', auth: false },
    { url: '4', auth: false },
    { url: '5', auth: false },
    { url: '6', auth: false },
  ];

  private authArray = new BehaviorSubject(this.standard);

  currentToolAuth = this.authArray.asObservable();
  constructor() { }

  changeToolsAuth(tools:[]) {
    this.authArray.next(tools);
  }

  reset() {    
    this.authArray.next(this.standard);
  }
}

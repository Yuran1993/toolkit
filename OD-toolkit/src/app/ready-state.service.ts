import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReadyStateService {
  ready:boolean;

  constructor() { }
}

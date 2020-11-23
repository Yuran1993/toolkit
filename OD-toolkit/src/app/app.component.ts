
import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
import { ReadyStateService } from './ready-state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'OD-toolkit';

  constructor(
    public readyState: ReadyStateService
  ) { }

  ngOnInit() {
    //? when in production redirect the user to https
    if (environment.production) {
      if (location.protocol === 'http:') {
        window.location.href = location.href.replace('http', 'https');
      }
    }
  }
}

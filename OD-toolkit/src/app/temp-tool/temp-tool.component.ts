import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-temp-tool',
  templateUrl: './temp-tool.component.html',
  styleUrls: ['./temp-tool.component.scss']
})
export class TempToolComponent implements OnInit {
  tool: string;

  constructor(private router:Router) { }

  ngOnInit() {
    this.tool = this.router.url.replace('/', '');
  }

}

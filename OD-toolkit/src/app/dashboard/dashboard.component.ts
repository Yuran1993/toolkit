import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private http: HttpClient) { }

  tools: []

  getTools() {
    return new Promise<[]>((resolve) => {
      this.http.get<[]>('api/getTools').subscribe(result => {
        resolve(result);
      });
    });
  }

  async ngOnInit() {
    this.tools = await this.getTools();
    console.log(this.tools);
  }
}

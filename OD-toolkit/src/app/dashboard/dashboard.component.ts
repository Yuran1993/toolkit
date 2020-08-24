import { Component, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { ToolsService } from '../_service/tools.service';
import { authService } from '../_service/auth.service';
import { InlogScreenComponent } from '../inlog-screen/inlog-screen.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private getToolsAuth: ToolsService,
    public auth: authService,
    public matDialog: MatDialog
  ) { }

  tools: [];
  toolsAuth;

  openModal(bol:boolean) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.id = "modal-component";
    dialogConfig.disableClose = false;
    dialogConfig.data = `{"login": ${bol}}`;

    const modalDialog = this.matDialog.open(InlogScreenComponent, dialogConfig);
  }

  scroll(id:string) {
    let el = document.getElementById(id);

    el.scrollIntoView();
  }

  getTools() {
    return new Promise<[]>((resolve) => {
      this.http.get<[]>('api/getTools').subscribe(result => {
        resolve(result);
      });
    });
  }

  ngOnInit() {
    this.auth.getToolsAuthServer();
    this.getToolsAuth.currentToolAuth.subscribe(async result => {
      this.tools = await this.getTools();

      if (result) {
        this.tools.forEach((e:any) => {
          const currentAuth = result.find((element) => element.url === e.url);
          if (currentAuth) {
            e.auth = currentAuth.auth;
          }
        });
      }
    });
  }
}

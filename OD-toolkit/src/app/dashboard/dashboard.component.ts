import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { ToolsService } from '../_service/tools.service';
import { authService } from '../_service/auth.service';
import { InlogScreenComponent } from '../inlog-screen/inlog-screen.component';
import { AddToolComponent } from '../add-tool/add-tool.component';

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

  tools: any;
  toolsAuth;

  cardClick(tool) {
    if (this.auth.loggedIn()) {
      if (!tool.auth) {
        this.openAdd(tool.url)
      }
    } else {
      this.openLogReg(false)
    }
  }

  openLogReg(bol: boolean) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.id = "modal-logReg";
    dialogConfig.disableClose = false;
    dialogConfig.data = `{"login": ${bol}}`;
    dialogConfig.position = {
      top: '100px',
    }

    const modalDialog = this.matDialog.open(InlogScreenComponent, dialogConfig);
  }

  openAdd(element) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.id = "modal-addTool";
    dialogConfig.disableClose = false;
    dialogConfig.data = `{"elClicked": "${element}"}`;
    dialogConfig.position = {
      top: '100px'
    }

    const modalDialog = this.matDialog.open(AddToolComponent, dialogConfig);
  }

  scroll(id: string) {
    let el = document.getElementById(id);

    el.scrollIntoView({ behavior: 'smooth' });
  }

  // getTools() {
  //   return new Promise<[]>((resolve) => {
  //     this.http.get<[]>('api/getTools').subscribe(result => {
  //       resolve(result);
  //     });
  //   });
  // }

  async ngOnInit() {
    this.auth.getUser();
    this.tools = await this.auth.getTools();
    this.getToolsAuth.currentToolAuth.subscribe(async user => {

      if (user) {
        this.tools.forEach((e: any, i: number) => {
          e.auth = false;
          console.log(user);


          const currentAuth = user.tools.find((element) => element.url === e.url);
          if (currentAuth) {
            e.auth = currentAuth.auth;
          }
        });

        this.tools = this.tools.sort((x, y) => (x.auth === y.auth) ? 0 : x.auth ? -1 : 1);
      }
    });
  }
}

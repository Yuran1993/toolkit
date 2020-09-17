import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

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
    public auth: authService,
    public matDialog: MatDialog,
  ) { }

  tools: any;
  toolsAuth;

  // cardClick(tool) {
  //   if (this.auth.loggedIn()) {
  //     if (!tool.auth) {
  //       this.openAdd(tool.url)
  //     }
  //   } else {
  //     this.openLogReg(false)
  //   }
  // }

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

async ngOnInit() {
    this.tools = await this.auth.getToolsWAuth();
    this.tools = this.tools.sort((x, y) => (x.auth === y.auth) ? 0 : x.auth ? -1 : 1);
  }
}

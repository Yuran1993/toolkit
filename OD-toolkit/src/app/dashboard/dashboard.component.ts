import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { authService } from '../_service/auth.service';
import { InlogScreenComponent } from '../inlog-screen/inlog-screen.component';
import { AddToolComponent } from '../add-tool/add-tool.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    public auth: authService,
    public matDialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  tools: any;
  toolsAuth;

  openLogReg(show: string, id='') {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.id = "modal-logReg";
    dialogConfig.disableClose = false;
    dialogConfig.data = `{"show": "${show}", "id": "${id}"}`;
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
    this.auth.currentToolAuth.subscribe(result => {
      this.tools = result.tools;
      this.tools = this.tools.sort((x, y) => (x.auth === y.auth) ? 0 : x.auth ? -1 : 1);
    });

    // TODO nu mee bezig
    this.route.queryParams.subscribe(params => {
      if (params && params.ID && params.ID.length) {
        this.auth.verifyUser(params);
        this.openLogReg('userVerified', 'false');
      } else if (params && params.PW && params.PW.length) {
        this.openLogReg('changePassword', params.PW);
        this.router.navigate([], {
          queryParams: [],
          replaceUrl: true,
        });
      }
    });
  }
}

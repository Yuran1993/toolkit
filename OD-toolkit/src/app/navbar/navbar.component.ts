import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { InlogScreenComponent } from "../inlog-screen/inlog-screen.component";
import { authService } from '../_service/auth.service';
import { Router } from '@angular/router';

import { myTools } from '../_service/myTools'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(
    public matDialog: MatDialog,
    public auth: authService,
    private router: Router,
  ) { }

  openLogReg(bol: boolean) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.id = "modal-logReg";
    dialogConfig.disableClose = false;
    dialogConfig.data = `{"login": ${bol}}`;
    dialogConfig.position ={
      top: '100px',
    }

    const modalDialog = this.matDialog.open(InlogScreenComponent, dialogConfig);
  }

  scroll(id: string) {
    let el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({behavior: 'smooth'});
      return;
    } else {
      this.router.navigate(['/']).then(() => {
        setTimeout(() => {
          let el = document.getElementById(id);
          el.scrollIntoView({behavior: 'smooth'});
        }, 200);
      });
    }
  }

  ngOnInit() { }
}

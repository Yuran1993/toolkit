import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { InlogScreenComponent } from "../inlog-screen/inlog-screen.component";
import { AccountComponent } from '../account/account.component';
import { authService } from '../_service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  user:any;

  constructor(
    public matDialog: MatDialog,
    public auth: authService,
    private router: Router,
  ) { }

  openLogReg(show: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.id = "modal-logReg";
    dialogConfig.disableClose = false;
    dialogConfig.data = `{"show": "${show}"}`;
    dialogConfig.position = {
      top: '100px',
    }

    const modalDialog = this.matDialog.open(InlogScreenComponent, dialogConfig);
  }

  openAccount() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.id = "modal-account";
    dialogConfig.disableClose = false;
    dialogConfig.position = {
      top: '100px',
    }

    const modalDialog = this.matDialog.open(AccountComponent, dialogConfig);
  }

  scroll(id: string) {
    let el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      return;
    } else {
      this.router.navigate(['/']).then(() => {
        setTimeout(() => {
          let el = document.getElementById(id);
          el.scrollIntoView({ behavior: 'smooth' });
        }, 200);
      });
    }
  }

  async ngOnInit() {
    // document.querySelector('app-footer').style.display = 'none';
    await this.auth.getUser();
    // document.querySelector('app-footer').style.display = 'block';
    this.auth.currentToolAuth.subscribe(user => {
      this.user = user;
    });
  }
}

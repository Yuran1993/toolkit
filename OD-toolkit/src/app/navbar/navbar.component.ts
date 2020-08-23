import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { InlogScreenComponent } from "../inlog-screen/inlog-screen.component";
import { authService } from '../_service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(public matDialog: MatDialog, private auth: authService, private router:Router) { }

  openModal(bol:boolean) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.id = "modal-component";
    dialogConfig.disableClose = false;
    dialogConfig.data = `{"login": ${bol}}`;

    const modalDialog = this.matDialog.open(InlogScreenComponent, dialogConfig);
  }

  scroll(id:string) {
    this.router.navigate(['/']);
    setTimeout(() => {
      let el = document.getElementById(id);

    el.scrollIntoView();
    }, 200);
  }

  ngOnInit() {}
}

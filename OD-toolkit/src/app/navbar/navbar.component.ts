import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { InlogScreenComponent } from "../inlog-screen/inlog-screen.component";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(public matDialog: MatDialog) { }

  openModal(bol) {

    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.id = "modal-component";
    dialogConfig.disableClose = false;
    // dialogConfig.data = true;
    dialogConfig.data = `{"login": ${bol}}`;
    // https://material.angular.io/components/dialog/overview
    const modalDialog = this.matDialog.open(InlogScreenComponent, dialogConfig);
  }

  ngOnInit() {}
}

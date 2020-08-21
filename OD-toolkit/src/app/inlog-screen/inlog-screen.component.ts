import { Component, OnInit } from '@angular/core';
import { MatDialogRef, throwMatDialogContentAlreadyAttachedError } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';

import { LoginService } from '../_service/login.service'

@Component({
  selector: 'app-inlog-screen',
  templateUrl: './inlog-screen.component.html',
  styleUrls: ['./inlog-screen.component.scss']
})

export class InlogScreenComponent implements OnInit {
  login = JSON.parse(this.data).login;
  errorMsg:string;

  loginUserData = {};

  constructor(public dialogRef: MatDialogRef<InlogScreenComponent>, private auth: LoginService, @Inject(MAT_DIALOG_DATA) public data: any) {  }

  ngOnInit() {}

  // When the user clicks the action button a.k.a. the logout button in the\
  // modal, show an alert and followed by the closing of the modal
  actionFunction() {
    this.auth.loginUser(this.loginUserData)
    .subscribe(
      res => {
        this.errorMsg = '';
        console.log(res);
        this.closeModal();
      },
      err => this.errorMsg = err.error
    );
  }

  // If the user clicks the cancel button a.k.a. the go back button, then\
  // just close the modal
  closeModal() {
    this.dialogRef.close();
  }
}
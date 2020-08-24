import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, throwMatDialogContentAlreadyAttachedError } from '@angular/material/dialog';
import {MAT_DIALOG_DATA} from '@angular/material';

import { authService } from '../_service/auth.service';
import { ToolsService } from '../_service/tools.service';

@Component({
  selector: 'app-inlog-screen',
  templateUrl: './inlog-screen.component.html',
  styleUrls: ['./inlog-screen.component.scss']
})

export class InlogScreenComponent implements OnInit {
  login = JSON.parse(this.data).login;
  loginErrorMsg:string;
  registreerErrorMsg:string;

  loginUserData = {
    email: '',
    password: '',
  };

  constructor(public dialogRef: MatDialogRef<InlogScreenComponent>, private auth: authService, @Inject(MAT_DIALOG_DATA) public data: any, private toolsAuth: ToolsService, private router:Router, ) {  }

  ngOnInit() {}

  actionFunction() {
    this.auth.loginUser(this.loginUserData)
    .subscribe(
      res => {
        localStorage.setItem('token', res.token);
        this.toolsAuth.changeToolsAuth(res.tools);
        
        this.loginErrorMsg = '';
        this.closeModal();
        this.router.navigate(['']);
      },
      err => {
        this.loginErrorMsg = err.error
        console.log(err.error);
        
      }
    );
  }

  // If the user clicks the cancel button a.k.a. the go back button, then\
  // just close the modal
  closeModal() {
    this.dialogRef.close();
  }
}
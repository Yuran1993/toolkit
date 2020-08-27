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

  registerUserData = {
    name: {
      value: '',
      pattern: new RegExp(/[A-Za-z]+/),
      err: false,
    },
    email: {
      value: '',
      pattern: new RegExp(/[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-z]+/),
      err: false,
    },
    company: {
      value: '',
      pattern: new RegExp(/[A-Za-z]+/),
      err: false,
    }
  };

  constructor(public dialogRef: MatDialogRef<InlogScreenComponent>, private auth: authService, @Inject(MAT_DIALOG_DATA) public data: any, private toolsAuth: ToolsService, private router:Router, ) {  }

  ngOnInit() {}

  loginFunc() {
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

  verifyRegister() {
    let err = false;
    Object.keys(this.registerUserData).forEach(element => {
      const field = this.registerUserData[element];

      if (!field.value.match(field.pattern)) {
        field.err = 'err'
        err = true;
      } else {
        field.err = ''
      }
    });

    if (!err) {
      this.sendRegister();
    }
  }

  sendRegister() {
    console.log(this.registerUserData);
  }

  closeModal() {
    this.dialogRef.close();
  }
}
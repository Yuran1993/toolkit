import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, throwMatDialogContentAlreadyAttachedError } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material';

import { authService } from '../_service/auth.service';

@Component({
  selector: 'app-inlog-screen',
  templateUrl: './inlog-screen.component.html',
  styleUrls: ['./inlog-screen.component.scss']
})

export class InlogScreenComponent implements OnInit {
  show = JSON.parse(this.data).show;
  loginErrorMsg: string;
  registreerErrorMsg: string;
  sendVerifyMailBtn = false;
  changePasswordErrorMsg: any;
  reqSend = false;
  loader = false;

  loginUserData: any = {
    email: {
      value: ''.toLowerCase(),
      pattern: new RegExp(/[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-z]+/),
      err: false
    },
    password: {
      value: '',
      err: false
    }
  };

  changePasswordData: any = {
    password: {
      value: '',
      err: false,
    },
    repeatePassword: {
      value: '',
      err: false,
    }
  }

  // TODO alle regexen moeten worden aangepast om speciale tekens toe te laten en ook spaties bijvoorbeeld bij company

  registerUserData: any = {
    name: {
      value: '',
      pattern: new RegExp(/[A-Za-z]+/),
      err: false,
    },
    email: {
      value: ''.toLowerCase(),
      pattern: new RegExp(/[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-z]+/),
      err: false,
    },
    company: {
      value: '',
      pattern: new RegExp(/[A-Za-z]+/),
      err: false,
    },
    password: {
      value: '',
      pattern: new RegExp(/[A-Za-z]+/),
      err: false,
    },
    repeatePassword: {
      value: '',
      pattern: new RegExp(/[A-Za-z]+/),
      err: false,
    },
  };

  constructor(
    public dialogRef: MatDialogRef<InlogScreenComponent>,
    private auth: authService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router) { }

  checkRegisterInput() {
    let errorGevonden = false;
    this.registreerErrorMsg = '';
    Object.keys(this.registerUserData).forEach(element => {
      const field = this.registerUserData[element];

      if (!field.value.match(field.pattern)) {
        field.err = true;
        errorGevonden = true;
      } else {
        field.err = false;
      }
    });

    if (this.registerUserData.password.value !== this.registerUserData.repeatePassword.value) {
      this.registerUserData.password.err = true;
      this.registerUserData.repeatePassword.err = true;
      this.registreerErrorMsg = 'Wachtwoorden komen niet overeen'
      errorGevonden = true;
    }

    if (!errorGevonden) {
      this.sendRegister();
    }
  }

  sendRegister() {
    this.loader = true;
    this.auth.register(this.registerUserData)
      .subscribe(
        res => {
          this.loader = false;
          this.reqSend = true
        },
        err => {
          this.loader = false;
          this.registreerErrorMsg = err.error;
        }
      );
  }

  loginFunc() {
    this.loader = true;
    Object.keys(this.loginUserData).forEach(e => this.loginUserData[e].err = false);
    this.sendVerifyMailBtn = false;

    const user = {
      email: this.loginUserData.email.value,
      password: this.loginUserData.password.value,
    }

    this.auth.loginUser(user)
      .subscribe(
        res => {
          localStorage.setItem('token', res.token);
          this.auth.changeToolsAuth(res.user);

          this.loginErrorMsg = '';
          this.closeModal();
        },
        err => {
          this.loader = false;

          this.loginErrorMsg = err.error.text
          if (err.error.err === 'not Found') {
            this.loginUserData.email.err = true;
          } else if (err.error.err === 'password incorrect') {
            this.loginUserData.password.err = true;
          } else if (err.error.err === 'not verifieed') {
            this.sendVerifyMailBtn = true;
          }
        }
      );
  }

  forgotPasswordMail() {
    Object.keys(this.loginUserData).forEach(e => this.loginUserData[e].err = false);
    const field: any = this.loginUserData['email'];

    if (!field.value.match(field.pattern)) {
      field.err = true;
      this.loginErrorMsg = 'You either provided an incorrect or no email address. <br>Please enter your email address and click “Forgot your password”.';
    } else {
      field.err = '';
    
      this.auth.forgotPassword(field)
        .subscribe(
          res => {
            // TODO onderstaande document.querySelector kan beter, miss met een neutral message veld
            document.querySelector('#modal-content-wrapper').innerHTML = `<p style="font-weight: 500; font-size: 1rem;">Email sent!</p> <p style="margin-bottom: 0;">You will receive a link to change your password via the email address you provided.</p>`;
          },
          err => {
            this.loginErrorMsg = err.error;
            field.err = true;
          }
        );
    }
  }

  async changePassword() {
    this.loader = true;
    // TODO onderstaande foutmeldingen moeten ook bekeken worden

    Object.keys(this.changePasswordData).forEach(e => this.changePasswordData[e].err = false);

    if (!this.changePasswordData.password.value) {
      this.changePasswordData.password.err = true;
      this.changePasswordErrorMsg = 'Field empty';
    } else if (!this.changePasswordData.repeatePassword.value) {
      this.changePasswordData.repeatePassword.err = true;
      this.changePasswordErrorMsg = 'Field empty';
    } else if (this.changePasswordData.password.value !== this.changePasswordData.repeatePassword.value) {
      this.changePasswordData.password.err = true;
      this.changePasswordData.repeatePassword.err = true;
      this.changePasswordErrorMsg = 'Passwords do not match';
    } else {
      const newUserData = {
        id: JSON.parse(this.data).id,
        newPassword: this.changePasswordData.password.value
      }
      const error: any = await this.auth.changePassword(newUserData);

      if (error) {
        this.changePasswordErrorMsg = error.error
      } else {
        this.show = 'passwordChanged';
      }
    }

    this.loader = false;
  }

  sendVerifyMail() {
    Object.keys(this.loginUserData).forEach(e => this.loginUserData[e].err = false);
    const field: any = this.loginUserData['email'];

    this.auth.sendVerifyMails(field)
    .subscribe(
      res => {
        this.loader = false;
        this.reqSend = true
      },
      err => {
        this.loader = false;
        this.registreerErrorMsg = err.error;
      }
    );
  }


  closeModal() {
    this.dialogRef.close();
  }

  ngOnInit() { }
}
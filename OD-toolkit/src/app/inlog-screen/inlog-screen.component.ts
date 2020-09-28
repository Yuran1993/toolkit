import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, throwMatDialogContentAlreadyAttachedError } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material';

import { authService } from '../_service/auth.service';
import { MailService } from '../_service/mail.service';

@Component({
  selector: 'app-inlog-screen',
  templateUrl: './inlog-screen.component.html',
  styleUrls: ['./inlog-screen.component.scss']
})

export class InlogScreenComponent implements OnInit {
  login = JSON.parse(this.data).login;
  loginErrorMsg: string;
  registreerErrorMsg: string;
  reqSend = false;
  loader = false;

  loginUserData = {
    email: {
      value: '',
      pattern: new RegExp(/[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-z]+/),
      err: false
    },
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
      err: '',
    },
    company: {
      value: '',
      pattern: new RegExp(/[A-Za-z]+/),
      err: '',
    },
    password: {
      value: '',
      pattern: new RegExp(/[A-Za-z]+/),
      err: '',
    },
    repeatePassword: {
      value: '',
      pattern: new RegExp(/[A-Za-z]+/),
      err: '',
    },
  };

  constructor(
    public dialogRef: MatDialogRef<InlogScreenComponent>,
    private auth: authService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,
    private mail: MailService) { }

  loginFunc() {
    this.loader = true;
    document.querySelectorAll('#modal-body input').forEach(e => {
      e.classList.remove('err');
    });

    this.auth.loginUser(this.loginUserData)
      .subscribe(
        res => {
          localStorage.setItem('token', res.token);
          this.auth.changeToolsAuth(res.user);

          this.loginErrorMsg = '';
          this.closeModal();
        },
        err => {
          this.loader = false;
          this.loginErrorMsg = err.error
          if (err.error.indexOf('Het opgegeven e-mailadres') !== -1) {
            document.querySelector('[name="loginEmail"]').classList.add('err');
          } else if (err.error.indexOf('Het opgegeven wachtwoord') !== -1) {
            document.querySelector('[name="loginPassword"]').classList.add('err');
          }
        }
      );
  }

  forgotPassword() {
    document.querySelector('[name="loginEmail"]').classList.remove('err');
    const field: any = this.loginUserData['email'];

    if (!field.value.match(field.pattern)) {
      field.err = 'err'
    } else {
      field.err = '';
      this.mail.forgotPassword(field)
        .subscribe(
          res => {
            document.querySelector('#modal-content-wrapper').innerHTML = `<p style="font-weight: 500; font-size: 1rem;">Aanvraag verstuurd!</p> <p style="margin-bottom: 0;">U ontvangt uw wachtwoord via het opgegeven e-mailadres.</p>`;
          },
          err => {
            this.loginErrorMsg = err.error
            document.querySelector('[name="loginEmail"]').classList.add('err');
          }
        );
    }
  }

  verifyRegister() {
    let errorGevonden = false;
    this.registreerErrorMsg = '';
    Object.keys(this.registerUserData).forEach(element => {
      const field = this.registerUserData[element];

      if (!field.value.match(field.pattern)) {
        field.err = 'err'
        errorGevonden = true;
      } else {
        field.err = '';
      }
    });

    if (this.registerUserData.password.value !== this.registerUserData.repeatePassword.value) {
      this.registerUserData.password.err = 'err';
      this.registerUserData.repeatePassword.err = 'err';
      this.registreerErrorMsg = 'Wachtwoorden komen niet overeen'
      errorGevonden = true;
    }

    if (!errorGevonden) {
      this.sendRegister();
    }
  }

  sendRegister() {
    this.loader = true;
    this.mail.register(this.registerUserData)
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
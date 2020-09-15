import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, throwMatDialogContentAlreadyAttachedError } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material';

import { authService } from '../_service/auth.service';
import { GetUser } from '../_service/getUser.service';
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
      err: false,
    },
    company: {
      value: '',
      pattern: new RegExp(/[A-Za-z]+/),
      err: false,
    }
  };

  constructor(
    public dialogRef: MatDialogRef<InlogScreenComponent>,
    private auth: authService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toolsAuth: GetUser,
    private router: Router,
    private mail: MailService) { }

  loginFunc() {
    document.querySelectorAll('#modal-body input').forEach(e => {
      e.classList.remove('err');
    });

    this.auth.loginUser(this.loginUserData)
      .subscribe(
        res => {
          localStorage.setItem('token', res.token);
          this.toolsAuth.changeToolsAuth(res.user);

          this.loginErrorMsg = '';
          this.closeModal();
        },
        err => {
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
    this.mail.register(this.registerUserData)
      .subscribe(
        res => {
          this.reqSend = true
        },
        err => {
          console.log(err.error);
        }
      );
  }

  closeModal() {
    this.dialogRef.close();
  }

  ngOnInit() { }
}
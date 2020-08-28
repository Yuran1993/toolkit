import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, throwMatDialogContentAlreadyAttachedError } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material';

import { authService } from '../_service/auth.service';
import { ToolsService } from '../_service/tools.service';
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
    private toolsAuth: ToolsService,
    private router: Router,
    private mail: MailService) { }

  ngOnInit() { }

  loginFunc() {
    this.auth.loginUser(this.loginUserData)
      .subscribe(
        res => {
          localStorage.setItem('token', res.token);
          this.toolsAuth.changeToolsAuth(res.tools);

          this.loginErrorMsg = '';
          this.closeModal();
          this.router.navigate(['']); //Nodig?
        },
        err => {
          this.loginErrorMsg = err.error
          console.log(err.error);
        }
      );
  }

  forgotPassword() {
    const field: any = this.loginUserData['email'];

    if (!field.value.match(field.pattern)) {
      field.err = 'err'
    } else {
      field.err = '';
      this.mail.forgotPassword(field)
        .subscribe(
          res => {
            console.log(res);
            document.querySelector('#modal-content-wrapper').innerHTML = `<p style="font-weight: 500; font-size: 1rem;">Aanvraag verstuurd!</p> <p style="margin-bottom: 0;">U ontvangt uw wachtwoord via het opgegeven e-mailadres.</p>`;
          },
          err => {
            this.loginErrorMsg = err.error
            console.log(err.error);
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
          document.querySelector('#modal-content-wrapper').innerHTML = `<p style="font-weight: 500; font-size: 1rem;">Aanvraag verstuurd!</p> <p style="margin-bottom: 0;">U ontvangt uw inloggevens via de mail ofzo, idk yet.</p>`;
          // setTimeout(() => this.closeModal(), 3000);

        },
        err => {
          console.log(err.error);
        }
      );
  }

  closeModal() {
    this.dialogRef.close();
  }
}
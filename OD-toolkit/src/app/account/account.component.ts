import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, throwMatDialogContentAlreadyAttachedError } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material';
import { authService } from '../_service/auth.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  user:any;
  delete: false;

  constructor(
    public dialogRef: MatDialogRef<AccountComponent>,
    private auth: authService,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  deleteUser() {
    this.auth.deleteUser();
    this.dialogRef.close();
    this.closeModal();
  }

  closeModal() {
    this.dialogRef.close();
  }

  ngOnInit() {
    this.auth.currentToolAuth.subscribe(user => {
      this.user = user;
      console.log(user);
      
    });
  }

}

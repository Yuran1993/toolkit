import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, throwMatDialogContentAlreadyAttachedError } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material';

import { authService } from '../_service/auth.service';
// import { MailService } from '../_service/mail.service';

@Component({
  selector: 'app-add-tool',
  templateUrl: './add-tool.component.html',
  styleUrls: ['./add-tool.component.scss']
})
export class AddToolComponent implements OnInit {
  noAuth = [];
  toolReq = {};
  reqSend = false;
  tool = JSON.parse(this.data).elClicked;

  constructor(
    public dialogRef: MatDialogRef<AddToolComponent>,
    private auth: authService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    // private mail: MailService,
  ) { }

  sendReq() {
    // TODO moet nog gebeuren

    setTimeout(() => {
      this.closeModal();
    }, 2000);
  }

  closeModal() {
    this.dialogRef.close();
  }

  async ngOnInit() {

  }
}
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, throwMatDialogContentAlreadyAttachedError } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material';

import { authService } from '../_service/auth.service';
import { ToolsService } from '../_service/tools.service';
import { MailService } from '../_service/mail.service';

@Component({
  selector: 'app-add-tool',
  templateUrl: './add-tool.component.html',
  styleUrls: ['./add-tool.component.scss']
})
export class AddToolComponent implements OnInit {
  noAuth = [];
  toolReq = {};
  reqSend = false;
  checked = JSON.parse(this.data).elClicked;

  constructor(public dialogRef: MatDialogRef<AddToolComponent>, private auth: authService, @Inject(MAT_DIALOG_DATA) public data: any, private toolsAuth: ToolsService, private mail: MailService,) { }

  sendReq() {
    this.reqSend = true;
    this.mail.addToolsReq(this.toolReq);

    setTimeout(() => {
      this.closeModal();
    }, 2000);
  }

  closeModal() {
    this.dialogRef.close();

  }

  async ngOnInit() {
    this.noAuth = [];
    const tools: any = await this.auth.getTools();

    this.toolsAuth.currentToolAuth.subscribe(async result => {

      tools.forEach(e => {
        const found = result.find(r => r.url === e.url && r.auth);

        if (!found) {
          this.noAuth.push(e);
        }
      });
    });

    setTimeout(() => {
      const temp = document.getElementById(this.checked);
      
      if (temp) {
        temp.click();
      }
    }, 200);
  }
}
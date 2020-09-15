import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, throwMatDialogContentAlreadyAttachedError } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material';

import { authService } from '../_service/auth.service';
import { GetUser } from '../_service/getUser.service';
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
  tool = JSON.parse(this.data).elClicked;

  constructor(
    public dialogRef: MatDialogRef<AddToolComponent>,
    private auth: authService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toolsAuth: GetUser,
    private mail: MailService,
  ) { }

  // sendReq() {
  //   this.reqSend = true;
  //   this.mail.addToolsReq(this.toolReq);

  //   setTimeout(() => {
  //     this.closeModal();
  //   }, 2000);
  // }

  closeModal() {
    this.dialogRef.close();
  }

  async ngOnInit() {

    this.mail.addToolsReq(this.tool);
    
    // const tools: any = await this.auth.getTools();
    // let user;

    // this.toolsAuth.currentToolAuth.subscribe(async result => {
    //   user = result
    // });

    // tools.forEach(e => {
    //   const found = user.tools.find(r => r.url === e.url && r.auth);

    //   if (!found) {
    //     this.noAuth.push(e);
    //   }
    // }); //TODO volledig bestand opschonen

    setTimeout(() => {
      document.getElementById('modal-content-wrapper').style.opacity = '1';
    }, 0);
  }
}
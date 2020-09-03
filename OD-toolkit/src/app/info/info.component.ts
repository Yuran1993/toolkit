import { Component, OnInit, OnDestroy } from '@angular/core';
import { authService } from '../_service/auth.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { InlogScreenComponent } from '../inlog-screen/inlog-screen.component';
import { ActivatedRoute, Router } from '@angular/router';
import { GetUser } from '../_service/getUser.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit, OnDestroy {
  component = 'info';
  allTools: any;
  tool: any;
  otherTools:any

  constructor(
    public auth: authService,
    private matDialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private user: GetUser,
  ) { }

  openLogReg(bol: boolean) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.id = "modal-logReg";
    dialogConfig.disableClose = false;
    dialogConfig.data = `{"login": ${bol}}`;
    dialogConfig.position = {
      top: '100px',
    }

    const modalDialog = this.matDialog.open(InlogScreenComponent, dialogConfig);
  }

  async ngOnInit() {
    window.scrollTo(0, 0);
    document.body.className = "backgroundColor";

    this.allTools = await this.auth.getToolsWAuth();

    let snapShot = this.route.snapshot.paramMap.get('tool');
    this.tool = this.allTools.find(e => e.url === snapShot);
    this.otherTools = this.allTools.filter(e => e.url !== snapShot);

    console.log(this.otherTools);

    this.router.events.subscribe((val) => {
      snapShot = this.route.snapshot.paramMap.get('tool');
      this.tool = this.allTools.find(e => e.url === snapShot);
      this.otherTools = this.allTools.filter(e => e.url !== snapShot);
    });

    if (!this.tool) {
      this.router.navigate(['']);
    }
  }

  ngOnDestroy() {
    document.body.className = "";
  }
}

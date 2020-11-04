import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { authService } from '../_service/auth.service';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { InlogScreenComponent } from '../inlog-screen/inlog-screen.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AddToolComponent } from '../add-tool/add-tool.component';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit, OnDestroy {
  component = 'info';
  allTools: any;
  tool: any;
  otherTools:any;
  windowWidth:number;
  dialogueTop:string;

  constructor(
    public auth: authService,
    private matDialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  @HostListener('window:resize', ['$event'])
  getWindowWidth(event?) {
    this.windowWidth = window.innerWidth;
  }

  openLogReg(show: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.id = "modal-logReg";
    dialogConfig.disableClose = false;
    dialogConfig.data = `{"show": "${show}"}`;
    dialogConfig.position = {
      top: this.dialogueTop,
    }

    const modalDialog = this.matDialog.open(InlogScreenComponent, dialogConfig);
  }

  openAdd(element) {
    console.log(element);
    
    const dialogConfig = new MatDialogConfig();
    dialogConfig.id = "modal-addTool";
    dialogConfig.disableClose = false;
    dialogConfig.data = `{"elClicked": "${element}"}`;
    dialogConfig.position = {
      top: this.dialogueTop,
    }

    const modalDialog = this.matDialog.open(AddToolComponent, dialogConfig);
  }

  async ngOnInit() {
    window.scrollTo(0, 0);
    document.body.className = "backgroundColor";

    this.getWindowWidth();
    this.dialogueTop = this.windowWidth <= 920 ? '50px' : '100px';

    this.auth.currentToolAuth.subscribe(result => {
      this.allTools = result.tools;
      this.allTools = this.allTools.sort((x, y) => (x.auth === y.auth) ? 0 : x.auth ? -1 : 1);
    });

    let snapShot = this.route.snapshot.paramMap.get('tool');
    this.tool = this.allTools.find(e => e.url === snapShot);

    if (!this.tool) {
      this.router.navigate(['']);
      return;
    }

    this.allTools.forEach(e => e.active = false);
    this.tool.active = true;
    

    this.router.events.subscribe((val) => {
      snapShot = this.route.snapshot.paramMap.get('tool');
      this.tool = this.allTools.find(e => e.url === snapShot);

      this.allTools.forEach(e => e.active = false);
      this.tool.active = true;
    });
  }

  ngOnDestroy() {
    document.body.className = "";
  }
}

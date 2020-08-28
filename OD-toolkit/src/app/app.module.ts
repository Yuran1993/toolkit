import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { AuthGuard } from './auth.guard';
import { authService } from './_service/auth.service';
import { TokenInterceptorService } from './_service/token-interceptor.service';

import { NavbarComponent } from './navbar/navbar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FooterComponent } from './footer/footer.component';
import { InlogScreenComponent } from './inlog-screen/inlog-screen.component';
import { TempToolComponent } from './temp-tool/temp-tool.component';
import { AutofocusDirective } from './_service/autofocus.directive';
import { InputDataControllerService } from './_service/input-data-controller.service';
import { AbTestCalcComponent } from './ab-test-calc/ab-test-calc.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AddToolComponent } from './add-tool/add-tool.component';
import { MailService } from './_service/mail.service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DashboardComponent,
    FooterComponent,
    InlogScreenComponent,
    TempToolComponent,
    AutofocusDirective,
    AbTestCalcComponent,
    AddToolComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatDialogModule,
    MatTooltipModule
  ],
  providers: [
    authService,
    AuthGuard,
    AutofocusDirective,
    InputDataControllerService,
    MailService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [InlogScreenComponent, AddToolComponent]
})
export class AppModule { }

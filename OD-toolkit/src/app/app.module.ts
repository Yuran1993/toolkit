import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { AuthGuard } from './_service/guards/auth.guard';
import { authService } from './_service/auth.service';
import { TokenInterceptorService } from './_service/token-interceptor.service';

import { NavbarComponent } from './navbar/navbar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FooterComponent } from './footer/footer.component';
import { InlogScreenComponent } from './inlog-screen/inlog-screen.component';
import { TempToolComponent } from './temp-tool/temp-tool.component';
import { AutofocusDirective } from './_service/directives/autofocus.directive';
import { InputDataControllerService } from './_service/input-data-controller.service';
import { AbTestCalcComponent } from './ab-test-calc/ab-test-calc.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AddToolComponent } from './add-tool/add-tool.component';
import { BayesCalcComponent } from './bayes-calc/bayes-calc.component';
import { InfoComponent } from './info/info.component';
import { ContactComponent } from './contact/contact.component';
import { StopPropagationDirective } from './_service/directives/stop-propagation.directive';
import { AccountComponent } from './account/account.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    DashboardComponent,
    FooterComponent,
    InlogScreenComponent,
    AddToolComponent,
    TempToolComponent,
    AutofocusDirective,
    AbTestCalcComponent,
    AddToolComponent,
    BayesCalcComponent,
    InfoComponent,
    ContactComponent,
    StopPropagationDirective,
    AccountComponent
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
    StopPropagationDirective,
    InputDataControllerService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [InlogScreenComponent, AddToolComponent, AccountComponent]
})
export class AppModule { }

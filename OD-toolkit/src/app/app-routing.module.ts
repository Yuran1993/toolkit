import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TempToolComponent } from './temp-tool/temp-tool.component';
import { AuthGuard } from './auth.guard';
import { AbTestCalcComponent } from './ab-test-calc/ab-test-calc.component';
import { BayesCalcComponent } from './bayes-calc/bayes-calc.component';
import { InfoComponent } from './info/info.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', component: DashboardComponent },
  { 
    path: '1',
    component: TempToolComponent,
    canActivate: [AuthGuard]
 },
  { 
    path: 'abtestcalculator',
    component: AbTestCalcComponent,
    canActivate: [AuthGuard]
 },
  { 
    path: 'bayesiaansecalculator',
    component: BayesCalcComponent,
    canActivate: [AuthGuard]
 },
  {
    path: '3',
    component: TempToolComponent,
    canActivate: [AuthGuard]
 },
  { 
    path: '4',
    component: TempToolComponent,
    canActivate: [AuthGuard]
 },
  { 
    path: '5',
    component: TempToolComponent,
    canActivate: [AuthGuard]
 },
  { 
    path: '6',
    component: TempToolComponent,
    canActivate: [AuthGuard]
 },
 { 
  path: ':tool/info',
  component: InfoComponent,
},
{ path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

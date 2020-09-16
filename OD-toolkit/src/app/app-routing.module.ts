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
    path: 'impact-analysis',
    component: TempToolComponent,
    canActivate: [AuthGuard]
 },
  { 
    path: 'abtest-calculator',
    component: AbTestCalcComponent,
    canActivate: [AuthGuard]
 },
  { 
    path: 'bayesiaanse-calculator',
    component: BayesCalcComponent,
    canActivate: [AuthGuard]
 },
  {
    path: 'experiment-analysis',
    component: TempToolComponent,
    canActivate: [AuthGuard]
 },
  { 
    path: 'quick-insights',
    component: TempToolComponent,
    canActivate: [AuthGuard]
 },
  { 
    path: 'quick-insights',
    component: TempToolComponent,
    canActivate: [AuthGuard]
 },
  { 
    path: 'funnel-analysis',
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

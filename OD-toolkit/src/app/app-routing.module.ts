import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';

import { AuthGuard } from './_service/guards/auth.guard';

import { InfoComponent } from './info/info.component';
import { AbTestCalcComponent } from './ab-test-calc/ab-test-calc.component';
import { BayesCalcComponent } from './bayes-calc/bayes-calc.component';
import { SampleSizeCalcComponent } from './sample-size-calc/sample-size-calc.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', component: DashboardComponent },
  { 
    path: 'sample-size-calculator',
    component: SampleSizeCalcComponent,
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

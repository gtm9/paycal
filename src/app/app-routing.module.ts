import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalculateRepayAmountComponent } from './calculate-repay-amount/calculate-repay-amount.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  {path : 'LRCalculator/calculateAmount', component : CalculateRepayAmountComponent},
  {path : 'LRCalculator', component : DashboardComponent},
  {path : '**', redirectTo : 'LRCalculator'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

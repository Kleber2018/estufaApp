import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlertConfigComponent } from './alert-config/alert-config.component';


const routes: Routes = [
  {
    path: '',
    component: AlertConfigComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlertConfigRoutingModule { }

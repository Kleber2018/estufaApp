import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ConfigModComponent} from "./config-mod/config-mod.component";


const routes: Routes = [
  {
    path: '',
    component: ConfigModComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigRoutingModule { }

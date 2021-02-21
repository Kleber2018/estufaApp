import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HelpComponent } from './help/help.component';
import { SobreComponent } from './sobre/sobre.component';
import { ConfigGeralComponent } from './config-geral/config-geral.component';

const routes: Routes = [
  { path: '', component: HelpComponent },
  { path: 'sobre', component: SobreComponent },
  { path: 'config', component: ConfigGeralComponent },
  { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeralRoutingModule { }

import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { FolderPage } from './folder/folder/folder.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'folder',
    pathMatch: 'full'
  },
  {
    path: 'folder', component: FolderPage
  },
 /* {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },*/
  {
    path: 'measurements/:id',
    loadChildren: () => import('./measurements/measurements.module').then( m => m.MeasurementsModule)
  },
  {
    path: 'alert-config/:id',
    loadChildren: () => import('./alert-config/alert-config.module').then( m => m.AlertConfigModule)
  },
  {
    path: 'config/:id',
    loadChildren: () => import('./config/config.module').then( m => m.ConfigModule)
  },
  {
    path: 'alertas/:id',
    loadChildren: () => import('./alert/alert.module').then( m => m.AlertModule)
  },
  {
    path: 'help',
    loadChildren: () => import('./help/help.module').then( m => m.HelpModule)
  },
  {
    path: 'sobre',
    loadChildren: () => import('./help/help.module').then( m => m.HelpModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

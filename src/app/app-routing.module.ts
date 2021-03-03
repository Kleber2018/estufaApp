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
    path: 'alertas/:id',
    loadChildren: () => import('./alert/alert.module').then( m => m.AlertModule)
  },
  {
    path: 'help',
    loadChildren: () => import('./geral/geral.module').then( m => m.GeralModule)
  },
  {
    path: 'sobre',
    loadChildren: () => import('./geral/geral.module').then( m => m.GeralModule)
  },
  {
    path: 'config',
    loadChildren: () => import('./geral/geral.module').then( m => m.GeralModule)
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

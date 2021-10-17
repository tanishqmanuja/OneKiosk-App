import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsPage } from './settings.page';

const routes: Routes = [
  {
    path: '',
    component: SettingsPage
  },
  {
    path: 'theming',
    loadChildren: () => import('./theming/theming.module').then( m => m.ThemingPageModule)
  },
  {
    path: 'apis',
    loadChildren: () => import('./apis/apis.module').then( m => m.ApisPageModule)
  },
  {
    path: 'webkiosk',
    loadChildren: () => import('./webkiosk/webkiosk.module').then( m => m.WebkioskPageModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./about/about.module').then( m => m.AboutPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsPageRoutingModule {}

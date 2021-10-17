import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ThemingPage } from './theming.page';

const routes: Routes = [
  {
    path: '',
    component: ThemingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThemingPageRoutingModule {}

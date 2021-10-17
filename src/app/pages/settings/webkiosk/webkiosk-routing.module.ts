import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WebkioskPage } from './webkiosk.page';

const routes: Routes = [
  {
    path: '',
    component: WebkioskPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WebkioskPageRoutingModule {}

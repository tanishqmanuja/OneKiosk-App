import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WebkioskPageRoutingModule } from './webkiosk-routing.module';

import { WebkioskPage } from './webkiosk.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WebkioskPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [WebkioskPage],
})
export class WebkioskPageModule {}

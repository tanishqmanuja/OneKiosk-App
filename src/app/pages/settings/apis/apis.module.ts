import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ApisPageRoutingModule } from './apis-routing.module';

import { ApisPage } from './apis.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ApisPageRoutingModule,
  ],
  declarations: [ApisPage],
})
export class ApisPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FeesPageRoutingModule } from './fees-routing.module';

import { FeesPage } from './fees.page';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { HeaderColorDirectiveModule } from 'src/app/directives/header-color/header-color-directive.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FeesPageRoutingModule,
    SharedComponentsModule,
    HeaderColorDirectiveModule,
  ],
  declarations: [FeesPage],
})
export class FeesPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AttendanceDetailsPageRoutingModule } from './attendance-details-routing.module';

import { AttendanceDetailsPage } from './attendance-details.page';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AttendanceDetailsPageRoutingModule,
    SharedComponentsModule,
  ],
  declarations: [AttendanceDetailsPage],
})
export class AttendanceDetailsPageModule {}

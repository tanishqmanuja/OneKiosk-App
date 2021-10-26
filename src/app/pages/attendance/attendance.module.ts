import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AttendancePageRoutingModule } from './attendance-routing.module';

import { AttendancePage } from './attendance.page';
import { AttendanceCardComponent } from 'src/app/components/attendance-card/attendance-card.component';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { HeaderColorDirectiveModule } from 'src/app/directives/header-color/header-color-directive.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AttendancePageRoutingModule,
    SharedComponentsModule,
    HeaderColorDirectiveModule,
  ],
  declarations: [AttendancePage, AttendanceCardComponent],
})
export class AttendancePageModule {}

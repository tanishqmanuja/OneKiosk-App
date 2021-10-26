import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportPageRoutingModule } from './report-routing.module';

import { ReportPage } from './report.page';
import { ReportCardComponent } from 'src/app/components/report-card/report-card.component';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { HeaderColorDirectiveModule } from 'src/app/directives/header-color/header-color-directive.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportPageRoutingModule,
    SharedComponentsModule,
    HeaderColorDirectiveModule,
  ],
  declarations: [ReportPage, ReportCardComponent],
})
export class ReportPageModule {}

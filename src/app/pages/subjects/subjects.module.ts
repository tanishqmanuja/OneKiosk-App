import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubjectsPageRoutingModule } from './subjects-routing.module';

import { SubjectsPage } from './subjects.page';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubjectsPageRoutingModule,
    SharedComponentsModule,
  ],
  declarations: [SubjectsPage],
})
export class SubjectsPageModule {}

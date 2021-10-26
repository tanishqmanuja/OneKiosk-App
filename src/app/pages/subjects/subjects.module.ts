import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubjectsPageRoutingModule } from './subjects-routing.module';

import { SubjectsPage } from './subjects.page';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { HeaderColorDirectiveModule } from 'src/app/directives/header-color/header-color-directive.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubjectsPageRoutingModule,
    SharedComponentsModule,
    HeaderColorDirectiveModule,
  ],
  declarations: [SubjectsPage],
})
export class SubjectsPageModule {}

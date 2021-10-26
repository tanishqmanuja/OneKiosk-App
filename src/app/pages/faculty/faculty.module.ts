import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FacultyPageRoutingModule } from './faculty-routing.module';

import { FacultyPage } from './faculty.page';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { HeaderColorDirectiveModule } from 'src/app/directives/header-color/header-color-directive.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FacultyPageRoutingModule,
    LazyLoadImageModule,
    HeaderColorDirectiveModule,
  ],
  declarations: [FacultyPage],
})
export class FacultyPageModule {}

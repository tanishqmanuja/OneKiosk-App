import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TimetablePageRoutingModule } from './timetable-routing.module';

import { TimetablePage } from './timetable.page';
import { MenuComponent } from './menu/menu.component';
import { EditComponent } from './edit/edit.component';
import { ImportComponent } from './import/import.component';
import { TimetableCardComponent } from 'src/app/components/timetable-card/timetable-card.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TimetablePageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [
    TimetablePage,
    TimetableCardComponent,
    MenuComponent,
    EditComponent,
    ImportComponent,
  ],
})
export class TimetablePageModule {}

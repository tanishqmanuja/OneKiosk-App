import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SemSelectBarComponent } from './sem-select-bar/sem-select-bar.component';
import { IonicModule } from '@ionic/angular';
import { NoDataCardComponent } from './no-data-card/no-data-card.component';
import { SelectionPillComponent } from './selection-pill/selection-pill.component';

@NgModule({
  declarations: [
    SemSelectBarComponent,
    NoDataCardComponent,
    SelectionPillComponent,
  ],
  exports: [SemSelectBarComponent, NoDataCardComponent, SelectionPillComponent],
  imports: [CommonModule, IonicModule],
})
export class SharedComponentsModule {}

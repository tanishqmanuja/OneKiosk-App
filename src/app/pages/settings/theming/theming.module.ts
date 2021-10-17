import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ThemingPageRoutingModule } from './theming-routing.module';

import { ThemingPage } from './theming.page';
import { ColorBoxComponent } from './color-box/color-box.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ThemingPageRoutingModule],
  declarations: [ThemingPage, ColorBoxComponent],
})
export class ThemingPageModule {}

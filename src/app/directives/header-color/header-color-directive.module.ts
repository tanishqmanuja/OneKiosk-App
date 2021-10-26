import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderColorDirective } from './header-color.directive';

@NgModule({
  declarations: [HeaderColorDirective],
  exports: [HeaderColorDirective],
  imports: [CommonModule],
})
export class HeaderColorDirectiveModule {}

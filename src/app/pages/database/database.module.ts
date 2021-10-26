import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatabasePageRoutingModule } from './database-routing.module';

import { DatabasePage } from './database.page';
import { SharedComponentsModule } from 'src/app/components/shared-components.module';
import { SharedDirectivesModule } from 'src/app/directives/shared-directives.module';
import { HeaderColorDirectiveModule } from 'src/app/directives/header-color/header-color-directive.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatabasePageRoutingModule,
    SharedComponentsModule,
    SharedDirectivesModule,
    HeaderColorDirectiveModule,
  ],
  declarations: [DatabasePage],
})
export class DatabasePageModule {}

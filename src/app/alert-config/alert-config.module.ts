import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertConfigRoutingModule } from './alert-config-routing.module';
import { AlertConfigComponent } from './alert-config/alert-config.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [AlertConfigComponent],
  imports: [
    CommonModule,
    AlertConfigRoutingModule,
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule
  ]
})
export class AlertConfigModule { }

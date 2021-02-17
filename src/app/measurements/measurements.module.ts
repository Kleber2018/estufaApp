import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MeasurementsRoutingModule } from './measurements-routing.module';
import { MeasurementsComponent } from './measurements/measurements.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [MeasurementsComponent],
  imports: [
    CommonModule,
    MeasurementsRoutingModule,
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule
  ]
})
export class MeasurementsModule { }

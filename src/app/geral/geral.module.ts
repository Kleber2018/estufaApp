import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeralRoutingModule } from './geral-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    GeralRoutingModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule
  ]
})
export class GeralModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeralRoutingModule } from './geral-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TermosComponent } from './termos/termos.component';
import { PoliticsComponent } from './politics/politics.component';


@NgModule({
  declarations: [TermosComponent, PoliticsComponent],
  imports: [
    CommonModule,
    GeralRoutingModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule
  ]
})
export class GeralModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigRoutingModule } from './config-routing.module';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {ConfigModComponent} from "./config-mod/config-mod.component";
import { ModalScanPage } from './modal-scan/modal-scan.page';


@NgModule({
  declarations: [
    ConfigModComponent,     
    ModalScanPage
  ],
  imports: [
    CommonModule,
    ConfigRoutingModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule
  ],
})
export class ConfigModule { }

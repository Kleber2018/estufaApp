import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ConfigRoutingModule } from './config-routing.module';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {Ng2GoogleChartsModule} from "ng2-google-charts";
import {ConfigComponent} from "./config/config.component";
import {FolderPage} from "../folder/folder/folder.page";


@NgModule({
  declarations: [ConfigComponent],
  imports: [
    CommonModule,
    ConfigRoutingModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
  ],
})
export class ConfigModule { }

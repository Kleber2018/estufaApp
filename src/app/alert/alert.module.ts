import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertRoutingModule } from './alert-routing.module';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {FolderPageRoutingModule} from "../folder/folder-routing.module";
import {Ng2GoogleChartsModule} from "ng2-google-charts";
import {AlertComponent} from "./alert/alert.component";
import {FolderPage} from "../folder/folder/folder.page";


@NgModule({
  declarations: [AlertComponent],
  imports: [
    CommonModule,
    AlertRoutingModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
  ],
})
export class AlertModule { }

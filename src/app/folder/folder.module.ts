import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FolderPageRoutingModule } from './folder-routing.module';

import { FolderPage } from './folder/folder.page';
import {Ng2GoogleChartsModule} from "ng2-google-charts";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        FolderPageRoutingModule,
        Ng2GoogleChartsModule
    ],
  declarations: [FolderPage]
})
export class FolderPageModule {}

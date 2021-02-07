import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {HttpClientModule} from "@angular/common/http";
import {Ng2GoogleChartsModule} from "ng2-google-charts";
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
//import { Push } from '@ionic-native/push/ngx';
import { NetworkInterface } from '@ionic-native/network-interface/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { PDFGenerator } from '@ionic-native/pdf-generator/ngx';
import { FolderPage } from './folder/folder/folder.page';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [AppComponent, FolderPage],
  entryComponents: [],
  imports: [
    CommonModule,
    FormsModule,
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    Ng2GoogleChartsModule
  ],
  providers: [
    StatusBar,
    NativeAudio,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Vibration,
    BackgroundMode,
    NetworkInterface,
    LocalNotifications,
    PDFGenerator
    //Push
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

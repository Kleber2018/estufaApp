import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

import { StatusBar } from '@ionic-native/status-bar/ngx';

import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
  public selectedIndex = 0;
  public appPages = [
    {
      title: 'Home',
      url: '/folder/Home',
      icon: 'paper-plane'
    },
    {
      title: 'Alertas',
      url: '/folder/Alertas',
      icon: 'archive'
    },
    // {
    //   title: 'Favorites',
    //   url: '/folder/Favorites',
    //   icon: 'heart'
    // },
    // {
    //   title: 'Archived',
    //   url: '/folder/Archived',
    //   icon: 'archive'
    // },
    // {
    //   title: 'Trash',
    //   url: '/folder/Trash',
    //   icon: 'trash'
    // },
     {
       title: 'Configurações',
       url: '/config',
       icon: 'warning'
     }
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private nativeAudio: NativeAudio,
    private vibration: Vibration
  ) {
      // let status bar overlay webview
      this.statusBar.overlaysWebView(false);

      setTimeout(() => {
        this.vibration.vibrate([2000,2000,2000]);
      },
      1500);
     

      // set status bar to white
      //this.statusBar.backgroundColorByHexString('#339933');

       // The Native Audio plugin can only be called once the platform is ready
       this.platform.ready().then(() => { 
        console.log("platform ready");
        alert('platform')      
        this.nativeAudio.preloadSimple('uniqueId1', 'assets/intro.mp3')
        this.nativeAudio.preloadComplex('uniqueId2', 'assets/intro.mp3', 1, 1, 0)

      //  this.nativeAudio.play('uniqueId1')

        /*
        // This is used to unload the track. It's useful if you're experimenting with track locations
        this.nativeAudio.unload('trackID').then(function() {
            console.log("unloaded audio!");
            alert('loaded')
        }, function(err) {
            console.log("couldn't unload audio... " + err);
            alert("couldn't unload audio..." + err)
        });

        // 'trackID' can be anything
        this.nativeAudio.preloadComplex('trackID', 'assets/intro.mp3', 1, 1, 0).then(function() {
            console.log("audio loaded!");
            alert('loaded')
        }, function(err) {
            console.log("audio failed: " + err);
            alert("audio2 failed: " + err)
        });
        */
        
      });

    this.initializeApp();
  }

  

  ngOnInit() {    
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
  }

  executarNative(){
    alert('executado')
   // this.vibration.vibrate([2000,2000,2000]);
   
    // can optionally pass a callback to be called when the file is done playing

    this.nativeAudio.loop('uniqueId2')
    //this.nativeAudio.play('uniqueId1', () => console.log('uniqueId1 is done playing'));
    this.vibration.vibrate([2000,2000,2000]);
    
  }

  pararNative(){

    this.nativeAudio.stop('uniqueId2')
   // this.nativeAudio.unload('uniqueId1')
  
    
  }

  initializeApp() {
    /*
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    */


  }

  playAudio() {
    console.log("playing audio");

    this.nativeAudio.play('trackID').then(function() {
        console.log("playing audio!");
        alert('play')
    }, function(err) {
        console.log("error playing audio: " + err);
    });
}
}

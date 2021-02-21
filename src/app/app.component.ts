import { Component, OnInit } from '@angular/core';

import { Platform,  } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

import { StatusBar } from '@ionic-native/status-bar/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';

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
      url: '/folder',
      icon: 'home'
    },
    {
      title: 'Configurações Gerais',
      url: '/folder',
      icon: 'warning'
    },
    {
      title: 'Ajuda',
      url: '/help/help',
      icon: 'help-circle'
    },
    {
      title: 'Sobre',
      url: '/help/sobre',
      icon: 'alert-circle'
    },
 /*   {
      title: 'Medições',
      url: '/measurements/1',
      icon: 'list'
    },*/
  /*  {
      title: 'Alertas',
      url: '/alertas',
      icon: 'list'
    },*/
  /*  {
      title: 'Configurar Alertas',
      url: '/alert-config/1',
      icon: 'warning'
    },*/
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
     
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private backgroundMode: BackgroundMode
  ) {
      // let status bar overlay webview
      this.statusBar.overlaysWebView(false);

      // set status bar to white
      //this.statusBar.backgroundColorByHexString('#339933');
    this.backgroundMode.enable();
    this.initializeApp();
  }

  ngOnInit() {    
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
    }
  }

  initializeApp() {
    /*
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    */
  }

  sair(){
    this.backgroundMode.disable();
    localStorage.removeItem('alertaconfig')

    this.platform.backButton.subscribeWithPriority(10, () => {
      console.log('Handler was called!');
    });
    navigator['app'].exitApp();
  }
}

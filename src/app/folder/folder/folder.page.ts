import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {FolderService} from "../folder.service";
import { GoogleChartInterface } from 'ng2-google-charts';
import {FormControl} from "@angular/forms";

import { Animation, AnimationController } from '@ionic/angular';

import { LoadingController } from '@ionic/angular';

import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { Platform } from '@ionic/angular';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;
  public medicoes: any = [];
  public alertas: any = [];


  public pieChart: GoogleChartInterface;
  /*= {
    chartType: 'LineChart',
    dataTable: [
      ['Task', 'Hours per Day', 'teste'],
      ['Work',     11, 10]
    ],
    //firstRowIsData: true,
    options: {
      'title': 'Tasks',
      curveType: 'function'},
  };*/
  customPickerOptions: any;

  public dataInic = (new Date().getFullYear())+'-'+(new Date().getMonth())+'-'+(new Date().getDate()-2)
  public formDataInic = new FormControl(this.dataInic,[]);

  public dataFinal = (new Date().getFullYear())+'-'+(new Date().getMonth()+1)+'-'+(new Date().getDate())
  public formDataFinal = new FormControl(this.dataFinal,[]);

  public scanDispositivo = false
  @ViewChild('alertaPiscando', { read: ElementRef }) alertaPiscando: ElementRef;

  constructor(private activatedRoute: ActivatedRoute,
                    private folderService: FolderService,
                    private animationCtrl: AnimationController,
                    public loadingController: LoadingController,
                    private nativeAudio: NativeAudio,
                    private vibration: Vibration,
                    private platform: Platform,
                    private backgroundMode: BackgroundMode) {

    this.customPickerOptions = {
      buttons: [{
        text: 'Buscar',
        handler: () => console.log('Clicked Save!')
      }, {
        text: 'Log',
        handler: () => {
          console.log('Clicked Log. Do not Dismiss.');
          return false;
        }
      }]
    }

    this.folder = this.activatedRoute.snapshot.paramMap.get('id');

    //range de dias
    var intervaloDias = localStorage.getItem('intervaloDias')
        ? JSON.parse(localStorage.getItem('intervaloDias'))
        : null;

    if (!intervaloDias) {
      intervaloDias = 6
    }
    var d = new Date();
    d.setDate(d.getDate() - intervaloDias);
    this.dataInic = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
    this.formDataInic = new FormControl(this.dataInic, []);

     // set status bar to white
      //this.statusBar.backgroundColorByHexString('#339933');

       // The Native Audio plugin can only be called once the platform is ready
       this.platform.ready().then(() => { 
        console.log("platform ready");
        //alert('platform')      
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


    this.inicializando()

  }

  ngOnInit() {
  }

  async inicializando() {
    const apiURL = localStorage.getItem('ipraspberry')

    console.log('api', apiURL)
    if (!apiURL) {
      this.scanDispositivo = true
      this.presentLoading()
      const r = await this.folderService.scanDispositivo()
      console.log(r)
      if(r == 1){
        this.scanDispositivo = false
        this.inicializando()
      }
    } else {
      this.buscarMedicoes(this.dataInic, this.dataFinal)
      this.buscarAlertas()

      //loop para requisitar informações a cada 50000 (50 segundos)
      setInterval(function () {
            this.buscarMedicoes(this.dataInic, this.dataFinal)
            this.buscarAlertas()
          }.bind(this),
          50000);

      //para atrasar a inicialização da animação
      setTimeout(() => {
            this.startLoad()
          },
          1500);
    }

  }


  startLoad() {
    console.log('animação')
    //animação
    const alertaAnimation: Animation = this.animationCtrl.create('alerta-animation')
        .addElement(this.alertaPiscando.nativeElement)
        .iterations(Infinity)
        .duration(2700)
        //.fromTo('opacity', '1', '0.5');
        .keyframes([
          { offset: 0, background: 'orange' },
          { offset: 0.72, background: 'red' },
          { offset: 1, background: 'var(--background)' }
        ]);

    alertaAnimation.play()
  }

  selecionadoData(){
    this.buscarMedicoes(this.formDataInic.value, this.formDataFinal.value)
  }

  ocultarMedicao(){
    this.folderService.ocultarMedicao(11)
  }

  async buscarMedicoes(dataI, dataF) {
    this.medicoes = await this.folderService.getMedicoes(dataI, dataF).then(medicoesRetorno => {
      return medicoesRetorno
    }).catch(error => {
      console.log('Retornou Erro de Medições:', error);
    })
    var dadosGrafico = [['Data', 'Umidade', 'Temperatura']]
    console.log(this.medicoes)

    this.medicoes.sort((a, b) => {
      return +a.id - +b.id;
    });

    this.medicoes.forEach(medicao => {
      dadosGrafico.push([new Date(medicao.Data).getHours() + ":"+ new Date(medicao.Data).getMinutes(), medicao.Umidade, medicao.Temperatura])
//      console.log(new Date(medicao.Data).getHours() + ":"+ new Date(medicao.Data).getMinutes())
    })

    this.pieChart = {
      chartType: 'LineChart',
      dataTable: dadosGrafico,
      //firstRowIsData: true,
      options: {
     //   'title': 'Tasks',
        curveType: 'function'},
    };

    this.pieChart.dataTable = dadosGrafico
  }


  async buscarAlertas(){
    this.backgroundMode.enable();


    
    this.alertas = await this.folderService.getAlertas().then(alertasRetorno => {
      return alertasRetorno
    }).catch(error => {
      console.log('Retornou Erro de Alertas:', error);
    })
    console.log(this.alertas)
  }


  silenciarAlertas(){
    this.folderService.silenciarAlertas().then(r => {
      console.log(r)
    }).catch(error => {
      console.log('Retornou Erro de silenciar alertas:', error);
    })
    this.buscarAlertas()
  }

  async presentLoading() {
    while (this.scanDispositivo){
      const loading = await this.loadingController.create({
        cssClass: 'my-custom-class',
        message: 'Procurando dispositivo na rede...',
        duration: 10000
      });
      await loading.present();

      const { role, data } = await loading.onDidDismiss();
      console.log('Loading dismissed!');
    }
  }


  executarNative(){
    alert('executado')
   // this.vibration.vibrate([2000,2000,2000]);
   
    // can optionally pass a callback to be called when the file is done playing

    this.nativeAudio.loop('uniqueId2')
    //this.nativeAudio.play('uniqueId1', () => console.log('uniqueId1 is done playing'));
    this.vibration.vibrate([2000,2000,2000]);
/*
    this.nativeAudio.play('trackID').then(function() {
      console.log("playing audio!");
      alert('play')
    }, function(err) {
        console.log("error playing audio: " + err);
    });
*/
  }

  pararNative(){
    this.nativeAudio.stop('uniqueId2')
   // this.nativeAudio.unload('uniqueId1')

  }

}

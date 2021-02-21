import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FolderService} from "../folder.service";
import { GoogleChartInterface } from 'ng2-google-charts';
import {FormControl, Validators} from "@angular/forms";

import { Animation, AnimationController, AlertController } from '@ionic/angular';

import { LoadingController } from '@ionic/angular';

import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { Platform } from '@ionic/angular';

import {ConfigService} from "../../config/config.service";

import { LocalNotifications } from '@ionic-native/local-notifications/ngx';




import { Chart } from 'chart.js';
import { PDFGenerator } from '@ionic-native/pdf-generator/ngx';
import { AlertConfigService } from 'src/app/alert-config/alert-config.service';
import { Config } from 'src/app/shared/model/config.model';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {

  public admin: boolean = false;
  public alertaAtivado = false;
  public configLocal: Config = {
    guarda: '',
    vibrar: '',
    toque: '',
    modulos: [{
      identificacao: '', //Estufa Amarela
      guarda: '', // 1 / 0
      usuario: '', // para login
      token: '', // retornado pelo raspberry
      created: '',// data da criação
      ip: '', // 192.168.1.105:5000
      alertaParams:{
        id_config: '',
        intervalo_seconds: 0,
        obs: '',
        temp_max: 0,
        temp_min: 0,
        umid_max: 0,
        umid_min: 0,
        updated: ''
      }
    }]

  }

  public folder: string;

  public config: any;

  public medicao = {
    temp: 0,
    temp_status: '',//baixo, alto
    umid: 0,
    umid_status: '' //baixo, alto
  }


 // public pieChart: GoogleChartInterface;
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


 // @ViewChild('alertaPiscando', { read: ElementRef }) alertaPiscando: ElementRef;
  @ViewChild('umidAnimation', { read: ElementRef }) umidAnimation: ElementRef;
  @ViewChild('tempAnimation', { read: ElementRef }) tempAnimation: ElementRef;

  constructor(private activatedRoute: ActivatedRoute,
                    private folderService: FolderService,
                    private animationCtrl: AnimationController,
                    private nativeAudio: NativeAudio,
                    private vibration: Vibration,
                    private platform: Platform,
                    public alertController: AlertController,
                    private router: Router,
                    private alertConfigService: AlertConfigService,
                    private localNotifications: LocalNotifications,
                    private pdfGenerator: PDFGenerator
                    ) {
                      this.admin = false

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
      intervaloDias = 60
    }
    var d = new Date();
    d.setDate(d.getDate() - intervaloDias);
    this.dataInic = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
    this.formDataInic = new FormControl(this.dataInic, []);
     // set status bar to white
      //this.statusBar.backgroundColorByHexString('#339933');

       // The Native Audio plugin can only be called once the platform is ready
    this.localNotifications.requestPermission()
    this.platform.ready().then(() => { 
      var isAcceptedObservable = this.localNotifications.on('silenciar').subscribe(res =>{
        this.pararNative();
        console.log('Silenciando através do push');  
      });
    //alert('platform')      
    this.nativeAudio.preloadSimple('uniqueId1', 'assets/audio4.mp3')
    this.nativeAudio.preloadComplex('uniqueId2', 'assets/audio4.mp3', 1, 1, 0)

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

  abrirConfigEstufa(id){
    this.router.navigate([`/config/${id}`]);
  }

  abrirMedicoesEstufa(id){
    this.router.navigate([`/measurements/${id}`]);
  }

  abrirAlertasEstufa(id){
    this.router.navigate([`/alertas/${id}`]);
  }

  ativarAlerta(id){
    this.alertaAtivado = true
    localStorage.setItem('alertaconfig', 'ativado')
  }

  desativarAlerta(id){
    this.alertaAtivado = false
    localStorage.setItem('alertaconfig', 'desativado')
  }

  //para fazer um refresh
  doRefresh(event) {
    const apiURL = localStorage.getItem('ipraspberry')
    if (apiURL) {
      this.buscaConfig()
      this.buscarMedicao()
    }
    setTimeout(() => {
      event.target.complete();
    }, 400);
  }

  async inicializando() {

    const apiURL = localStorage.getItem('ipraspberry')
    if (apiURL) {
      this.buscaConfig()
      this.buscarMedicao()
      //loop para requisitar informações a cada 60000 (60 segundos)
      setInterval(function () {
            this.buscaConfig()
            this.buscarMedicao()
            // para que o array de medição não seja atualizado com tanta frequencia
          }.bind(this),
          70000);
      //para atrasar a inicialização da animação
      setTimeout(() => {
            this.startAnimaTempUmid()
          },
          1500);
    }
  }

  startAnimaTempUmid(){
    //animação
    if(this.medicao.temp_status == 'alto'){
      const temperaturaAnimation: Animation = this.animationCtrl.create('temp-animation')
          .addElement(this.tempAnimation.nativeElement)
          .iterations(Infinity)
          .duration(2700)
          //.fromTo('opacity', '1', '0.5');
          .keyframes([
            { offset: 0, background: 'orange' },
            { offset: 0.72, background: 'red' },
            { offset: 1, background: 'var(--background)' }
          ]);
      temperaturaAnimation.play()
    } else if (this.medicao.temp_status == 'baixo'){
      const temperaturaAnimation: Animation = this.animationCtrl.create('temp-animation')
          .addElement(this.tempAnimation.nativeElement)
          .iterations(Infinity)
          .duration(2700)
          //.fromTo('opacity', '1', '0.5');
          .keyframes([
            { offset: 0, background: 'blue' },
            { offset: 0.72, background: 'purple' },
            { offset: 1, background: 'var(--background)' }
          ]);
      temperaturaAnimation.play()
    }

    if(this.medicao.umid_status == 'alto'){
      const umidadeAnimation: Animation = this.animationCtrl.create('umid-animation')
          .addElement(this.umidAnimation.nativeElement)
          .iterations(Infinity)
          .duration(2700)
          //.fromTo('opacity', '1', '0.5');
          .keyframes([
            { offset: 0, background: 'orange' },
            { offset: 0.72, background: 'red' },
            { offset: 1, background: 'var(--background)' }
          ]);
      umidadeAnimation.play()
    } else if(this.medicao.umid_status == 'baixo'){
      const umidadeAnimation: Animation = this.animationCtrl.create('umid-animation')
          .addElement(this.umidAnimation.nativeElement)
          .iterations(Infinity)
          .duration(2700)
          //.fromTo('opacity', '1', '0.5');
          .keyframes([
            { offset: 0, background: 'blue' },
            { offset: 0.72, background: 'purple' },
            { offset: 1, background: 'var(--background)' }
          ]);
      umidadeAnimation.play()
    }
  }

/*
  startLoad() {
    //animação do alerta
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
*/
  
  public teste = 'testando'

  gerarPDF(){
    let options = {
      documentSize: 'A4',
      type: 'share',
      fileName: 'myFile.pdf'
    }

    var pdfhtml = '<html><body style="font-size:120%"><canvas #lineCanvas style="width:97vw; height: 280px; "></canvas><p>teste</p></body></html>';

    this.pdfGenerator.fromData( pdfhtml, options)
    .then((stats)=> console.log('status', stats) )   // ok..., ok if it was able to handle the file to the OS.  
    .catch((err)=>console.log(err))


  }

  buscarMedicao() {
    this.folderService.getMedicao().then(med => {
      this.buildViewMedicao(med[0])
    }).catch(error => {
      console.log('Retornou Erro de Mediçao:', error);
    })
  }




  buildViewMedicao(med: any){
    if(this.config){
      this.medicao.temp = med.Temperatura
      this.medicao.umid = med.Umidade

      if(med.Temperatura > this.config.temp_max){
        this.medicao.temp_status = "alto"
        this.executarNative('Temperatura alta')
      } else if(med.Temperatura < this.config.temp_min ){
        this.medicao.temp_status = "baixo"
        if(med.Temperatura > 0){
          this.executarNative('Temperatura baixa')
        }
      } else {
        this.medicao.temp_status = ""
      }

      if(med.Umidade > this.config.umid_max){
        this.medicao.umid_status = "alto"
        this.executarNative('Umidade alta')
      } else if(med.Umidade < this.config.umid_min ){
        this.medicao.umid_status = "baixo"
        if(med.Umidade > 0){
          this.executarNative('Umidade baixa')
        }
      } else {
        this.medicao.umid_status = ""
      }
    }
  }


  buscaConfig(){
    this.config = JSON.parse(localStorage.getItem('configraspberry'))
    if(!this.config){
      this.alertConfigService.getConfig().then(configRetorno => {
        if(configRetorno){
          if(Array.isArray(configRetorno)){
            this.config = configRetorno[0];
          } else {
            this.config = configRetorno;
          }
          localStorage.setItem('configraspberry', JSON.stringify(this.config))
        }
      }).catch(error => {
            if (error.error){
              console.log('Retornou Erro:',error.error);
            } else {
              console.log('Retornou Erro:',error);
            }
          }
      )
    }
  }


  habilitaDelete(status: boolean){
    this.admin = status
  }

  testarAlerta(){
    //teste quando o app está em background ou não
    this.platform.ready().then(() => {
      this.platform.pause.subscribe(() => {        
          console.log('****UserdashboardPage PAUSED****');
      });  
      this.platform.resume.subscribe(() => {      
          console.log('****UserdashboardPage RESUMED****');
      });
     });
    setTimeout(async () => {
      //alert('Aguarde 9 segundos..... Verifique se os alertas estão ativos no Menu Configurar. ')
    
            // Schedule a single notification
      //this.localNotifications.requestPermission()
      
/*
      this.localNotifications.schedule({
        id: 1,
        title: 'Alerta de Temperatura',
        text: 'TESTANDO',
        foreground: true,
        smallIcon: 'res://ic_launcher',
        icon: 'res://ic_launcher',
        actions: [
          { id: '2', title: 'SILENCIAR' },
          { id: '3', title: 'ABRIR' }
        ]
      });
      */
      this.executarNative('Testando')
    },
    
    6000);
  }


  async executarNative(descricao: string){
    
    const alertaConfig = localStorage.getItem('alertaconfig') // se existir é pq o alerta está ativado
    if (alertaConfig) {
      if(alertaConfig == 'ativado'){
        this.localNotifications.schedule({
          id: 15,
          title: 'Alerta da Estufa',
          text: descricao,
          foreground: true,
          smallIcon: 'res://ic_launcher',
          icon: 'res://ic_launcher',//'http://estufa.com/assets/icon/favicon.png',
          actions: [
            { id: 'silenciar', title: 'SILENCIAR' }
          ]
        });
        this.vibration.vibrate([2000,2000,2000,2000,2000,2000,2000,2000,2000]);
        this.nativeAudio.loop('uniqueId2');

        const alert = await this.alertController.create({
          cssClass: 'my-custom-class',
          header: 'Alerta',
          message: descricao,
          buttons: [
             {
              text: 'SILENCIAR',
              handler: () => {
                console.log('Confirm Okay');
                this.pararNative()
              }
            }
          ]
        });
        await alert.present();
      }
    }



    //this.nativeAudio.play('uniqueId1', () => console.log('uniqueId1 is done playing'));
    //this.vibration.vibrate([2000,2000,2000]);
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
    this.vibration.vibrate(0);
   // this.nativeAudio.unload('uniqueId1')
  }

}

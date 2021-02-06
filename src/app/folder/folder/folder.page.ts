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
//import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import {ConfigService} from "../../config/config.service";
//import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';



import { Chart } from 'chart.js';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {

  lineChart: any;


  public folder: string;
  public medicoes: any = [];
  public alertas: any = [];

  public config: any;

  public medicao = {
    temp: 0,
    temp_status: '',//baixo, alto
    umid: 0,
    umid_status: '' //baixo, alto
  }
w

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


  @ViewChild('alertaPiscando', { read: ElementRef }) alertaPiscando: ElementRef;
  @ViewChild('umidAnimation', { read: ElementRef }) umidAnimation: ElementRef;
  @ViewChild('tempAnimation', { read: ElementRef }) tempAnimation: ElementRef;

  constructor(private activatedRoute: ActivatedRoute,
                    private folderService: FolderService,
                    private animationCtrl: AnimationController,
                    private nativeAudio: NativeAudio,
                    private vibration: Vibration,
                    private platform: Platform,
                    //private backgroundMode: BackgroundMode,
                    public alertController: AlertController,
                    private router: Router,
                    private configService: ConfigService,
                    ) {

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

  async inicializando() {
    const apiURL = localStorage.getItem('ipraspberry')
    if (!apiURL) {
      this.router.navigate(['/config']);
    } else {
      this.buscarMedicoes(this.dataInic, this.dataFinal)
      this.buscarAlertas()
      this.buscarMedicao()
      //loop para requisitar informações a cada 60000 (60 segundos)
      var vr = 0
      setInterval(function () {
            this.buscarMedicao()
            this.buscarAlertas()

            // para que o array de medição não seja atualizado com tanta frequencia
            if(vr === 0){
              this.buscarMedicoes(this.dataInic, this.dataFinal)
            } else if (vr === 5){
              vr = 0
            }
            vr++
          }.bind(this),
          60000);

      //para atrasar a inicialização da animação
      setTimeout(() => {
            this.startLoad()
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


  startLoad() {
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

  buscarMedicao() {
    this.folderService.getMedicao().then(med => {
      console.log('medicao', med)
      this.buildViewMedicao(med[0])
    }).catch(error => {
      console.log('Retornou Erro de Mediçao:', error);
    })
  }

  async buscarMedicoes(dataI, dataF) {
    this.medicoes = await this.folderService.getMedicoes(dataI, dataF, '0,0,0,0').then(medicoesRetorno => {
      return medicoesRetorno
    }).catch(error => {
      console.log('Retornou Erro de Medições:', error);
    })
    var dadosGrafico = [['Data', 'Umidade', 'Temperatura']]
    console.log(this.medicoes)

    if (this.medicoes){
      this.buscaConfig()
      this.medicoes.sort((a, b) => {
        return +a.id - +b.id;
      });

      var temperaturas = []
      var umidades = []
      var datas = []

      this.medicoes.forEach(medicao => {
        dadosGrafico.push([new Date(medicao.Data).getHours() + ":"+ new Date(medicao.Data).getMinutes(), medicao.Umidade, medicao.Temperatura])
        temperaturas.push(medicao.Temperatura)
        umidades.push(medicao.Umidade)
        datas.push(new Date(medicao.Data).getDay()+ " - " + new Date(medicao.Data).getHours() + ":"+ new Date(medicao.Data).getMinutes())
//      console.log(new Date(medicao.Data).getHours() + ":"+ new Date(medicao.Data).getMinutes())
      })
      this.lineChartMethod(temperaturas, umidades, datas);
    } else {
      dadosGrafico.push([new Date().getHours() + ":"+ new Date().getMinutes(), '50', '25'])
      dadosGrafico.push([new Date().getHours() + ":"+ new Date().getMinutes(), '55', '20'])
      dadosGrafico.push([new Date().getHours() + ":"+ new Date().getMinutes(), '58', '23'])
    }

    this.pieChart = {
      chartType: 'LineChart',
      dataTable: dadosGrafico,
      //firstRowIsData: true,
      options: {
     //   'title': 'Tasks',
      // chartArea: {width: '75%'},
        legend: {position: 'top'},
        curveType: 'function'},
    };

    this.pieChart.dataTable = dadosGrafico
  }




  @ViewChild('lineCanvas') private lineCanvas: ElementRef;
  lineChartMethod(temps, umids, dats) {
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: dats, //['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'November', 'December'], //{{ dias | tojson }},
        datasets: [{
          label: 'Temperatura',
          data: temps, //[2, 3, 4, 5, 3, 3, 3, 3, 3, 3, 2], //{{ temperaturas | tojson }},
        backgroundColor: 'rgb(255,254,254, 0)',
            borderColor: 'rgb(193,17,17)',
            borderWidth: 1
      },
        {
          label: 'Umidade',
          data:  umids, //[2, 3, 4, 5, 3, 3, 3, 3, 3, 3, 2], //{{ umidades | tojson }},
          backgroundColor: 'rgb(246,246,245, 0)',
          borderColor: 'rgb(13,61,208)',
          borderWidth: 1
        }]
      },
        options: {
          responsive: true,
              title: {
            display: true,
                text: 'Medições de Temperatura e Umidade'
          },
          hover: {
            mode: 'nearest',
                intersect: true
          },
          scales: {
            xAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Horário'
              }
            }],
                yAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Fº / %'
              }
            }]
          }
        }

    });
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
      this.configService.getConfig().then(configRetorno => {
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

  async buscarAlertas(){
    this.alertas = await this.folderService.getAlertas().then(alertasRetorno => {
      return alertasRetorno
    }).catch(error => {
      console.log('Retornou Erro de Alertas:', error);
    })
    console.log(this.alertas)
  }


  silenciarAlertas(){
    this.pararNative();
    this.folderService.silenciarAlertas().then(r => {
      console.log(r)
    }).catch(error => {
      console.log('Retornou Erro de silenciar alertas:', error);
    })
    this.buscarAlertas()
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

     

    setTimeout(() => {
      alert('Aguarde 9 segundos..... Verifique se os alertas estão ativos no Menu Configurar. ')
      this.executarNative('Testando')
        alert('teste executado')
    },
    9000);
  }


  async executarNative(descricao: string){
    const alertaConfig = localStorage.getItem('alertaconfig') // se existir é pq o alerta está ativado
    if (alertaConfig) {
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

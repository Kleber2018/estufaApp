import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { Animation, AnimationController, AlertController, Platform, ModalController } from '@ionic/angular';
import {  Router } from '@angular/router';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';

import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AlertConfigService } from 'src/app/alert-config/alert-config.service';
import { Config, Modulo } from 'src/app/shared/model/config.model';
import { FolderService } from '../folder.service';
import { ConfigModComponent } from '../modal/config-mod/config-mod.component';


@Component({
  selector: 'app-card-estufa',
  templateUrl: './card-estufa.component.html',
  styleUrls: ['./card-estufa.component.css']
})
export class CardEstufaComponent implements OnInit, OnDestroy {

  private end: Subject<boolean> = new Subject();

  private temperaturaAnimation: Animation;
  private umidadeAnimation: Animation;
 // @ViewChild('alertaPiscando', { read: ElementRef }) alertaPiscando: ElementRef;
  @ViewChild('umidAnimation', { read: ElementRef }) umidAnimation: ElementRef;
  @ViewChild('tempAnimation', { read: ElementRef }) tempAnimation: ElementRef;

  @Input() public dadosModulo : Modulo;
  @Input() public positionArray : number;

  public alertaAtivado = false;
  public config: any;

  public medicao = {
    temp: 0,
    temp_status: '',//baixo, alto
    umid: 0,
    umid_status: '', //baixo, alto
    createdAt: ''
  }

  constructor( 
              private folderService: FolderService,
              private animationCtrl: AnimationController,
              private nativeAudio: NativeAudio,
              private vibration: Vibration,
              private platform: Platform,
              public alertController: AlertController,
              private router: Router,
              private alertConfigService: AlertConfigService,
              private localNotifications: LocalNotifications,
              public modalController: ModalController) { 

                      // The Native Audio plugin can only be called once the platform is ready
    this.localNotifications.requestPermission()
    this.platform.ready().then(() => { 
      var isAcceptedObservable = this.localNotifications.on('silenciar').pipe(takeUntil(this.end)).subscribe(res =>{
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
  }

  ngOnInit(): void {
    console.log('dados dentro', this.dadosModulo, 'index', this.positionArray)
    this.inicializar(this.dadosModulo)
  }

  inicializar(dadosEstufa: Modulo){
    this.buscaConfig(dadosEstufa.ip)
    this.buscarMedicao(dadosEstufa.ip,  dadosEstufa.guarda)
    this.interval(dadosEstufa.ip, dadosEstufa.guarda)
    this.notificacaoExecucao()

    if(this.dadosModulo.guarda == '1'){
      this.alertaAtivado = true
    } else {
      this.alertaAtivado = false
    }

    //loop para requisitar informações a cada 60000 (60 segundos)
        /*
        setInterval(function () {
              this.buscaConfig()
              this.buscarMedicao()
              // para que o array de medição não seja atualizado com tanta frequencia
            }.bind(this),
            70000);
          */
        //para atrasar a inicialização da animação
        /*
        setTimeout(() => {
              this.startAnimaTempUmid()
              console.log('animando')
            },
            1500);*/
   }

  async abrirConfigEstufa(){
    //this.router.navigate([`/config/update/${this.positionArray}`]);
    console.log('start insert')
    const modal = await this.modalController.create({
        component: ConfigModComponent,
        componentProps: {
            'indexArray': this.positionArray,
            'dadosModulo': this.dadosModulo
        }
        //cssClass: 'my-custom-class'
    });
    modal.present();
    modal.onWillDismiss().then(data=>{
      console.log('modal retorno do config', data)
      if(data){
          if(data.data){
            if(data.data.return){
              if(data.data.return == 'delete' || data.data.return == 'logado'){
                this.ngOnDestroy()
                window.location.reload() //força a atualização do app
              }
            } 
          }
      }
    })
  }

  abrirMedicoesEstufa(){
    this.router.navigate([`/measurements/${this.positionArray}`]);
  }

  abrirAlertasEstufa(){
    this.router.navigate([`/alertas/${this.positionArray}`]);
  }

  ativarAlerta(){
    this.alertaAtivado = true
    const configMod: Config = localStorage.getItem('estufaapp')
        ? JSON.parse(localStorage.getItem('estufaapp'))
        : null;
    if(configMod){
      configMod.modulos[this.positionArray].guarda = '1'
      localStorage.setItem('estufaapp', JSON.stringify(configMod))
    }
  }

  desativarAlerta(){
    this.alertaAtivado = false
    const configMod: Config = localStorage.getItem('estufaapp')
        ? JSON.parse(localStorage.getItem('estufaapp'))
        : null;
    if(configMod){
      configMod.modulos[this.positionArray].guarda = '0'
      localStorage.setItem('estufaapp', JSON.stringify(configMod))
    }
  }



  public timerSubscription
  interval(ip: string, guarda: string) {
    const source = timer(30000, 60000);
    this.timerSubscription = source.pipe(takeUntil(this.end)).subscribe(t => { //Timer subscription é só uma variável pra que possa destruir o timer depois
      if( ((t+1) % 9) == 0 ){
        this.buscaConfig(ip)
      }
      this.buscarMedicao(ip, guarda) // ele verifica se ainda está carregando pra poder fazer uma nova requisição
    });
  }



  buscarMedicao(ip: string, guarda: string) {
    this.folderService.getMedicao(ip).then(med => {
      this.buildViewMedicao(med[0], guarda)
      console.log(med[0])
    }).catch(error => {
      console.log('Retornou Erro de Mediçao:', error);
      this.medicao = {
        temp: 0,
        temp_status: '',//baixo, alto
        umid: 0,
        umid_status: '', //baixo, alto
        createdAt: ''
      }
    })
  }



  buildViewMedicao(med: any, guarda: string){
    if(this.config){
      var spl = med.Data.split(' ')
      var spl1 = spl[0].split('-')
      var spl2 = spl[1].split(':')
      this.medicao.createdAt = `${spl1[2]}/${spl1[1]} - ${spl2[0]}:${spl2[1]}`
      this.medicao.temp = med.Temperatura
      this.medicao.umid = med.Umidade
      if(med.Temperatura > this.config.temp_max){
        this.medicao.temp_status = "alto"
        this.executarNative('Temperatura alta', guarda)
      } else if(med.Temperatura < this.config.temp_min ){
        this.medicao.temp_status = "baixo"
        if(med.Temperatura > 0){
          this.executarNative('Temperatura baixa', guarda)
        }
      } else {
        this.medicao.temp_status = ""
      }
      if(med.Umidade > this.config.umid_max){
        this.medicao.umid_status = "alto"
        this.executarNative('Umidade alta', guarda)
      } else if(med.Umidade < this.config.umid_min ){
        this.medicao.umid_status = "baixo"
        if(med.Umidade > 0){
          this.executarNative('Umidade baixa', guarda)
        }
      } else {
        this.medicao.umid_status = ""
      }
      this.startAnimaTempUmid()
    }
  }


  buscaConfig(ip: string){
    this.alertConfigService.getConfig(ip).then(configRetorno => {
      if(configRetorno){
        if(Array.isArray(configRetorno)){
          this.config = configRetorno[0];
        } else {
          this.config = configRetorno;
        }
        //localStorage.setItem('configraspberry', JSON.stringify(this.config))
      }
    }).catch(error => {
          if (error.error){
            console.log('Retornou Erro de configuração',error.error);
          } else {
            console.log('Retornou Erro de configuração:',error);
          }
        }
    )
  }

  

  startAnimaTempUmid(){
    if(this.temperaturaAnimation){
      this.temperaturaAnimation.destroy()
    }
    if(this.umidadeAnimation){
      this.umidadeAnimation.destroy()
    }
    if(this.medicao.temp_status == 'alto'){
      this.temperaturaAnimation = this.animationCtrl.create('temp-animation')
          .addElement(this.tempAnimation.nativeElement)
          .iterations(Infinity)
          .duration(2700)
          //.fromTo('opacity', '1', '0.5');
          .keyframes([
            { offset: 0, background: 'orange' },
            { offset: 0.72, background: 'red' },
            { offset: 1, background: 'var(--background)' }
          ]);
      this.temperaturaAnimation.play()
    } else if (this.medicao.temp_status == 'baixo'){
      this.temperaturaAnimation = this.animationCtrl.create('temp-animation')
          .addElement(this.tempAnimation.nativeElement)
          .iterations(Infinity)
          .duration(2700)
          //.fromTo('opacity', '1', '0.5');
          .keyframes([
            { offset: 0, background: 'blue' },
            { offset: 0.72, background: 'purple' },
            { offset: 1, background: 'var(--background)' }
          ]);
      this.temperaturaAnimation.play()
    }
    if(this.medicao.umid_status == 'alto'){
      this.umidadeAnimation = this.animationCtrl.create('umid-animation')
          .addElement(this.umidAnimation.nativeElement)
          .iterations(Infinity)
          .duration(2700)
          //.fromTo('opacity', '1', '0.5');
          .keyframes([
            { offset: 0, background: 'orange' },
            { offset: 0.72, background: 'red' },
            { offset: 1, background: 'var(--background)' }
          ]);
          this.umidadeAnimation.play()
    } else if(this.medicao.umid_status == 'baixo'){
      this.umidadeAnimation = this.animationCtrl.create('umid-animation')
          .addElement(this.umidAnimation.nativeElement)
          .iterations(Infinity)
          .duration(2700)
          //.fromTo('opacity', '1', '0.5');
          .keyframes([
            { offset: 0, background: 'blue' },
            { offset: 0.72, background: 'purple' },
            { offset: 1, background: 'var(--background)' }
          ]);
      this.umidadeAnimation.play()
    }
  }



  testarAlerta(){
    //teste quando o app está em background ou não
    this.platform.ready().then(() => {
      this.platform.pause.pipe(takeUntil(this.end)).subscribe(() => {        
          console.log('****UserdashboardPage PAUSED****');
      });  
      this.platform.resume.pipe(takeUntil(this.end)).subscribe(() => {      
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
      this.executarNative('Testando', '1')
    },
    6000);
  }


  notificacaoExecucao(){
    this.localNotifications.schedule({
      id: 1,
      title: 'Estufa App',
      text:  'Monitorameto está em Execução',
      foreground: true,
      smallIcon: 'res://ic_launcher',
      icon: 'res://ic_launcher',//'http://estufa.com/assets/icon/favicon.png',
      actions: [
        { id: 'Abrir', title: 'SILENCIAR' }
      ]
    });
  }


  async executarNative(descricao: string, guarda: string){
    if(guarda == '1'){
      const configMod = localStorage.getItem('estufaapp')
      ? JSON.parse(localStorage.getItem('estufaapp'))
      : null;
      if(configMod){
        if(configMod.guarda == '1'){
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


  ngOnDestroy(): void {
    console.log('onDestroyCard')
    this.end.next();
    this.end.complete();
    this.pararNative()
  }
}

import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FolderService} from "../folder.service";
import {FormControl} from "@angular/forms";

import { Animation, AnimationController, AlertController, ModalController } from '@ionic/angular';
import {  takeUntil } from 'rxjs/operators';


import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { Platform } from '@ionic/angular';


import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Subject, timer } from 'rxjs';

import { PDFGenerator } from '@ionic-native/pdf-generator/ngx';
import { Config } from 'src/app/shared/model/config.model';
import { ModalScanPage } from '../modal/modal-scan/modal-scan.page';


@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit, OnDestroy {

  public admin: boolean = false;
  
  public configModulo: Config;

  public folder: string;





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


  private end: Subject<boolean> = new Subject();
 

  constructor(private activatedRoute: ActivatedRoute,
                    private platform: Platform,
                    public alertController: AlertController,
                    private router: Router,
                    private pdfGenerator: PDFGenerator,
                    public modalController: ModalController
                    ) {
                      this.admin = false

                      this.configModulo = localStorage.getItem('estufaapp')
                      ? JSON.parse(localStorage.getItem('estufaapp'))
                      : null;
                  

                      if(!this.configModulo){
                        this.configModulo = {
                          guarda: '0',
                          vibrar: '1',
                          toque: 'uniqueId1',
                        }
                        localStorage.setItem('estufaapp', JSON.stringify(this.configModulo))
                        this.carregaConfigTeste()
                      }
                      
     // set status bar to white
      //this.statusBar.backgroundColorByHexString('#339933');
  }

 

ngOnInit() {
}

  carregaConfigTeste(){
    this.configModulo = {
      guarda: '1',
      vibrar: '1',
      toque: 'uniqueId1',
      modulos: [{
        identificacao: 'Estufa Primeira', //Estufa Amarela
        guarda: '0', // 1 / 0
        usuario: 'Kleber', // para login
        token: '', // retornado pelo raspberry
        created: '',// data da criação
        ip: '127.0.0.1:5000', // 192.168.1.105:5000
      }]
    }
    this.configModulo.modulos.push( {
      identificacao: 'Estufa Segunda', //Estufa Amarela
      guarda: '0', // 1 / 0
      usuario: 'Kleber', // para login
      token: '', // retornado pelo raspberry
      created: '',// data da criação
      ip: '127.0.0.1:5000', // 192.168.1.105:5000
    })

    localStorage.setItem('estufaapp', JSON.stringify(this.configModulo))
  }


  //para fazer um refresh
  doRefresh(event?) {
    this.configModulo = localStorage.getItem('estufaapp')
                          ? JSON.parse(localStorage.getItem('estufaapp'))
                          : null;
    if(event){
      setTimeout(() => {
        event.target.complete();
      }, 400);
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

 

  habilitaDelete(status: boolean){
    this.admin = status
  }

  async startInsert(){
    console.log('start insert')
    const modal = await this.modalController.create({
        component: ModalScanPage,
        componentProps: {
            'IP': false
        }
        //cssClass: 'my-custom-class'
    });
    modal.present();
    modal.onWillDismiss().then(data=>{
        console.log('modal', data)
        if(data){
            if(data.data){
                if(data.data.IP){
                    var splitted = data.data.IP.split(".");
                    //verifica se é um número
                    if(!isNaN(parseFloat(splitted[0])) && isFinite(splitted[0])){
                            var configMod: Config = localStorage.getItem('estufaapp')
                                ? JSON.parse(localStorage.getItem('estufaapp'))
                                : null;
                            if(configMod){
                                if(configMod.modulos){
                                    configMod.modulos.push({
                                        identificacao: `Estufa ${(configMod.modulos.length+1)}`, //Estufa Amarela
                                        guarda: '0', // 1 / 0
                                        usuario: '', // para login
                                        token: '', // retornado pelo raspberry
                                        created: '',// data da criação
                                        ip:  data.data.IP, // 192.168.1.105:5000
                                    })
                                } else {
                                    configMod.modulos = [{
                                        identificacao: `Estufa 1`, //Estufa Amarela
                                        guarda: '0', // 1 / 0
                                        usuario: '', // para login
                                        token: '', // retornado pelo raspberry
                                        created: '',// data da criação
                                        ip:  data.data.IP, // 192.168.1.105:5000
                                    }]
                                }
                            } else {
                                configMod = {
                                    guarda: '0',
                                    vibrar: '1',
                                    toque: 'uniqueId1',
                                    modulos: [{
                                      identificacao: 'Estufa 1', //Estufa Amarela
                                      guarda: '0', // 1 / 0
                                      usuario: '', // para login
                                      token: '', // retornado pelo raspberry
                                      created: '',// data da criação
                                      ip: data.data.IP, // 192.168.1.105:5000
                                    }]
                                  }
                            }
                            localStorage.setItem('estufaapp', JSON.stringify(configMod))
                            //this.ngOnDestroy()
                            this.doRefresh()
                           // this.router.navigate([`/config/update/${(configMod.modulos.length-1)}`]);
                        } 
                       
                } 
          }
        }
    })
}


 
  ngOnDestroy(): void {
    console.log('onDestroy')
    this.end.next();
    this.end.complete();

  }

}

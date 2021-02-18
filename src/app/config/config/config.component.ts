import { Component, OnInit } from '@angular/core';
import {ConfigService} from "../config.service";
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import {LoadingController} from "@ionic/angular";
import {Router} from "@angular/router";
import { NetworkInterface } from '@ionic-native/network-interface/ngx';
import { splitAtColon } from '@angular/compiler/src/util';
import { ModalController } from '@ionic/angular';

import {ModalScanPage} from '../modal-scan/modal-scan.page'


@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
})

export class ConfigComponent implements OnInit {

  public formIP: FormGroup;
  public config: any;
  public apiURL

    public alertaAtivado = false
  constructor(
      private formBuilder: FormBuilder,
      private configService: ConfigService,
      private router: Router,
      public modalController: ModalController
  ) {
         this.inicializar()
  }

  ngOnInit() {}


  async inicializar(){
    const alertaConfig = localStorage.getItem('alertaconfig')
    if (alertaConfig) {
        this.alertaAtivado = true
    } else {
        this.alertaAtivado = false
    }

    this.apiURL = localStorage.getItem('ipraspberry')
    if(this.apiURL){
    const vr = await this.configService.validaIP(this.apiURL).then(r => {console.log('no then', r); return r})
        if(vr){
            console.log('encontrado')
        }
    }
  }


  public datetimeDispositivo
  public datetimeCelular

  buscarDataRapsberry(){
     this.configService.getDateTimeRaspberry().then(r => {
          console.log(r);
         this.datetimeDispositivo = r
         this.datetimeCelular = new Date()
      })
}

// atualizar a data do raspberry igual ao do dispositivo
atualizarDataRaspberry(){
    this.configService.setDateTimeRaspberry().then(r => console.log('retornou', r))
}



    desativarAlertas(){
        localStorage.removeItem('alertaconfig')
        this.alertaAtivado = false
    }

    ativarAlertas(){
        localStorage.setItem('alertaconfig', 'ativado')
        this.alertaAtivado = true
    }

    async IPModal() {
        var ipLocal = '127.0.0.1'
        if(this.apiURL){
            ipLocal = this.apiURL
        }
        const modal = await this.modalController.create({
          component: ModalScanPage,
          componentProps: {
            'IP': ipLocal
          }
          //cssClass: 'my-custom-class'
        });
        modal.present();
        modal.onWillDismiss().then(data=>{
            console.log('modal', data)
            if(data){
                if(data.data){
                    if(data.data.IP){
                        console.log('Modal retorno', data.data.IP)
                        var splitted = data.data.IP.split(".");
                        //verifica se é um número
                        if(!isNaN(parseFloat(splitted[0])) && isFinite(splitted[0])){
                            localStorage.setItem('ipraspberry', `${data.data.IP}:5000`)
                            this.router.navigate(['/folder']);
                        }   
                    }
                }
            }
            })
    }
}



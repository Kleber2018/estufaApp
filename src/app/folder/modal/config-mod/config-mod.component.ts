import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";
import { AlertController, ModalController } from '@ionic/angular';

import {ModalScanPage} from '../modal-scan/modal-scan.page'
import { Subject } from 'rxjs';
import { Config, Modulo } from 'src/app/shared/model/config.model';
import { FolderService } from '../../folder.service';
import { Login } from '../login/login.page';
import { AlertConfigComponent } from '../alert-config/alert-config.component';

@Component({
  selector: 'app-config-mod',
  templateUrl: './config-mod.component.html',
  styleUrls: ['./config-mod.component.scss'],
})

export class ConfigModComponent implements OnInit, OnDestroy {

    private end: Subject<boolean> = new Subject();

    public formIP: FormGroup;
    public config: Config;

    @Input() dadosModulo : Modulo;
    @Input() indexArray : number;

    public alertaAtivado = false

    constructor(
        private formBuilder: FormBuilder,
        private folderService: FolderService,
        private router: Router,
        public modalController: ModalController,
        public alertController: AlertController
    ) {
      
    }

    ngOnInit() {
        console.log('teste', this.indexArray, this.dadosModulo)
        if(this.dadosModulo){
            if(this.dadosModulo.guarda == '1'){
                this.alertaAtivado = true
            } else {
                this.alertaAtivado = false
            }
        }
    }


    async validarIP(ip){
        const vr = await this.folderService.validaIP(ip).then(r => {console.log('no then', r); return r})
        if(vr){
            console.log('encontrado')
        }
    }

    public datetimeDispositivo
    public datetimeCelular
    buscarDataRapsberry(){
        this.folderService.getDateTimeRaspberry(this.dadosModulo.ip).then(r => {
            console.log(r);
            this.datetimeDispositivo = r
            this.datetimeCelular = new Date()
        })
    }

    // atualizar a data do raspberry igual ao do dispositivo
    atualizarDataRaspberry(){
        this.folderService.setDateTimeRaspberry(this.dadosModulo.ip).then(r => console.log('retornou', r))
    }

    async abrirAlertaConfig(){
        //this.router.navigate([`/alert-config/${this.indexArray}`]);
        const modal = await this.modalController.create({
                component: AlertConfigComponent,
                componentProps: {
                'IP': this.dadosModulo.ip,
                'token' : this.dadosModulo.token
            }
            //cssClass: 'my-custom-class'
        });
        modal.present();
        modal.onWillDismiss().then(data=>{
            console.log('abrirAlertaConfig retorno ', data)
            if(data){
                if(data.data){
                    if(data.data.return){
                        if(data.data.return == 'salvo'){
                            console.log('retorno')
                        }
                    }
                }
            }
        })
    }
   
    desativarAlertas(){
        this.alertaAtivado = false
        const configMod: Config = localStorage.getItem('estufaapp')
            ? JSON.parse(localStorage.getItem('estufaapp'))
            : null;
        if(configMod){
          configMod.modulos[this.indexArray].guarda = '0'
          localStorage.setItem('estufaapp', JSON.stringify(configMod))
        }
    }

    ativarAlertas(){
        this.alertaAtivado = true
        const configMod: Config = localStorage.getItem('estufaapp')
            ? JSON.parse(localStorage.getItem('estufaapp'))
            : null;
        if(configMod){
          configMod.modulos[this.indexArray].guarda = '1'
          localStorage.setItem('estufaapp', JSON.stringify(configMod))
        }
    }

    async IPModal() {
        const configMod: Config = localStorage.getItem('estufaapp')
            ? JSON.parse(localStorage.getItem('estufaapp'))
            : null;
        if(configMod){
            this.dadosModulo =  configMod.modulos[this.indexArray]
        }
        const modal = await this.modalController.create({
          component: ModalScanPage,
          componentProps: {
            'IP': this.dadosModulo.ip
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
                            const configMod: Config = localStorage.getItem('estufaapp')
                                ? JSON.parse(localStorage.getItem('estufaapp'))
                                : null;
                            if(configMod){
                                configMod.modulos[this.indexArray].ip = data.data.IP
                                localStorage.setItem('estufaapp', JSON.stringify(configMod))
                                this.router.navigate(['/folder']);
                            }
                        }   
                    }
                }
            }
        })
    }

    async excluirModulo(){
        const alert = await this.alertController.create({
            header: 'Exclusão',
            message: 'Tem certeza que deseja excluir a estufa do seu disposítivo?',
            buttons: [
              {
                text: 'Cancel',
                role: 'cancel',
                cssClass: 'secondary',
              }, {
                text: 'Excluir',
                handler: () => {
                    let configMod: Config = localStorage.getItem('estufaapp')
                    ? JSON.parse(localStorage.getItem('estufaapp'))
                    : null;
                    if(configMod){
                        configMod.modulos.splice(this.indexArray, 1)
                        localStorage.setItem('estufaapp', JSON.stringify(configMod))
                        this.dismiss('delete')
                    }
                }
              }
            ]
          });
      
        await alert.present();
    }

    async login(){
        const modal = await this.modalController.create({
            component: Login,
            componentProps: {
                'IP': this.dadosModulo.ip
            }
        //cssClass: 'my-custom-class'
        });
        modal.present();
        modal.onWillDismiss().then(data=>{
            console.log('modal', data)
            if(data){
                if(data.data){
                    if(data.data.token){
                        const configMod: Config = localStorage.getItem('estufaapp')
                            ? JSON.parse(localStorage.getItem('estufaapp'))
                            : null;
                        if(configMod){
                            configMod.modulos[this.indexArray].token = data.data.token
                            localStorage.setItem('estufaapp', JSON.stringify(configMod))
                            this.dadosModulo = configMod.modulos[this.indexArray]
                            this.dismiss('logado')
                        }
                    }
                }
            }
        })  
    }

    async logout(){
        const configMod: Config = localStorage.getItem('estufaapp')
            ? JSON.parse(localStorage.getItem('estufaapp'))
            : null;
        if(configMod){
            configMod.modulos[this.indexArray].token = ''
            localStorage.setItem('estufaapp', JSON.stringify(configMod))
            this.dadosModulo = configMod.modulos[this.indexArray]
        }
    }

    dismiss(retorno?) {
        console.log('dimiss',)
        // using the injected ModalController this page
        // can "dismiss" itself and optionally pass back data
        if(retorno){
          this.modalController.dismiss({
            'closed': false,
            'return' : retorno
          });
          this.ngOnDestroy()
        } else {
          this.modalController.dismiss({
            'closed': true
          });
          this.ngOnDestroy()
        }
    }

    ngOnDestroy(): void {
        console.log('onDestroy config mod')
        this.end.next();
        this.end.complete();
    }
}



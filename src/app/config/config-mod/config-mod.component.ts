import { Component, OnDestroy, OnInit } from '@angular/core';
import {ConfigService} from "../config.service";
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";
import { ModalController } from '@ionic/angular';

import {ModalScanPage} from '../modal-scan/modal-scan.page'
import { Subject } from 'rxjs';
import { Config, Modulo } from 'src/app/shared/model/config.model';

@Component({
  selector: 'app-config-mod',
  templateUrl: './config-mod.component.html',
  styleUrls: ['./config-mod.component.scss'],
})

export class ConfigModComponent implements OnInit, OnDestroy {

    private end: Subject<boolean> = new Subject();

    public formIP: FormGroup;
    public config: Config;
    public dadosModulo : Modulo;
    public alertaAtivado = false

    constructor(
        private formBuilder: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private configService: ConfigService,
        private router: Router,
        public modalController: ModalController
    ) {
      
    }

    ngOnInit() {
        console.log('carregando configmod')
        if (this.activatedRoute.snapshot.params.tipo) {
            console.log('teste', this.activatedRoute.snapshot.params.tipo)
            if (this.activatedRoute.snapshot.params.tipo == 'update') { //para atualizar as configurações de uma estufa
                if (this.activatedRoute.snapshot.params.id) {
                    const configMod: Config = localStorage.getItem('estufaapp')
                        ? JSON.parse(localStorage.getItem('estufaapp'))
                        : null;
                    if(configMod){
                        this.dadosModulo =  configMod.modulos[this.activatedRoute.snapshot.params.id]
                        //localStorage.setItem('estufaapp', JSON.stringify(configMod))
                        if(this.dadosModulo.guarda == '1'){
                            this.alertaAtivado = true
                        } else {
                            this.alertaAtivado = false
                        }
                    }
                } 
            } else { //insert de estufa
                //this.startInsert()
            }
        }
    }


    async validarIP(ip){
        const vr = await this.configService.validaIP(ip).then(r => {console.log('no then', r); return r})
        if(vr){
            console.log('encontrado')
        }
    }

    public datetimeDispositivo
    public datetimeCelular
    buscarDataRapsberry(){
        this.configService.getDateTimeRaspberry(this.dadosModulo.ip).then(r => {
            console.log(r);
            this.datetimeDispositivo = r
            this.datetimeCelular = new Date()
        })
    }

    // atualizar a data do raspberry igual ao do dispositivo
    atualizarDataRaspberry(){
        this.configService.setDateTimeRaspberry(this.dadosModulo.ip).then(r => console.log('retornou', r))
    }

    abrirAlertaConfig(){
        this.router.navigate([`/alert-config/${this.activatedRoute.snapshot.params.id}`]);
    }

   
    desativarAlertas(){
        this.alertaAtivado = false
        const configMod: Config = localStorage.getItem('estufaapp')
            ? JSON.parse(localStorage.getItem('estufaapp'))
            : null;
        if(configMod){
          configMod.modulos[this.activatedRoute.snapshot.params.id].guarda = '0'
          localStorage.setItem('estufaapp', JSON.stringify(configMod))
        }
    }

    ativarAlertas(){
        this.alertaAtivado = true
        const configMod: Config = localStorage.getItem('estufaapp')
            ? JSON.parse(localStorage.getItem('estufaapp'))
            : null;
        if(configMod){
          configMod.modulos[this.activatedRoute.snapshot.params.id].guarda = '1'
          localStorage.setItem('estufaapp', JSON.stringify(configMod))
        }
    }

    async IPModal() {
        const configMod: Config = localStorage.getItem('estufaapp')
            ? JSON.parse(localStorage.getItem('estufaapp'))
            : null;
        if(configMod){
            this.dadosModulo =  configMod.modulos[this.activatedRoute.snapshot.params.id]
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
                            if (this.activatedRoute.snapshot.params.tipo == 'update') {
                                const configMod: Config = localStorage.getItem('estufaapp')
                                    ? JSON.parse(localStorage.getItem('estufaapp'))
                                    : null;
                                if(configMod){
                                    configMod.modulos[this.activatedRoute.snapshot.params.id].ip = data.data.IP
                                    localStorage.setItem('estufaapp', JSON.stringify(configMod))
                                    this.router.navigate(['/folder']);
                                }
                            } else {
                                //montar lógica insert
                            }
                        }   
                    }
                }
            }
        })
    }

    ngOnDestroy(): void {
        console.log('onDestroy config mod')
        this.end.next();
        this.end.complete();
    }
}



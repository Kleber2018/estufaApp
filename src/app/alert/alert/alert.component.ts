import { Component, OnInit } from '@angular/core';
import {AlertService} from "../alert.service";
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";

import { Config, Modulo } from 'src/app/shared/model/config.model';

@Component({
  selector: 'app-config',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements OnInit {

    public alertas: any = [];
    public dataInic = (new Date().getFullYear())+'-'+(new Date().getMonth())+'-'+(new Date().getDate()-2)
    public formDataInic = new FormControl(this.dataInic,[]);

    public dadosModulo : Modulo;

    public dataFinal = (new Date().getFullYear())+'-'+(new Date().getMonth()+1)+'-'+(new Date().getDate())
    public formDataFinal = new FormControl(this.dataFinal,[]);

    public viewAlertasPendentes = true

    constructor(
      private formBuilder: FormBuilder,
      private alertService: AlertService,
      private router: Router,
      private activatedRoute: ActivatedRoute
    ) {
        if (this.activatedRoute.snapshot.params.id) {
            const configMod: Config = localStorage.getItem('estufaapp')
                ? JSON.parse(localStorage.getItem('estufaapp'))
                : null;
            if(configMod){
               this.dadosModulo =  configMod.modulos[this.activatedRoute.snapshot.params.id]
                //localStorage.setItem('estufaapp', JSON.stringify(configMod))
                this.buscarAlertasPendentes(this.dadosModulo.ip)
            }
        }
    }

    ngOnInit() {}

    async buscarAlertas(dataI, dataF, ip){
        this.alertas = await this.alertService.getAlertasPeriodo(dataI, dataF, ip).then(alertasRetorno => {
            return alertasRetorno
        }).catch(error => {
            console.log('Retornou Erro de Alertas:', error);
        })
        console.log(this.alertas)
    }

    async buscarAlertasPendentes(ip){
        this.alertas = await this.alertService.getAlertas(ip).then(alertasRetorno => {
            return alertasRetorno
        }).catch(error => {
            console.log('Retornou Erro de Alertas:', error);
        })
        console.log(this.alertas)
    }

    selecionadoData(){
        if(this.viewAlertasPendentes){
            this.buscarAlertasPendentes(this.dadosModulo.ip)
        } else {
            this.buscarAlertas(this.formDataInic.value, this.formDataFinal.value, this.dadosModulo.ip)
        }
    }

    selecionaCheckboxPendentes(vrAlertasPendentes){
        if(vrAlertasPendentes){
            this.buscarAlertas(this.formDataInic.value, this.formDataFinal.value, this.dadosModulo.ip)
        } else {
            this.buscarAlertasPendentes(this.dadosModulo.ip)
        }
    }

    
       //para fazer um refresh
    doRefresh(event) {
        const configMod: Config = localStorage.getItem('estufaapp')
            ? JSON.parse(localStorage.getItem('estufaapp'))
            : null;
        if(configMod){
        this.dadosModulo =  configMod.modulos[this.activatedRoute.snapshot.params.id]
            if(this.viewAlertasPendentes){
                this.buscarAlertasPendentes(this.dadosModulo.ip)
            } else {
                this.buscarAlertas(this.formDataInic.value, this.formDataFinal.value, this.dadosModulo.ip)
            }
        }
        setTimeout(() => {
        event.target.complete();
        }, 400);
    }

}



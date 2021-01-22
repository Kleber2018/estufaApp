import { Component, OnInit } from '@angular/core';
import {AlertService} from "../alert.service";
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-config',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements OnInit {

    public alertas: any = [];
    public dataInic = (new Date().getFullYear())+'-'+(new Date().getMonth())+'-'+(new Date().getDate()-2)
    public formDataInic = new FormControl(this.dataInic,[]);

    public dataFinal = (new Date().getFullYear())+'-'+(new Date().getMonth()+1)+'-'+(new Date().getDate())
    public formDataFinal = new FormControl(this.dataFinal,[]);

    constructor(
      private formBuilder: FormBuilder,
      private alertService: AlertService
    ) {
      this.buscarAlertas(this.formDataInic.value, this.formDataFinal.value)
    }


    ngOnInit() {}

    async buscarAlertas(dataI, dataF){
        this.alertas = await this.alertService.getAlertas().then(alertasRetorno => {
            return alertasRetorno
        }).catch(error => {
            console.log('Retornou Erro de Alertas:', error);
        })
        console.log(this.alertas)
    }
    selecionadoData(){
        this.buscarAlertas(this.formDataInic.value, this.formDataFinal.value)
    }

}



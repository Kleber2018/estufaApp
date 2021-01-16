import { Component, OnInit } from '@angular/core';
import {ConfigService} from "../config.service";
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
})
export class ConfigComponent implements OnInit {
  public formConfig: FormGroup;
  public config: any;
  constructor(
      private formBuilder: FormBuilder,
      private configService: ConfigService
  ) {

    this.configService.getConfig().then(ocurrenceRetorno => {
      console.log('Retornou /config', ocurrenceRetorno);
      if(Array.isArray(ocurrenceRetorno)){
        this.config = ocurrenceRetorno[0];
      } else {
        this.config = ocurrenceRetorno;
      }

      this.buildFormConfig(this.config)
    }).catch(error => {
          if (error.error){
            console.log('Retornou Erro:',error.error);
          } else {
            console.log('Retornou Erro:',error);
          }
        }
    )

  }

  ngOnInit() {}

  //carregando com dados nulos para criar uma nova ocorrência
  private buildFormConfig(conf: any): void {
    this.formConfig = this.formBuilder.group({
        intervalo_seconds: [conf.intervalo_seconds, [Validators.required]],
        temp_min: [conf.temp_min, [Validators.required]],
        temp_max: [conf.temp_max, [Validators.required]],
        umid_min: [conf.umid_min, [Validators.required]],
        umid_max: [conf.umid_max, [Validators.required]],
        obs: [conf.obs, [Validators.required]],
    })
  }

  submitConfig(){
    console.log(this.formConfig.value)
      this.configService.updateConfig(this.formConfig.value).then(r => {
          if(r){
              if(r.retorno == 'salvo'){
                  alert(r.retorno)
              } else {
                  alert('erro ao salvar: ' + r.retorno)
              }
          } else {
              alert('erro ao salvar: ' + r.retorno)
          }
      })
  }

}



import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfigService } from 'src/app/config/config.service';
import { AlertConfigService } from '../alert-config.service';

@Component({
  selector: 'app-alert-config',
  templateUrl: './alert-config.component.html',
  styleUrls: ['./alert-config.component.scss'],
})
export class AlertConfigComponent implements OnInit {

  public formConfig: FormGroup;
  public config: any;
  public apiURL

  constructor(
      private formBuilder: FormBuilder,
      private alertConfigService: AlertConfigService,
      private configService: ConfigService,
      private router: Router
  ) {
    //this.inicializando()
    this.buildFormConfig()
  }

  ngOnInit() {}

  /*
  async inicializando(){
    const vr = await this.configService.validaIP(this.apiURL).then(r => {console.log('no then', r); return r})
    if(vr){

        this.buildFormConfig()
    } else {
      localStorage.removeItem('ipraspberry')
    }
  }
  */
 
  //carregando com dados nulos para criar uma nova ocorrência
  private buildFormConfig(): void {
      this.alertConfigService.getConfig().then(configRetorno => {
          console.log('Retornou /config', configRetorno);
          if(configRetorno){
              if(Array.isArray(configRetorno)){
                  this.config = configRetorno[0];
              } else {
                  this.config = configRetorno;
              }

              localStorage.setItem('configraspberry', JSON.stringify(this.config))

              this.formConfig = this.formBuilder.group({
                  intervalo_seconds: [this.config.intervalo_seconds, [Validators.required]],
                  temp_min: [this.config.temp_min, [Validators.required]],
                  temp_max: [this.config.temp_max, [Validators.required]],
                  umid_min: [this.config.umid_min, [Validators.required]],
                  umid_max: [this.config.umid_max, [Validators.required]],
                  obs: [this.config.obs, [Validators.required]],
              })
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

    submitConfig(){
        console.log(this.formConfig.value)
      this.alertConfigService.updateConfig(this.formConfig.value).then(r => {
          if(r){
              if(r.retorno == 'salvo'){
                  alert(r.retorno)
                  this.buildFormConfig()
              } else {
                  alert('erro ao salvar: ' + r.retorno)
              }
          } else {
              alert('erro ao salvar: ' + r.retorno)
          }
      })
    }


}

import { Component, OnInit } from '@angular/core';
import {ConfigService} from "../config.service";
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import {LoadingController} from "@ionic/angular";
import {Router} from "@angular/router";

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
})
export class ConfigComponent implements OnInit {
  public formConfig: FormGroup;
  public formIP: FormGroup;
  public config: any;
  public apiURL
    public scanDispositivo = false
  constructor(
      private formBuilder: FormBuilder,
      private configService: ConfigService,
      public loadingController: LoadingController,
      private router: Router
  ) {
      this.inicializar()
  }

  ngOnInit() {}

  inicializar(){
      this.apiURL = localStorage.getItem('ipraspberry')
      if(!this.apiURL){
          this.buildFormIP('configurar (192.168.0.105:5000)')
      } else {
          const vr = this.configService.validaIP(this.apiURL).then(r => console.log('no then', r))
          if(vr){
              this.buildFormIP(this.apiURL)
              this.buildFormConfig()
          }
      }
  }

  buildFormIP(ip){
      this.formIP = this.formBuilder.group({
          ip: [ip, [Validators.required]]
      })
  }

  //carregando com dados nulos para criar uma nova ocorrência
  private buildFormConfig(): void {
      this.configService.getConfig().then(configRetorno => {
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

    submitIP(){
        //'http://'+retorno.retorno+':5000'
        var splitted = this.formIP.value.ip.split(".");
        //verifica se é um número
        if(!isNaN(parseFloat(splitted[0])) && isFinite(splitted[0])){
            localStorage.setItem('ipraspberry', this.formIP.value.ip)
            this.router.navigate(['/folder/Inbox']);
        }
    }

    async presentLoading() {
        while (this.scanDispositivo){
            const loading = await this.loadingController.create({
                cssClass: 'my-custom-class',
                message: 'Procurando dispositivo na rede...',
                duration: 10000
            });
            await loading.present();

            const { role, data } = await loading.onDidDismiss();
            console.log('Loading dismissed!');
        }
    }

    async scanRede() {
        this.scanDispositivo = true
        this.presentLoading()
        const r = await this.configService.scanDispositivo()
        console.log('r', r)
        if(r){
            this.scanDispositivo = false
            this.inicializar()
        }
    }


}



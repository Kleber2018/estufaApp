import { Component, OnInit } from '@angular/core';
import {ConfigService} from "../config.service";
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import {LoadingController} from "@ionic/angular";
import {Router} from "@angular/router";
import { NetworkInterface } from '@ionic-native/network-interface/ngx';
import { splitAtColon } from '@angular/compiler/src/util';


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
    public alertaAtivado = false
  constructor(
      private formBuilder: FormBuilder,
      private configService: ConfigService,
      public loadingController: LoadingController,
      private router: Router,
      private networkInterface: NetworkInterface
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
      if(!this.apiURL){
        this.networkInterface.getWiFiIPAddress()
            .then(address => {
                console.info(`IP: ${address.ip}, Subnet: ${address.subnet}`); 
                var ipArray = address.ip.split('.')
                this.buildFormIP(ipArray[0]+'.'+ipArray[1]+'.'+ipArray[2]+'.XXX');
            })
            .catch(error => {console.error(`Unable to get IP1: ${error}`)});

        this.networkInterface.getCarrierIPAddress()
            .then(address => {
                console.info(`IP: ${address.ip}, Subnet: ${address.subnet}`); 
                var ipArray = address.ip.split('.')
                this.buildFormIP(ipArray[0]+'.'+ipArray[1]+'.'+ipArray[2]+'.XXX');
                })
            .catch(error => console.error(`Unable to get IP2: ${error}`));

        this.buildFormIP('configurar (192.168.0.105:5000)')
      } else {
          const vr = await this.configService.validaIP(this.apiURL).then(r => {console.log('no then', r); return r})
          if(vr){
              this.buildFormIP(this.apiURL)
              this.buildFormConfig()
          } else {
            localStorage.removeItem('ipraspberry')
            this.networkInterface.getWiFiIPAddress()
            .then(address => {
                console.info(`IP: ${address.ip}, Subnet: ${address.subnet}`); 
                var ipArray = address.ip.split('.')
                this.buildFormIP(ipArray[0]+'.'+ipArray[1]+'.'+ipArray[2]+'.XXX');
            })
            .catch(error => {console.error(`Unable to get IP1: ${error}`)});

        this.networkInterface.getCarrierIPAddress()
            .then(address => {
                console.info(`IP: ${address.ip}, Subnet: ${address.subnet}`); 
                var ipArray = address.ip.split('.')
                this.buildFormIP(ipArray[0]+'.'+ipArray[1]+'.'+ipArray[2]+'.XXX');
                })
            .catch(error => console.error(`Unable to get IP2: ${error}`));
          }
      }
  }

  resetarIP(){
    localStorage.removeItem('ipraspberry')
    this.inicializar()
  }

  buildFormIP(ip){
      console.log('construindo form ip', ip)
      this.formIP = this.formBuilder.group({
          ip: [ip, [Validators.required]]
      })
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
                  this.buildFormConfig()
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
        

        const r = await this.configService.scanDispositivo(this.formIP.value)
        console.log('r', r)
        if(r){
            this.scanDispositivo = false
            this.inicializar()
        }
    }

    desativarAlertas(){
        localStorage.removeItem('alertaconfig')
        this.alertaAtivado = false
    }

    ativarAlertas(){
        localStorage.setItem('alertaconfig', 'ativado')
        this.alertaAtivado = true
    }


}



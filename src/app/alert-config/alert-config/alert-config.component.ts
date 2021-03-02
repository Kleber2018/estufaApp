import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ConfigService } from 'src/app/config/config.service';
import { AlertConfigService } from '../alert-config.service';
import { Config, Modulo } from 'src/app/shared/model/config.model';
@Component({
  selector: 'app-alert-config',
  templateUrl: './alert-config.component.html',
  styleUrls: ['./alert-config.component.scss'],
})
export class AlertConfigComponent implements OnInit, OnDestroy {

    private end: Subject<boolean> = new Subject();

  public formConfig: FormGroup;
  public config: any;
  public dadosModulo : Modulo;

  constructor(
      private formBuilder: FormBuilder,
      private alertConfigService: AlertConfigService,
      private router: Router,
      private activatedRoute: ActivatedRoute,
  ) {
    //this.inicializando()

    if (this.activatedRoute.snapshot.params.id) {
        const configMod: Config = localStorage.getItem('estufaapp')
            ? JSON.parse(localStorage.getItem('estufaapp'))
            : null;
        if(configMod){
            this.dadosModulo =  configMod.modulos[this.activatedRoute.snapshot.params.id]
            this.buildFormConfig(this.dadosModulo.ip)
        }
    } 

  }
    
  ngOnInit() {}
 
  //carregando com dados nulos para criar uma nova ocorrência
  private buildFormConfig(ip: string): void {
      this.alertConfigService.getConfig(ip).then(configRetorno => {
          if(configRetorno){
              if(Array.isArray(configRetorno)){
                  this.config = configRetorno[0];
              } else {
                  this.config = configRetorno;
              }

              localStorage.setItem('configraspberry', JSON.stringify(this.config))

              this.formConfig = this.formBuilder.group({
                    etapa: ['Personalizada', [Validators.required]],
                    intervalo_seconds: [this.config.intervalo_seconds, [Validators.required]],
                    temp_min: [this.config.temp_min, [Validators.required]],
                    temp_max: [this.config.temp_max, [Validators.required]],
                    umid_min: [this.config.umid_min, [Validators.required]],
                    umid_max: [this.config.umid_max, [Validators.required]],
                    obs: [this.config.obs],
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


  private rebuildFormConfig(valores){
    this.formConfig = this.formBuilder.group({
        etapa: [valores.etapa, [Validators.required]],
        intervalo_seconds: [valores.intervalo_seconds, [Validators.required]],
        temp_min: [valores.temp_min, [Validators.required]],
        temp_max: [valores.temp_max, [Validators.required]],
        umid_min: [valores.umid_min, [Validators.required]],
        umid_max: [valores.umid_max, [Validators.required]],
        obs: [valores.obs]
  })
  }

  public etapa = ''

    escolheEtapa(etapa){
        if(etapa == 'Personalizada'){
            this.rebuildFormConfig({
                intervalo_seconds: this.config.intervalo_seconds,
                temp_min: 140,
                temp_max: 165,
                umid_min: 25,
                umid_max: 10,
                obs: this.config.obs,
                etapa: etapa
            })
        } else if(etapa == 'Secagem do Talo'){
            this.rebuildFormConfig({
                intervalo_seconds: this.config.intervalo_seconds,
                temp_min: 141,
                temp_max: 165,
                umid_min: 25,
                umid_max: 10,
                obs: this.config.obs,
                etapa: etapa
            })          
        } else if(etapa == 'Secagem da Folha'){
            this.rebuildFormConfig({
                intervalo_seconds: this.config.intervalo_seconds,
                temp_min: 121,
                temp_max: 140,
                umid_min: 25,
                umid_max: 44,
                obs: this.config.obs,
                etapa: etapa
            })
        } else if(etapa == 'Murchamento'){
            this.rebuildFormConfig({
                intervalo_seconds: this.config.intervalo_seconds,
                temp_min: 101,
                temp_max: 120,
                umid_min: 45,
                umid_max: 79,
                obs: this.config.obs,
                etapa: etapa
            })
        } else if(etapa == 'Amarelacao'){
            this.rebuildFormConfig({
                intervalo_seconds: this.config.intervalo_seconds,
                temp_min: 90,
                temp_max: 100,
                umid_min: 81,
                umid_max: 98,
                obs: this.config.obs,
                etapa: etapa
            })
        }  
    }

    submitConfig(){
        this.alertConfigService.updateConfig({
                intervalo_seconds: this.formConfig.value.intervalo_seconds,
                temp_min: this.formConfig.value.temp_min,
                temp_max: this.formConfig.value.temp_max,
                umid_min: this.formConfig.value.umid_min,
                umid_max: this.formConfig.value.umid_max,
                obs: this.formConfig.value.obs
            }, this.dadosModulo.ip, this.dadosModulo.token).then(r => {
                if(r){
                    if(r.retorno == 'salvo'){
                        alert(r.retorno)
                        this.buildFormConfig(this.dadosModulo.ip)
                    } else {
                        alert('erro ao salvar: ' + r.retorno)
                    }
                } else {
                    alert('erro ao salvar: ' + r.retorno)
                }
            })
    }


    ngOnDestroy(): void {
        console.log('onDestroy')
        this.end.next();
        this.end.complete();
    }
}

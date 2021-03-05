import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { Config, ConfigIntervalo, Modulo } from 'src/app/shared/model/config.model';
import { FolderService } from '../../folder.service';

@Component({
  selector: 'app-alert-config',
  templateUrl: './alert-config.component.html',
  styleUrls: ['./alert-config.component.scss'],
})

export class AlertConfigComponent implements OnInit, OnDestroy {

    private end: Subject<boolean> = new Subject();

    public formConfig: FormGroup;
    public configIntervalo: ConfigIntervalo;
    //@Input() dadosModulo : Modulo;
    //@Input() indexArray : number;
    @Input() IP : string;
    @Input() token : string;

    constructor(
        private formBuilder: FormBuilder,
        private folderService: FolderService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        public modalController: ModalController,
    ) { }
        
    ngOnInit() {
        console.log('teste', this.IP, 'token', this.token)
        if(this.IP){
            this.buildFormConfig(this.IP)
        }
    }
 
    //carregando com dados nulos para criar uma nova ocorrência
    private buildFormConfig(ip: string): void {
        this.folderService.getConfig(ip).then(configRetorno => {
            console.log('retornou', configRetorno)
            if(configRetorno){
                if(Array.isArray(configRetorno)){
                    this.configIntervalo = configRetorno[0];
                } else {
                    this.configIntervalo = configRetorno;
                }
                this.formConfig = this.formBuilder.group({
                    etapa: [this.configIntervalo.etapa, [Validators.required]],
                    intervalo_seconds: [this.configIntervalo.intervalo_seconds, [Validators.required]],
                    temp_min: [this.configIntervalo.temp_min, [Validators.required]],
                    temp_max: [this.configIntervalo.temp_max, [Validators.required]],
                    umid_min: [this.configIntervalo.umid_min, [Validators.required]],
                    umid_max: [this.configIntervalo.umid_max, [Validators.required]],
                    obs: [this.configIntervalo.obs],
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
                intervalo_seconds: this.configIntervalo.intervalo_seconds,
                temp_min: 140,
                temp_max: 165,
                umid_min: 25,
                umid_max: 10,
                obs: this.configIntervalo.obs,
                etapa: etapa
            })
        } else if(etapa == 'Secagem do Talo'){
            this.rebuildFormConfig({
                intervalo_seconds: this.configIntervalo.intervalo_seconds,
                temp_min: 141,
                temp_max: 165,
                umid_min: 25,
                umid_max: 10,
                obs: this.configIntervalo.obs,
                etapa: etapa
            })          
        } else if(etapa == 'Secagem da Folha'){
            this.rebuildFormConfig({
                intervalo_seconds: this.configIntervalo.intervalo_seconds,
                temp_min: 121,
                temp_max: 140,
                umid_min: 25,
                umid_max: 44,
                obs: this.configIntervalo.obs,
                etapa: etapa
            })
        } else if(etapa == 'Murchamento'){
            this.rebuildFormConfig({
                intervalo_seconds: this.configIntervalo.intervalo_seconds,
                temp_min: 101,
                temp_max: 120,
                umid_min: 45,
                umid_max: 79,
                obs: this.configIntervalo.obs,
                etapa: etapa
            })
        } else if(etapa == 'Amarelacao'){
            this.rebuildFormConfig({
                intervalo_seconds: this.configIntervalo.intervalo_seconds,
                temp_min: 90,
                temp_max: 100,
                umid_min: 81,
                umid_max: 98,
                obs: this.configIntervalo.obs,
                etapa: etapa
            })
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

    submitConfig(){
        this.folderService.updateConfig({
                etapa: this.formConfig.value.etapa,
                intervalo_seconds: this.formConfig.value.intervalo_seconds,
                temp_min: this.formConfig.value.temp_min,
                temp_max: this.formConfig.value.temp_max,
                umid_min: this.formConfig.value.umid_min,
                umid_max: this.formConfig.value.umid_max,
                obs: this.formConfig.value.obs
            }, this.IP, this.token).then(r => {
                if(r){
                    if(r.retorno == 'salvo'){
                        alert(r.retorno)
                        this.dismiss('salvo')
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

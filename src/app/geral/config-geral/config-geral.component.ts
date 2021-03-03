import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import {Router} from "@angular/router";
import { ModalController } from '@ionic/angular';


import { Config } from 'src/app/shared/model/config.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-config-geral',
  templateUrl: './config-geral.component.html',
  styleUrls: ['./config-geral.component.scss'],
})

export class ConfigGeralComponent implements OnInit, OnDestroy {

  private end: Subject<boolean> = new Subject();

  public vrAlertas: boolean = true
  public vrVibrar: boolean = true

  constructor(
      private formBuilder: FormBuilder,
      private router: Router,
      public modalController: ModalController
  ) {
  }

  ngOnInit() {}

  selecionaCheckboxVibrar(vrAlertaVibrar){
    this.vrVibrar= !this.vrVibrar
    if(vrAlertaVibrar){

      console.log('desativando vibrar')
    } else {
      console.log('ativar vibrar')
    }
  }

  selecionaCheckboxAlertas(vrAlertas){
    this.vrAlertas= !this.vrAlertas
    if(vrAlertas){
        console.log('desativando alerta sonoro')
    } else {
      console.log('ativando alerta sonoro')
    }
  }

  ngOnDestroy(): void {
    console.log('onDestroy')
    this.end.next();
    this.end.complete();
  }


}



import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { PoliticsComponent } from '../politics/politics.component';
import { TermosComponent } from '../termos/termos.component';

@Component({
  selector: 'app-sobre',
  templateUrl: './sobre.component.html',
  styleUrls: ['./sobre.component.scss'],
})
export class SobreComponent implements OnInit, OnDestroy {
  private end: Subject<boolean> = new Subject();
  
  constructor(public modalController: ModalController) { }


  ngOnInit() {}

  async abrirPoliticas(){
    const modal = await this.modalController.create({
      component: PoliticsComponent
    });
    modal.present();
    modal.onWillDismiss().then(data=>{
        console.log('modal', data)
    })
  }


  async abrirTermos(){
    const modal = await this.modalController.create({
      component: TermosComponent
    });
    modal.present();
    modal.onWillDismiss().then(data=>{
        console.log('modal', data)
    })
  }

  ngOnDestroy(): void {
    console.log('onDestroy')
    this.end.next();
    this.end.complete();
  } 

}

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-termos',
  templateUrl: './termos.component.html',
  styleUrls: ['./termos.component.scss'],
})
export class TermosComponent implements OnInit, OnDestroy {

  private end: Subject<boolean> = new Subject();

  constructor(public modalController: ModalController) {   }

  ngOnInit() {
  }

  dismiss() {
    this.modalController.dismiss();
    this.ngOnDestroy()
  }

  ngOnDestroy(): void {
    this.end.next();
    this.end.complete();
  }
}

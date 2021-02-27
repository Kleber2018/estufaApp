import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { Subject } from 'rxjs';
import { Modulo } from 'src/app/shared/model/config.model';




@Component({
  selector: 'app-card-estufa',
  templateUrl: './card-estufa.component.html',
  styleUrls: ['./card-estufa.component.css']
})
export class CardEstufaComponent implements OnInit, OnDestroy {

  private end: Subject<boolean> = new Subject();

  @Input() public dadosModulo : Modulo;
  public medicao = {
    temp: 0,
    temp_status: '',//baixo, alto
    umid: 0,
    umid_status: '', //baixo, alto
    createdAt: ''
  }

  constructor( ) { 
   
  }

  ngOnInit(): void {
    console.log('dados dentro', this.dadosModulo)

   }


  ngOnDestroy(): void {
    this.end.next();
    this.end.complete();
  }
}

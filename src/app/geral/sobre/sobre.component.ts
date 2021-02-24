import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-sobre',
  templateUrl: './sobre.component.html',
  styleUrls: ['./sobre.component.scss'],
})
export class SobreComponent implements OnInit, OnDestroy {
  private end: Subject<boolean> = new Subject();
  
  constructor() { }


  ngOnInit() {}

  ngOnDestroy(): void {
    console.log('onDestroy')
    this.end.next();
    this.end.complete();
  } 

}

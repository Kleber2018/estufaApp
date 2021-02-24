import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
})
export class HelpComponent implements OnInit, OnDestroy {
  private end: Subject<boolean> = new Subject();
  
  constructor() { }

  ngOnInit() {}

  ngOnDestroy(): void {
    console.log('onDestroy')
    this.end.next();
    this.end.complete();
}

}

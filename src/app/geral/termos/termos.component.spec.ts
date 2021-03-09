import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TermosComponent } from './termos.component';

describe('TermosComponent', () => {
  let component: TermosComponent;
  let fixture: ComponentFixture<TermosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermosComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TermosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

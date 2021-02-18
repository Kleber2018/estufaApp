import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalScanPage } from './modal-scan.page';

describe('ModalScanPage', () => {
  let component: ModalScanPage;
  let fixture: ComponentFixture<ModalScanPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalScanPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalScanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

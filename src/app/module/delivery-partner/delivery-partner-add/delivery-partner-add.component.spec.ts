import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryPartnerAddComponent } from './delivery-partner-add.component';

describe('DeliveryPartnerAddComponent', () => {
  let component: DeliveryPartnerAddComponent;
  let fixture: ComponentFixture<DeliveryPartnerAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryPartnerAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryPartnerAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

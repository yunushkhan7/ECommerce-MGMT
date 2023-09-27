import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryPartnerListComponent } from './delivery-partner-list.component';

describe('DeliveryPartnerListComponent', () => {
  let component: DeliveryPartnerListComponent;
  let fixture: ComponentFixture<DeliveryPartnerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryPartnerListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryPartnerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorsSupplierAddComponent } from './vendors-supplier-add.component';

describe('VendorsSupplierAddComponent', () => {
  let component: VendorsSupplierAddComponent;
  let fixture: ComponentFixture<VendorsSupplierAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorsSupplierAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorsSupplierAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

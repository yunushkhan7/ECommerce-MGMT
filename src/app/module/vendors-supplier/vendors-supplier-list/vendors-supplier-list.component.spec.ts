import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorsSupplierListComponent } from './vendors-supplier-list.component';

describe('VendorsSupplierListComponent', () => {
  let component: VendorsSupplierListComponent;
  let fixture: ComponentFixture<VendorsSupplierListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorsSupplierListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorsSupplierListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcurmenetVendorListComponent } from './procurmenet-vendor-list.component';

describe('ProcurmenetVendorListComponent', () => {
  let component: ProcurmenetVendorListComponent;
  let fixture: ComponentFixture<ProcurmenetVendorListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcurmenetVendorListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcurmenetVendorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

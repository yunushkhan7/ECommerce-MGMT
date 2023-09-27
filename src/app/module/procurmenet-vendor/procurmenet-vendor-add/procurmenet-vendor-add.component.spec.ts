import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcurmenetVendorAddComponent } from './procurmenet-vendor-add.component';

describe('ProcurmenetVendorAddComponent', () => {
  let component: ProcurmenetVendorAddComponent;
  let fixture: ComponentFixture<ProcurmenetVendorAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcurmenetVendorAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcurmenetVendorAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

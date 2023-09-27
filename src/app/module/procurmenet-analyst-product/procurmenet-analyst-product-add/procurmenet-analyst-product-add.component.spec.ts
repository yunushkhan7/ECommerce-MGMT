import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcurmenetAnalystProductAddComponent } from './procurmenet-analyst-product-add.component';

describe('ProcurmenetAnalystProductAddComponent', () => {
  let component: ProcurmenetAnalystProductAddComponent;
  let fixture: ComponentFixture<ProcurmenetAnalystProductAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcurmenetAnalystProductAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcurmenetAnalystProductAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

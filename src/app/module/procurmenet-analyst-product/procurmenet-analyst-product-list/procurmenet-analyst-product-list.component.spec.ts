import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcurmenetAnalystProductListComponent } from './procurmenet-analyst-product-list.component';

describe('ProcurmenetAnalystProductListComponent', () => {
  let component: ProcurmenetAnalystProductListComponent;
  let fixture: ComponentFixture<ProcurmenetAnalystProductListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcurmenetAnalystProductListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcurmenetAnalystProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

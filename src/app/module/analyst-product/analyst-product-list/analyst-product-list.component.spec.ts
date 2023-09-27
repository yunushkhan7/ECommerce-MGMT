import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalystProductListComponent } from './analyst-product-list.component';

describe('AnalystProductListComponent', () => {
  let component: AnalystProductListComponent;
  let fixture: ComponentFixture<AnalystProductListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalystProductListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalystProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesOrderAddComponent } from './sales-order-add.component';

describe('SalesOrderAddComponent', () => {
  let component: SalesOrderAddComponent;
  let fixture: ComponentFixture<SalesOrderAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesOrderAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesOrderAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

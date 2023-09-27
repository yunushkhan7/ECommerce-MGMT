import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalystProductAddComponent } from './analyst-product-add.component';

describe('AnalystProductAddComponent', () => {
  let component: AnalystProductAddComponent;
  let fixture: ComponentFixture<AnalystProductAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalystProductAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalystProductAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

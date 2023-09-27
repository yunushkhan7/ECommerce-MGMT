import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingAddComponent } from './marketing-add.component';

describe('MarketingAddComponent', () => {
  let component: MarketingAddComponent;
  let fixture: ComponentFixture<MarketingAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketingAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarketingAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskManagmentAddComponent } from './task-managment-add.component';

describe('TaskManagmentAddComponent', () => {
  let component: TaskManagmentAddComponent;
  let fixture: ComponentFixture<TaskManagmentAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskManagmentAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskManagmentAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

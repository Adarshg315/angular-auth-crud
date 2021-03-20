import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEmployeesComponent } from './edit-emp.component';

describe('EditEmployeesComponent', () => {
  let component: EditEmployeesComponent;
  let fixture: ComponentFixture<EditEmployeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditEmployeesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

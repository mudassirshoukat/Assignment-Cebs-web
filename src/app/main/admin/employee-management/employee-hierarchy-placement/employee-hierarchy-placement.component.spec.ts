import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeHierarchyPlacementComponent } from './employee-hierarchy-placement.component';

describe('EmployeeHierarchyPlacementComponent', () => {
  let component: EmployeeHierarchyPlacementComponent;
  let fixture: ComponentFixture<EmployeeHierarchyPlacementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeHierarchyPlacementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeHierarchyPlacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

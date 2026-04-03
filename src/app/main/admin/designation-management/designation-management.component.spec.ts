import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignationManagementComponent } from './designation-management.component';

describe('DesignationManagementComponent', () => {
  let component: DesignationManagementComponent;
  let fixture: ComponentFixture<DesignationManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignationManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesignationManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

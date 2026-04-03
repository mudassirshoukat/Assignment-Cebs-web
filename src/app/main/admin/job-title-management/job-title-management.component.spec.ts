import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobTitleManagementComponent } from './job-title-management.component';

describe('JobTitleManagementComponent', () => {
  let component: JobTitleManagementComponent;
  let fixture: ComponentFixture<JobTitleManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobTitleManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobTitleManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

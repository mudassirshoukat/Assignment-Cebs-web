import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDetailDemoComponent } from './project-detail-demo.component';

describe('ProjectDetailDemoComponent', () => {
  let component: ProjectDetailDemoComponent;
  let fixture: ComponentFixture<ProjectDetailDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectDetailDemoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectDetailDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

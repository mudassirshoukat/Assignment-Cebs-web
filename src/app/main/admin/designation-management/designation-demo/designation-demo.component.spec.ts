import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignationDemoComponent } from './designation-demo.component';

describe('DesignationDemoComponent', () => {
  let component: DesignationDemoComponent;
  let fixture: ComponentFixture<DesignationDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignationDemoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DesignationDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

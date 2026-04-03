import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DepartmentDetailDemoComponent } from './department-detail-demo.component';


describe('DepartmentDetailDemoComponent', () => {
  let component: DepartmentDetailDemoComponent;
  let fixture: ComponentFixture<DepartmentDetailDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentDetailDemoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartmentDetailDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

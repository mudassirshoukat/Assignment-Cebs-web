import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DepartmentCreateDialogComponent } from './department-create-dialog.component';


describe('DepartmentCreateDialogComponent', () => {
  let component: DepartmentCreateDialogComponent;
  let fixture: ComponentFixture<DepartmentCreateDialogComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentCreateDialogComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DepartmentCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

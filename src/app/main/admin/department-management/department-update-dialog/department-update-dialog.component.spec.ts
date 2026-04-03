import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DepartmentUpdateDialogComponent } from './department-update-dialog.component';

describe('DepartmentUpdateDialogComponent', () => {
  let component: DepartmentUpdateDialogComponent;
  let fixture: ComponentFixture<DepartmentUpdateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DepartmentUpdateDialogComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DepartmentUpdateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DesignationCreateDialogComponent } from './designation-create-dialog.component';


describe('DesignationCreateDialogComponent', () => {
  let component: DesignationCreateDialogComponent;
  let fixture: ComponentFixture<DesignationCreateDialogComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignationCreateDialogComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DesignationCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

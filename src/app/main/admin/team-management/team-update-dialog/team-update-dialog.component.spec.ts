import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeamUpdateDialogComponent } from './team-update-dialog.component';

describe('TeamUpdateDialogComponent', () => {
  let component: TeamUpdateDialogComponent;
  let fixture: ComponentFixture<TeamUpdateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamUpdateDialogComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TeamUpdateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeamDetailDemoComponent } from './team-detail-demo.component';


describe('TeamDetailComponent', () => {
  let component: TeamDetailDemoComponent;
  let fixture: ComponentFixture<TeamDetailDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamDetailDemoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamDetailDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

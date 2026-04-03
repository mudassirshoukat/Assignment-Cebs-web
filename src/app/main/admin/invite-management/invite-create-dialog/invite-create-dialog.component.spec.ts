import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteCreateDialogComponent } from './invite-create-dialog.component';

describe('InviteCreateDialogComponent', () => {
  let component: InviteCreateDialogComponent;
  let fixture: ComponentFixture<InviteCreateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InviteCreateDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InviteCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

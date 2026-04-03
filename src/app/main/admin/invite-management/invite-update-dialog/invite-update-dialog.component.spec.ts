import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteUpdateDialogComponent } from './invite-update-dialog.component';

describe('InviteUpdateDialogComponent', () => {
  let component: InviteUpdateDialogComponent;
  let fixture: ComponentFixture<InviteUpdateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InviteUpdateDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InviteUpdateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

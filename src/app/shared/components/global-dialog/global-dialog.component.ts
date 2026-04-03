import { Component, Input, OnInit } from '@angular/core';
import { DialogService, DialogData, DialogType } from '../../services/dialog.service';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-global-dialog',
  standalone: true,
  imports: [CommonModule, DialogModule, ButtonModule],
  templateUrl: './global-dialog.component.html',
  styleUrls: ['./global-dialog.component.scss'],
})
export class GlobalDialogComponent implements OnInit {
  dialog: DialogData = { visible: false, type: 'custom' };
  @Input() visible = false;
  @Input() title = '';
  @Input() message = '';
  @Input() errors: any[] = [];
  @Input() type: DialogType = 'custom';
  constructor(private dialogService: DialogService) {}

  ngOnInit() {
    this.dialogService.dialog$.subscribe((data) => {
      this.dialog = data;
    });
  }

  close() {
    this.dialogService.close();
    if (this.dialog.cancelCallback) this.dialog.cancelCallback();
  }

  confirm() {
    if (this.dialog.confirmCallback) this.dialog.confirmCallback();
    this.dialogService.close();
  }
}

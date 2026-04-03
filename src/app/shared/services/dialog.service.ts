import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type DialogType = 'error' | 'success' | 'warning' | 'confirmation' | 'session-expire' | 'custom';

export interface DialogData {
  visible: boolean;
  type: DialogType;
  title?: string;
  message?: string;
  errors?: string[];
  confirmCallback?: () => void;
  cancelCallback?: () => void;
}

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private dialogSubject = new BehaviorSubject<DialogData>({ visible: false, type: 'custom' });
  dialog$ = this.dialogSubject.asObservable();

  open(dialogData: Partial<DialogData>) {
    this.dialogSubject.next({ ...this.dialogSubject.value, ...dialogData, visible: true });
  }

  close() {
    const current = this.dialogSubject.value;
    this.dialogSubject.next({ ...current, visible: false });
  }

  showError(title: string, message: string, errors?: string[]) {
    this.open({ type: 'error', title, message, errors });
  }

  showSuccess(title: string, message: string) {
    this.open({ type: 'success', title, message });
  }

  showWarning(title: string, message: string) {
    this.open({ type: 'warning', title, message });
  }

  showSessionExpire() {
    this.open({
      type: 'session-expire',
      title: 'Session Expired',
      message: 'Your session has expired. Please log in again.',
    });
  }

  showConfirmation(
    title: string,
    message: string,
    confirmCallback: () => void,
    cancelCallback?: () => void
  ) {
    this.open({ type: 'confirmation', title, message, confirmCallback, cancelCallback });
  }
}

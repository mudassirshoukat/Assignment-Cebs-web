import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppNotification } from '../../core/services/infrastructure/notification.service';

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


  /** Custom method for in-app notifications */
 showNotificationDialog(notification: AppNotification) {
  // Prepare HTML for the dialog
  const htmlMessage = `
    <h2>In-App Notification</h2>
    <p>Dear ${notification.customerName},</p>
    <p>You have a new in-app notification regarding your order <b>#${notification.orderPublicId}</b>.</p>
    <p>Status: <b>${notification.status}</b></p>
    <p>Order Action Time: <b>${new Date(notification.orderActionTime).toLocaleString()}</b></p>
    <p>Notification Sent At: <b>${new Date(notification.notificationSentAt).toLocaleString()}</b></p>
    <p>Time since order change: <b>${notification.durationSeconds.toFixed(1)} seconds</b></p>
    <p>Thank you!</p>
  `;

  this.open({
    type: 'custom',           // Important: custom type will render in your updated global dialog
    title: 'In-App Notification',
    message: htmlMessage
  });
}
  private formatDate(date: string | Date): string {
    return new Date(date).toLocaleString();
  }
}

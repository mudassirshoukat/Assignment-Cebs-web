import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BehaviorSubject } from 'rxjs';
import { DialogService } from '../../../shared/services/dialog.service';
import { AuditableBaseModel } from '../../models/_base/base.model';

export interface AppNotification extends AuditableBaseModel{
  customerId: string;
  orderId: string;
  orderPublicId: string;
  customerName: string;
  message: string;
  orderStatus: string;
  orderActionTime: string;
  notificationSentAt: string;
  durationSeconds: number;
  isRead?: boolean;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {

  private notificationsSubject = new BehaviorSubject<AppNotification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  private unreadCountSubject = new BehaviorSubject<number>(0);
  unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(
    private messageService: MessageService,
    private dialogService: DialogService) { }

  handleIncomingNotification(data: AppNotification) {
    const current = this.notificationsSubject.value;

    const updated = [{ ...data, isRead: false }, ...current];

    this.notificationsSubject.next(updated);

    this.unreadCountSubject.next(
      updated.filter(x => !x.isRead).length
    );

    this.showNotificationUI(data);
  }

  markAsRead(notification: AppNotification) {
    notification.isRead = true;

    const updated = [...this.notificationsSubject.value];
    this.notificationsSubject.next(updated);

    this.unreadCountSubject.next(
      updated.filter(x => !x.isRead).length
    );
  }

private showNotificationUI(notification: AppNotification) {
  // Toast
  this.messageService.add({
    severity: 'info',
    summary: 'New Notification',
    detail: notification.message
  });

  // Dialog
  this.dialogService.showNotificationDialog(notification);
}
}
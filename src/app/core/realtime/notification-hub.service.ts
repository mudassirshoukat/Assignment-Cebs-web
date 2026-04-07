import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { NotificationService } from '../services/infrastructure/notification.service';
import { environment } from '../../../environments/environment';
@Injectable({ providedIn: 'root' })
export class NotificationHubService {
    private hubConnection!: signalR.HubConnection;
    NOTIFICATION_HUB_URL = environment.notificationsHubUrl;

    constructor(private notificationService: NotificationService) { }

    startConnection(token: string) {
        // 🛡️ Guard: Don't start if already connected or connecting
        if (this.hubConnection?.state === signalR.HubConnectionState.Connected || 
            this.hubConnection?.state === signalR.HubConnectionState.Connecting) {
            console.log('📡 SignalR is already active. Skipping start.');
            return;
        }

        console.log('🚀 Starting SignalR connection...');
        
        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(this.NOTIFICATION_HUB_URL, {
                accessTokenFactory: () => token
            })
            .withAutomaticReconnect()
            .build();

        // Standard lifecycle logs...
        this.hubConnection.onclose((error) => console.warn('❌ SignalR closed', error));

        this.hubConnection.start()
            .then(() => {
                console.log('✅ SignalR connected');
                this.registerListeners();
            })
            .catch(err => console.error('❌ SignalR failed:', err));
    }

    // 🛑 NEW: Stop Connection Method
    stopConnection() {
        if (this.hubConnection) {
            this.hubConnection.stop()
                .then(() => console.log('🔌 SignalR Connection Stopped Safely'))
                .catch(err => console.error('❌ Error stopping SignalR:', err));
        }
    }

    private registerListeners() {
        // Clear existing listeners first to prevent duplicates on reconnect
        this.hubConnection.off('ReceiveNotification'); 

        this.hubConnection.on('ReceiveNotification', (data) => {
            console.log('📩 Received notification:', data);
            this.notificationService.handleIncomingNotification(data);
        });
    }
}
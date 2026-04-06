import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { NotificationService } from '../services/infrastructure/notification.service';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NotificationHubService {
    private hubConnection!: signalR.HubConnection;
    NOTIFICATION_HUB_URL = environment.notificationsHubUrl; // Get base URL from environment

    constructor(private notificationService: NotificationService) { }
    startConnection(token: string) {

        console.log('🚀 Starting SignalR connection...');
        console.log('🔗 Hub URL:', this.NOTIFICATION_HUB_URL);
        console.log('🔐 Token exists:', !!token);

        this.hubConnection = new signalR.HubConnectionBuilder()
            .withUrl(this.NOTIFICATION_HUB_URL, {
                accessTokenFactory: () => {
                    console.log('📡 Sending access token for SignalR');
                    return token;
                }
            })
            .withAutomaticReconnect()
            .build();

        // 🔥 Connection lifecycle logs
        this.hubConnection.onclose((error) => {
            console.warn('❌ SignalR connection closed', error);
        });

        this.hubConnection.onreconnecting((error) => {
            console.warn('⚠️ SignalR reconnecting...', error);
        });

        this.hubConnection.onreconnected((connectionId) => {
            console.log('✅ SignalR reconnected. ConnectionId:', connectionId);
        });

        // 🔥 Start connection
        this.hubConnection.start()
            .then(() => {
                console.log('✅ SignalR connected successfully');
                console.log('🆔 Connection ID:', this.hubConnection.connectionId);

                this.registerListeners();
            })
            .catch(err => {
                console.error('❌ SignalR connection failed:', err);
            });
    }

    private registerListeners() {
        this.hubConnection.on('ReceiveNotification', (data) => {
            console.log('📩 Received notification:', data);
            this.notificationService.handleIncomingNotification(data);
        });
    }

}
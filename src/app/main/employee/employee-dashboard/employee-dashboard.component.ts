import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { Table, TableModule } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs/operators';
import { OrderService } from '../../../core/services/domain/order.service';
import { UserService } from '../../../core/services/domain/user.service';
import { OrderResponseModel } from '../../../core/models/order/order-response.model';
import { OrderStatusEnum } from '../../../core/enums/orders/order-status.enum';

// --- Primeng Imports (Keep all original ones) ---
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Card } from 'primeng/card';
import { MenuModule } from 'primeng/menu';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TooltipModule } from 'primeng/tooltip';
import { UserResponseModel } from '../../../core/models/user/user-response.model';
import { CreateOrderRequestModel } from '../../../core/models/order/requests/create-order-request.model';
import { AppDatePipe } from "../../../shared/pipes/app-date.pipe";
import { AppDateTimePipe } from "../../../shared/pipes/app-datetime.pipe";

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    TooltipModule,
    TableModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    ToastModule,
    ToolbarModule,
    RatingModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    RadioButtonModule,
    InputNumberModule,
    DialogModule,
    TagModule,
    InputIconModule,
    IconFieldModule,
    Card,
    MenuModule,
    SplitButtonModule,
    AppDateTimePipe
],
  templateUrl: './employee-dashboard.component.html',
  styleUrl: './employee-dashboard.component.scss'
})


export class EmployeeDashboardComponent implements OnInit {
  @ViewChild('dt') dt!: Table;

  // Signals
  orders = signal<OrderResponseModel[]>([]);
  isLoading = signal(false);
  user: UserResponseModel | null = null;

  constructor(
    public orderService: OrderService,
    private userService: UserService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadUser();
    this.loadOrders();
  }

  /** Load logged-in user info */
  loadUser() {
    this.userService.getMyInfo().subscribe({
      next: (res) => (this.user = res),
      error: (err) => console.error('Failed to load user info', err),
    });
  }

  /** Load orders with pagination */
  loadOrders() {
    this.isLoading.set(true);

    this.orderService
      .getMyOrders()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (res) => this.orders.set(res.items),
        error: (err) =>
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load orders',
          }),
      });
  }

  /** Handle table page change */
  onPageChange(event: any) {
    const pageNumber = Math.floor(event.first / event.rows) + 1;
    this.orderService.pageNumber.set(pageNumber);
    this.orderService.pageSize.set(event.rows);
    this.loadOrders();
  }

  /** Update order status based on current status */
  createNewOrder() {
    this.isLoading.set(true);
const request : CreateOrderRequestModel = {  };

    this.orderService
      .create(request)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Updated',
            detail: `New Order created`,
          });
          this.loadOrders();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create order',
          });
        },
      });
  }

 
  /** Convert enum to text */
  getStatusText(status: number): string {
    switch (status) {
      case 0:
        return 'Placed';
      case 1:
        return 'Shipped';
      case 2:
        return 'Delivered';
      default:
        return 'Unknown';
    }
  }

  /** Convert enum to PrimeNG tag severity */
  getStatusSeverity(status: number): string {
    switch (status) {
      case 0:
        return 'warning';  // Placed
      case 1:
        return 'info';     // Shipped
      case 2:
        return 'success';  // Delivered
      default:
        return 'secondary';
    }
  }
}
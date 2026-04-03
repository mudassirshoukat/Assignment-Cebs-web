import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { EmployeeWithTitlesResponseModel } from '../../../core/models/employee/employee-with-titles-response.model';
import { Table, TableModule } from 'primeng/table';
import { EmployeeService } from '../../../core/services/domain/employee.service';
import { finalize } from 'rxjs';
import { GetEmployeeListQuery } from '../../../core/models/employee/request/employee-list-query.model';
import { AppDatePipe } from "../../../shared/pipes/app-date.pipe";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TooltipModule } from 'primeng/tooltip';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { MenuItem, MessageService } from 'primeng/api';
import { EmployeeHierarchyPlacementComponent } from "./employee-hierarchy-placement/employee-hierarchy-placement.component";
import { ButtonModule } from 'primeng/button'; // Add this
import { MenuModule } from 'primeng/menu';     // Change this from 'Menu'

@Component({
  standalone: true,
  selector: 'app-employee-management',
  templateUrl: './employee-management.component.html',
  styleUrl: './employee-management.component.scss',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ToolbarModule,
    ToggleSwitchModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    TooltipModule,
    AppDatePipe,
    EmployeeHierarchyPlacementComponent,
    ButtonModule, // Added
    MenuModule    // Changed from Menu
]
})


export class EmployeeManagementComponent implements OnInit {

  employees = signal<EmployeeWithTitlesResponseModel[]>([]);
  isLoading = signal(false);
showOrphansOnly = signal(false);

  // For hierarchy placement dialog
  selectedEmployee: EmployeeWithTitlesResponseModel | null = null;
  showHierarchyDialog = false;




  @ViewChild('dt') dt!: Table;

  constructor(
    public employeeService: EmployeeService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.isLoading.set(true);

    const query: GetEmployeeListQuery = {
      isOrphen: this.showOrphansOnly()?this.showOrphansOnly():undefined
    };

    this.employeeService
      .getWithTitlesList(query)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (res) => {
          this.employees.set(res.items);
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load employees',
            life: 3000
          });
        }
      });
  }

  onPageChange(event: any) {
    const pageNumber = Math.floor(event.first / event.rows) + 1;
    this.employeeService.pageNumber.set(pageNumber);
    this.employeeService.pageSize.set(event.rows);
    this.loadEmployees();
  }

toggleOrphans(value: boolean) {
  this.showOrphansOnly.set(value);
  this.employeeService.pageNumber.set(1);
  this.loadEmployees();
}

  onGlobalFilter(table: Table, event: Event) {
    const value = (event.target as HTMLInputElement).value;
    table.filterGlobal(value, 'contains');
  }

  // Hierarchy Placement Methods
  openHierarchyDialog(employee: EmployeeWithTitlesResponseModel) {
    this.selectedEmployee = employee;
    this.showHierarchyDialog = true;
  }

  onPlacementComplete(placementData: any) {
    console.log('Employee placed in hierarchy:', placementData);
    
    // Reload employees to reflect the change
    this.loadEmployees();
    
    // Show success message
    // this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Employee placed in hierarchy successfully' });
  }

  // Other Actions
  viewEmployeeDetails(employee: EmployeeWithTitlesResponseModel) {
    console.log('View employee details:', employee.id);
    // Navigate to employee detail page or open modal
    // this.router.navigate(['/admin/employees', employee.id]);
  }

  getEmployeeMenuItems(employee: EmployeeWithTitlesResponseModel): MenuItem[] {
    const items: MenuItem[] = [
      {
        label: 'Edit Employee',
        icon: 'pi pi-pencil',
        command: () => this.editEmployee(employee)
      },
      {
        label: 'Send Message',
        icon: 'pi pi-envelope',
        command: () => this.sendMessage(employee)
      },
      {
        label: 'View Performance',
        icon: 'pi pi-chart-bar',
        command: () => this.viewPerformance(employee)
      }
    ];

    if (employee.isOrphen) {
      items.unshift({
        label: 'Place in Hierarchy',
        icon: 'pi pi-sitemap',
        command: () => this.openHierarchyDialog(employee)
      });
    }

    items.push({ separator: true });

    items.push({
      label: employee.isActive ? 'Deactivate' : 'Activate',
      icon: employee.isActive ? 'pi pi-times' : 'pi pi-check',
      command: () => this.toggleEmployeeStatus(employee)
    });

    return items;
  }

  editEmployee(employee: EmployeeWithTitlesResponseModel) {
    console.log('Edit employee:', employee.id);
  }

  sendMessage(employee: EmployeeWithTitlesResponseModel) {
    console.log('Send message to:', employee.email);
  }

  viewPerformance(employee: EmployeeWithTitlesResponseModel) {
    console.log('View performance for:', employee.fullName);
  }
  toggleEmployeeStatus(employee: EmployeeWithTitlesResponseModel) {
    console.log('Toggle status for:', employee.fullName);
  }
}

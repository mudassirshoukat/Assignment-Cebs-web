import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GlobalDialogComponent } from './shared/components/global-dialog/global-dialog.component';
import { DialogService } from './shared/services/dialog.service';
import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
import { Toast } from "primeng/toast";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [RouterModule, CommonModule, GlobalDialogComponent, NgIf, AsyncPipe, Toast]
})
export class AppComponent {
  constructor(public dialogService: DialogService) {}
}

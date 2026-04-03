import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { EmployeeNodeModel, EmployeeOrgNode } from '../../../../../core/models/employee/employee-with-titles-response.model';


@Component({
  selector: 'app-hierarchy-node',
  standalone: true,
  imports: [
    CommonModule,
    AvatarModule,
    TagModule,
    ButtonModule,
    TooltipModule
  ],
  template: `
    <div class="tree-node" [class.selected]="selectedNode?.key === node.key">
      <div class="node-content" (click)="onSelect.emit({node, event: $event})">
        <div class="node-indent" [style.width.px]="level * 32"></div>
        
        <div class="node-toggle" *ngIf="node.data?.hasDirectReports" (click)="onToggle.emit({node, event: $event})">
          <i [class]="isExpanded ? 'pi pi-chevron-down' : 'pi pi-chevron-right'"></i>
        </div>
        <div class="node-toggle-placeholder" *ngIf="!node.data?.hasDirectReports"></div>
        
        <div class="node-avatar">
          <p-avatar 
            [label]="node.data?.firstName?.[0]" 
            shape="circle" 
            size="normal"
            [style]="{'background-color': getAvatarColor(node.data?.designationRank!), 'color': 'white'}">
          </p-avatar>
        </div>
        
        <div class="node-details">
          <div class="node-name-row">
            <span class="node-name">{{ node.label }}</span>
            <p-tag 
              [value]="node.data?.designationName" 
              severity="info" 
              styleClass="node-tag">
            </p-tag>
          </div>
          <div class="node-title" *ngIf="getEmployeeTitle(node.data!) as title">
            {{ title }}
          </div>
        </div>
      </div>

      <!-- Children nodes (recursive) -->
      <div class="node-children" *ngIf="isExpanded && node.children?.length">
        <app-hierarchy-node 
          *ngFor="let child of node.children" 
          [node]="child" 
          [level]="level + 1"
          [expandedNodes]="expandedNodes"
          [selectedNode]="selectedNode"
          (onToggle)="onToggle.emit($event)"
          (onSelect)="onSelect.emit($event)">
        </app-hierarchy-node>
      </div>
    </div>
  `,
  styles: [`
    .tree-node {
      position: relative;
      user-select: none;
      
      .node-content {
        display: flex;
        align-items: center;
        padding: 0.5rem;
        margin: 2px 0;
        border-radius: 6px;
        cursor: pointer;
        transition: background-color 0.2s;
        
        &:hover {
          background-color: #f8f9fa;
        }
      }
      
      &.selected .node-content {
        background-color: #e6f2ff;
      }
      
      .node-indent {
        flex-shrink: 0;
      }
      
      .node-toggle, .node-toggle-placeholder {
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        margin-right: 4px;
      }
      
      .node-toggle {
        cursor: pointer;
        color: #6c757d;
        border-radius: 4px;
        
        &:hover {
          background-color: #e9ecef;
        }
      }
      
      .node-avatar {
        flex-shrink: 0;
        margin-right: 12px;
      }
      
      .node-details {
        flex: 1;
        min-width: 0;
        
        .node-name-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          
          .node-name {
            font-weight: 500;
            font-size: 0.95rem;
          }
          
          .node-tag {
            font-size: 0.7rem;
          }
        }
        
        .node-title {
          font-size: 0.8rem;
          color: #6c757d;
          margin-top: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 300px;
        }
      }
    }
  `]
})
export class HierarchyNodeComponent {
  @Input() node!: EmployeeOrgNode;
  @Input() level: number = 0;
  @Input() expandedNodes = new Set<string>();
  @Input() selectedNode: EmployeeOrgNode | null = null;
  
  @Output() onToggle = new EventEmitter<{node: EmployeeOrgNode, event: Event}>();
  @Output() onSelect = new EventEmitter<{node: EmployeeOrgNode, event: Event}>();

  get isExpanded(): boolean {
    return this.expandedNodes.has(this.node.key!);
  }

  getEmployeeTitle(data: EmployeeNodeModel): string {
    if (!data) return '';
    
    const parts: string[] = [];
    
    if (data.jobTitleName) {
      parts.push(data.jobTitleName);
    }
    
    if (data.departmentName) {
      parts.push(data.departmentName);
    }
    
    return parts.length > 0 ? parts.join(' · ') : '';
  }

  getAvatarColor(rank: number): string {
    if (rank <= 3) return '#dc3545';      // Executive - Red
    if (rank <= 6) return '#fd7e14';      // Management - Orange
    if (rank <= 8) return '#0d6efd';      // Senior/Lead - Blue
    return '#198754';                      // Individual - Green
  }
}
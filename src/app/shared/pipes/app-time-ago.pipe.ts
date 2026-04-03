import { NgModule, Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({ name: 'appTimeAgo' })
export class AppTimeAgoPipe implements PipeTransform {
  transform(value?: string): string {
    if (!value) return 'N/A';
    return moment.utc(value).local().fromNow(); // e.g., "2 days ago"
  }
}
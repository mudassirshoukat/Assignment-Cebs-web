import { NgModule, Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({ name: 'appDate' })
export class AppDatePipe implements PipeTransform {
  transform(value?: string): string {
    if (!value) return 'N/A';
    return moment.utc(value).local().format('MMM DD YYYY'); // Convert UTC to local
  }
}
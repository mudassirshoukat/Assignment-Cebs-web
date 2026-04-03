import { NgModule, Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({ name: 'appDateTime' })
export class AppDateTimePipe implements PipeTransform {
  transform(value?: string): string {
    if (!value) return 'N/A';
    return moment.utc(value).local().format('MMM DD YYYY hh:mm A'); // Local time
  }
}
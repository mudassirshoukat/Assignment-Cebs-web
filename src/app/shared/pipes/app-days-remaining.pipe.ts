import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({ name: 'appDaysRemaining' })
export class AppDaysRemainingPipe implements PipeTransform {
  transform(endDate?: string): number {
    if (!endDate) return 0;

    const today = moment().startOf('day');
    const end = moment.utc(endDate).local().startOf('day');
    const diff = end.diff(today, 'days');

    return Math.max(0, diff);
  }
}

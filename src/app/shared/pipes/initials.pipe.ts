import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'initials',
  standalone: true
})
export class InitialsPipe implements PipeTransform {
  transform(fullName: string): string {
    if (!fullName?.trim()) {
      return '';
    }

    const parts = fullName
      .trim()
      .split(/\s+/)
      .filter(p => p.length > 0);

    if (parts.length === 1) {
      return parts[0][0].toUpperCase();
    }

    return (
      parts[0][0] + parts[parts.length - 1][0]
    ).toUpperCase();
  }
}

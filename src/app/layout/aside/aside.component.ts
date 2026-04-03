// Angular import
import { Component, output } from '@angular/core';
import { RouterModule } from '@angular/router';

// project import

import { AsideContentComponent } from './aside-content/aside-content.component';

@Component({
    selector: 'app-aside',
    imports: [AsideContentComponent, RouterModule],
    templateUrl: './aside.component.html',
    styleUrl: './aside.component.scss'
})
export class AsideComponent {
  // public props
  NavCollapsedMob = output();
  SubmenuCollapse = output();
  navCollapsedMob = false;
  windowWidth = window.innerWidth;
  themeMode!: string;

  // public method
  navCollapseMob() {
    if (this.windowWidth < 1025) {
      this.NavCollapsedMob.emit();
    }
  }

  navSubmenuCollapse() {
    document.querySelector('app-navigation.coded-navbar')?.classList.add('coded-trigger');
  }
}

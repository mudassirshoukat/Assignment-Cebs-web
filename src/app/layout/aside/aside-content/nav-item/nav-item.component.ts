import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AsideItem } from '../../aside';

@Component({
    selector: 'app-nav-item',
    imports: [CommonModule, RouterModule],
    templateUrl: './nav-item.component.html',
    styleUrl: './nav-item.component.scss'
})
export class NavItemComponent {
    // public props
    @Input() item!: AsideItem;

    // public method
    closeOtherMenu(event: MouseEvent) {
        const ele = event.target as HTMLElement;

        if (ele) {
            // Use optional chaining for safe traversal
            const parent = ele.parentElement;
            
            // Safe traversal to find ancestor elements
            // Note: We avoid aggressive casting and use optional chaining
            const grandParent = parent?.parentElement;
            const greatGrandParent = grandParent?.parentElement;
            const up_parent = greatGrandParent?.parentElement;
            const last_parent = up_parent?.parentElement;

            // --- 1. Collapse other submenus ---
            if (last_parent?.classList.contains('coded-submenu')) {
                // Safely check for up_parent before manipulating classes
                up_parent?.classList.remove('coded-trigger');
                up_parent?.classList.remove('active');
            } else {
                // This block is safe as querySelectorAll returns a NodeList (not null)
                const sections = document.querySelectorAll('.coded-hasmenu');

                for (let i = 0; i < sections.length; i++) {
                    sections[i].classList.remove('active');
                    sections[i].classList.remove('coded-trigger');
                }
            }

            // --- 2. Activate the current menu path (Fixes the tab not active state) ---
            if (parent?.classList.contains('coded-hasmenu')) {
                parent.classList.add('coded-trigger');
                parent.classList.add('active');
            } else if (up_parent?.classList.contains('coded-hasmenu')) {
                up_parent.classList.add('coded-trigger');
                up_parent.classList.add('active');
            } else if (last_parent?.classList.contains('coded-hasmenu')) {
                last_parent.classList.add('coded-trigger');
                last_parent.classList.add('active');
            }
        }

        // --- 3. Close mobile menu if open ---
        const navBar = document.querySelector('app-navigation.coded-navbar') as HTMLDivElement;
        if (navBar?.classList.contains('mob-open')) {
            navBar.classList.remove('mob-open');
        }
    }
}
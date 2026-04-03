import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
// Import HTTP client provider functions
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { authInterceptor } from './shared/interceptors/AuthInterceptor';
import { providePrimeNG } from 'primeng/config';
// import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { errorInterceptor } from './shared/interceptors/ErrorInterceptor';
import { MessageService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),

    // 1. Router Setup
    provideRouter(routes),

    // 2. HTTP Client Setup with Interceptors
    provideHttpClient(
      withInterceptors([
        authInterceptor, errorInterceptor
      ])
    ),

        MessageService, 

    // 3. Animations Setup
    provideAnimationsAsync(),
    // providePrimeNG({ theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } } })
    providePrimeNG({
      theme: {
        preset: Aura
      }
    })
  ],
};

export class UIConfig {
  static isCollapse_menu = false;
  static font_family = 'Roboto';
}



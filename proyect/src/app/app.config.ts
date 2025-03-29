import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ConfigService } from './config.service';

export function initializeApp(configService: ConfigService) {
  return (): Promise<any> => {
    return configService.loadConfig().then(config => {
      if (config.baseUrl) {
        // Dynamically set the base URL
        const baseElement = document.querySelector('base');
        if (baseElement) {
          baseElement.setAttribute('href', config.baseUrl);
        }
        console.log('Base URL set to:', config.baseUrl);
      }
    }).catch(err => {
      console.error('Error loading configuration:', err);
    });
  };
}

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
    provideHttpClient(withFetch()), provideAnimationsAsync(), provideAnimationsAsync()
  ]
};

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { ConfigService } from './app/config.service';
import { HttpClientModule, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { importProvidersFrom, provideAppInitializer } from '@angular/core';
import { appConfig } from './app/app.config';
import { environment } from './environments/environment';


bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));

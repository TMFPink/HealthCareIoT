import {
  ApplicationConfig,
  provideZoneChangeDetection,
  importProvidersFrom,
} from '@angular/core';
import { icons } from './icon-provider';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  PreloadAllModules,
  DetachedRouteHandle,
  ActivatedRouteSnapshot,
  RouterModule,
  withRouterConfig,
} from '@angular/router';
import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';

import { routes } from './app.routes';
import { HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';

//   import { ApiModule } from './api/api.module';
//   import { NgxsModule } from '@ngxs/store';
//   import { AuthState } from './store/auth';
//   import { authInterceptorProvider } from './interceptors/auth.interceptor';
//   import { FriendsState } from './store';
import { IonicModule } from '@ionic/angular';
//   import { ProfileState } from './store/profile';
registerLocaleData(en);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideNzIcons(icons),
    provideNzI18n(en_US),
    provideAnimationsAsync(),
    provideIonicAngular(),
    provideRouter(routes),
    importProvidersFrom(
      // ApiModule.forRoot({ rootUrl: environment.ApiUrl }),
      // NgxsModule.forRoot([ProfileState]),
      IonicModule.forRoot({
        mode: 'ios',
        swipeBackEnabled: false,
      }),
      HttpClientModule
    ),
    provideAnimationsAsync('noop'),

    //   authInterceptorProvider,

    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
};

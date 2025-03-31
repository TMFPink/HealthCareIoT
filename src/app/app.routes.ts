import { Routes } from '@angular/router';
import { ContentLayoutComponent } from './Components/content-layout/content-layout.component';
import { HomePageComponent } from './Components/home-page/home-page.component';
import { ChartComponent } from './Components/chart/chart.component';
import { importProvidersFrom } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { TelegramComponent } from './Components/telegram/telegram.component';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
      {
        path: '**',
        redirectTo: 'login',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    component: ContentLayoutComponent,
    children: [
      {
        path: 'home',
        component: HomePageComponent,
      },
      {
        path: 'chart',
        component: ChartComponent,
      },
      {
        path: 'profile',
        component: TelegramComponent,
      },
      {
        path: '**',
        redirectTo: 'home',
        pathMatch: 'full',
      },
    ],
    providers: [
      importProvidersFrom(
        NgxEchartsModule.forRoot({
          echarts: () => import('echarts'),
        })
      ),
    ],
  },
];

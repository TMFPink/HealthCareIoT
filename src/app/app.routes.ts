import { Routes } from '@angular/router';
import { ContentLayoutComponent } from './Components/content-layout/content-layout.component';
import { HomePageComponent } from './Components/home-page/home-page.component';
import { ChartComponent } from './Components/chart/chart.component';
import { importProvidersFrom } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';

export const routes: Routes = [
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

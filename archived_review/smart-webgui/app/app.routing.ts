import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {DashboardHomeComponent, DashboardWaterbudgetComponent} from "./dashboards";
import {SearchComponent} from './search';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: DashboardHomeComponent
  },
  {
    path: 'waterbudget',
    component: DashboardWaterbudgetComponent
  },
  {
    path: 'search',
    component: SearchComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

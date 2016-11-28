import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardHomeComponent, DashboardCategoryComponent } from './dashboards';
import { SearchComponent } from './search';
import { LoginComponent, RegisterComponent, AccountComponent, ResetPassComponent } from './account';
import { MetadataEditorComponent } from './workbench';
import { AuthGuard } from './_guards';
import { ResultCardsComponent } from './search/result-cards.component';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardHomeComponent
  },
  {
    path: 'dashboard/:category',
    component: DashboardCategoryComponent
  },
  {
    path: 'search',
    component: SearchComponent
  },
  {
    path: 'search/cards',
    component: ResultCardsComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'resetpass',
    component: ResetPassComponent
  },
  {
    path: 'account',
    component: AccountComponent,
    canActivate: [AuthGuard]
  },
  // also think about CanActivateChild for the whiole workbench thing
  {
    path: 'workbench/add-data',
    component: MetadataEditorComponent,
    canActivate: [AuthGuard]
  },

  // otherwise redirect to home
  { path: '**', redirectTo: '/dashboard' }
];

// useHash: true https://angular.io/docs/ts/latest/guide/router.html#!#browser-url-styles
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes, { useHash: true });

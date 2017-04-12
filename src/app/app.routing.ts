import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  DashboardHomeComponent,
  DashboardCategoryComponent,
  ResultCardsComponent
} from './dashboards';
import { SearchComponent } from './search';
import {
  LoginComponent,
  RegisterComponent,
  AccountComponent,
  ResetPassComponent,
  ResetPassRedeemComponent
} from './account';
import {
  MetadataEditorComponent,
  CollectionsComponent,
  BasicFileUploadComponent } from './workbench';
import { AuthGuard, RegisteredGuard } from './_guards';
import { NotFoundComponent } from './navigation';

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
    path: 'dashboard/:category/cards',
    component: ResultCardsComponent
  },
  {
    path: 'search',
    component: SearchComponent
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
    path: 'resetpass/:redeemlink',
    component: ResetPassRedeemComponent
  },
  {
    path: 'account',
    component: AccountComponent,
    canActivate: [AuthGuard]
  },
  // also think about CanActivateChild for the whole workbench thing
  {
    path: 'workbench/add-data',
    component: MetadataEditorComponent,
    canActivate: [AuthGuard, RegisteredGuard]
  },
  {
    path: 'workbench/upload-file',
    component: BasicFileUploadComponent,
    canActivate: [AuthGuard, RegisteredGuard]
  },
  {
    path: 'workbench/my-data',
    component: CollectionsComponent,
    canActivate: [AuthGuard, RegisteredGuard]
  },

  {path: '404', component: NotFoundComponent},
  {path: '**', redirectTo: '/404'}
  // otherwise redirect to home
  // { path: '**', redirectTo: '/dashboard' }
];

// useHash: true https://angular.io/docs/ts/latest/guide/router.html#!#browser-url-styles
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes, { useHash: true });

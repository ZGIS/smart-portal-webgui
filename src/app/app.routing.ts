import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  DashboardHomeComponent,
  DashboardCategoryComponent,
  ResultCardsComponent
} from './dashboards';
import { SearchComponent } from './search';
import { CollectionsDeskComponent } from './owc';
import {
  LoginComponent,
  RegisterComponent,
  AccountComponent,
  ResetPassComponent,
  ResetPassRedeemComponent
} from './account';
import {
  MetadataEditorComponent,
  BasicFileUploadComponent, UsermetarecordsComponent, UserFilesComponent
} from './workbench';
import { NotFoundComponent } from './navigation';
import { ResearchProgrammesComponent } from './research-pg';
import { GlossaryComponent } from './glossary-edu';
import { AdminComponent } from './admin';
import { ContextRetrieveComponent, FileLoaderComponent } from './context';
import { TimeseriesComponent } from './timeseries';
import { AdminGuard, AuthGuard, OwcContextIdResolve, RegisteredGuard } from './_guards';
import { GroupsBaseComponent } from './groups';
import { OwcLeafletViewerComponent } from './owc/owc-leaflet-viewer.component';

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
    path: 'research-pg',
    component: ResearchProgrammesComponent
  },
  {
    path: 'glossary-edu',
    component: GlossaryComponent
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
    canActivate: [ AuthGuard ]
  },
  {
    path: 'x-admin',
    component: AdminComponent,
    canActivate: [ AdminGuard ]
  },

  // to access content directly

  {
    path: 'context/file/:uuid',
    component: FileLoaderComponent
  },
  {
    path: 'context/:type/:uuid',
    component: ContextRetrieveComponent
  },
  // also think about CanActivateChild for the whole workbench thing
  {
    path: 'workbench/add-data',
    component: MetadataEditorComponent,
    canActivate: [ AuthGuard, RegisteredGuard ]
  },
  {
    path: 'workbench/upload-file',
    component: BasicFileUploadComponent,
    canActivate: [ AuthGuard, RegisteredGuard ]
  },
  {
    path: 'workbench/my-data',
    component: CollectionsDeskComponent,
    canActivate: [ AuthGuard, RegisteredGuard ]
  },
  {
    path: 'workbench/my-groups',
    component: GroupsBaseComponent,
    canActivate: [ AuthGuard, RegisteredGuard ]
  },
  {
    path: 'workbench/my-files',
    component: UserFilesComponent,
    canActivate: [ AuthGuard, RegisteredGuard ]
  },
  {
    path: 'workbench/my-metadata',
    component: UsermetarecordsComponent,
    canActivate: [ AuthGuard, RegisteredGuard ]
  },
  {
    path: 'timeseries',
    component: TimeseriesComponent
  },
  {
    path: 'mapviewer',
    component: OwcLeafletViewerComponent,
    resolve: {
      owc: OwcContextIdResolve
    }
  },


  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' }
  // otherwise redirect to home
  // { path: '**', redirectTo: '/dashboard' }
];

// useHash: true https://angular.io/docs/ts/latest/guide/router.html#!#browser-url-styles
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes, { useHash: true });

import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardCategoryComponent, DashboardHomeComponent, ResultCardsComponent } from './dashboards';
import { SearchComponent } from './search';
import { CollectionsDeskComponent, OwcLeafletViewerComponent } from './owc';
import {
  AccountComponent,
  LoginComponent,
  RegisterComponent,
  ResetPassComponent,
  ResetPassRedeemComponent
} from './account';
import {
  BasicFileUploadComponent,
  MetadataEditorComponent,
  UserFilesComponent,
  UsermetarecordsComponent
} from './workbench';
import { DisclaimerViewComponent, NotFoundComponent } from './navigation';
import { ResearchProgrammesComponent } from './research-pg';
import { GlossaryComponent } from './glossary-edu';
import { AdminComponent } from './admin';
import { ContextRetrieveComponent, FileLoaderComponent } from './context';
import { TimeseriesComponent } from './timeseries';
import {
  AdminGuard,
  AuthGuard,
  ChildCategoriesResolve, DisclaimerGuard,
  OwcContextIdResolve,
  RegisteredGuard
} from './_guards';
import { GroupsBaseComponent } from './groups';

const appRoutes: Routes = [
  {
    path: 'disclaimer',
    component: DisclaimerViewComponent,
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardHomeComponent,
    canActivate: [ DisclaimerGuard ]
  },
  {
    path: 'dashboard/:category',
    component: DashboardCategoryComponent,
    canActivate: [ DisclaimerGuard ]
  },
  {
    path: 'dashboard/:category/cards',
    component: ResultCardsComponent,
    canActivate: [ DisclaimerGuard ],
    resolve: {
      childCategoryObject: ChildCategoriesResolve
    }
  },
  {
    path: 'search',
    component: SearchComponent,
    canActivate: [ DisclaimerGuard ]
  },
  {
    path: 'research-pg',
    component: ResearchProgrammesComponent,
    canActivate: [ DisclaimerGuard ]
  },
  {
    path: 'glossary-edu',
    component: GlossaryComponent,
    canActivate: [ DisclaimerGuard ]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [ DisclaimerGuard ]
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [ DisclaimerGuard ]
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
    component: FileLoaderComponent,
    canActivate: [ DisclaimerGuard ]
  },
  {
    path: 'context/:type/:uuid',
    component: ContextRetrieveComponent,
    canActivate: [ DisclaimerGuard ]
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
    component: TimeseriesComponent,
    canActivate: [ DisclaimerGuard ]
  },
  {
    path: 'mapviewer',
    component: OwcLeafletViewerComponent,
    canActivate: [ DisclaimerGuard ],
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

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CookieService, BaseCookieOptions, CookieOptions } from 'angular2-cookie/core';
import {
  AccordionModule,
  BsDropdownModule,
  ModalModule,
  DatepickerModule,
  AlertModule,
  TabsModule,
  TooltipModule,
  TypeaheadModule,
  Ng2BootstrapModule, ProgressbarModule
} from 'ng2-bootstrap';
import { FileUploadModule } from 'ng2-file-upload';
import { AppComponent } from './app.component';
import { routing } from './app.routing';
import {
  ResultService,
  ResultDetailComponent,
  SearchComponent,
  FeatureOriginPipe,
  ResultDetailModalComponent
} from './search';
import { NavigationComponent, NotFoundComponent } from './navigation';
import { AdminComponent } from './admin';
import { GlossaryComponent } from './glossary-edu';
import { ResearchProgrammesComponent } from './research-pg';
import {
  DashboardHomeComponent,
  DashboardCategoryComponent,
  ResultCardsComponent,
  CardComponent,
  DashboardButtonComponent,
  CategoriesService,
  ShareButtonComponent,
  ShareButtonService
} from './dashboards';
import { Ol3MapComponent } from './ol3-map';
import {
  LoginComponent,
  RegisterComponent,
  ResetPassComponent,
  ResetPassRedeemComponent,
  ReCaptchaComponent,
  ReCaptchaService,
  AccountService,
  AccountComponent,
  AccountProfileModalComponent,
  AccountPasswordModalComponent,
  GApiAuthComponent,
  GApiAuthService
} from './account';
import {
  MetadataEditorComponent,
  BasicFileUploadComponent
} from './workbench';
import {
  CollectionsService,
  CollectionsComponent,
  CollectionsDeskComponent,
  OwcEntryDetailModalComponent,
  OwcAuthorComponent,
  OwcCategoryComponent,
  OwcLinkComponent,
  OwcOfferingComponent,
  OwcDocumentPropertiesComponent,
  OwcEntryPropertiesComponent
} from './owc';
import { X3dViewComponent } from './x3d-view';
import { API_URL_PROVIDERS, APP_VERSION_PROVIDERS } from './in-app-config';
import { AdminGuard, AuthGuard, RegisteredGuard } from './_guards';
import { NotificationComponent, NotificationService } from './notifications';
import { ClipboardModule } from 'ngx-clipboard';
import { RatingModule } from 'ng2-bootstrap/rating';
import { ContextRetrieveComponent } from './context/context.component';

export function cookieServiceFactory() {
  return new CookieService();
}

@NgModule({
  imports: [ BrowserModule,
    FormsModule,
    HttpModule,
    Ng2BootstrapModule,
    AccordionModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    DatepickerModule.forRoot(),
    AlertModule.forRoot(),
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    TypeaheadModule.forRoot(),
    RatingModule.forRoot(),
    ProgressbarModule.forRoot(),
    FileUploadModule,
    ClipboardModule,
    routing ],
  declarations: [ AppComponent,
    ResultDetailComponent,
    DashboardHomeComponent,
    DashboardCategoryComponent,
    NavigationComponent,
    NotFoundComponent,
    ResearchProgrammesComponent,
    GlossaryComponent,
    AdminComponent,
    SearchComponent,
    ResultCardsComponent,
    ShareButtonComponent,
    Ol3MapComponent,
    X3dViewComponent,
    LoginComponent,
    ReCaptchaComponent,
    GApiAuthComponent,
    RegisterComponent,
    ResetPassComponent,
    ResetPassRedeemComponent,
    AccountComponent,
    AccountProfileModalComponent,
    AccountPasswordModalComponent,
    MetadataEditorComponent,
    NotificationComponent,
    FeatureOriginPipe,
    ResultDetailModalComponent,
    DashboardButtonComponent,
    CollectionsComponent,
    CollectionsDeskComponent,
    OwcEntryDetailModalComponent,
    OwcAuthorComponent,
    OwcCategoryComponent,
    OwcLinkComponent,
    OwcOfferingComponent,
    OwcDocumentPropertiesComponent,
    OwcEntryPropertiesComponent,
    BasicFileUploadComponent,
    CardComponent,
    ContextRetrieveComponent
  ],
  providers: [
    API_URL_PROVIDERS,
    APP_VERSION_PROVIDERS,
    {provide: CookieService, useFactory: cookieServiceFactory},
    AccountService,
    AuthGuard,
    RegisteredGuard,
    AdminGuard,
    ResultService,
    ReCaptchaService,
    GApiAuthService,
    NotificationService,
    CollectionsService,
    CategoriesService,
    ShareButtonService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}

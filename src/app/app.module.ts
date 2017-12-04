import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CookieModule } from 'ngx-cookie';
import {
  AccordionModule,
  AlertModule,
  BsDropdownModule,
  DatepickerModule,
  ModalModule,
  Ng2BootstrapModule,
  PopoverModule,
  ProgressbarModule,
  TabsModule,
  TooltipModule,
  TypeaheadModule,
  RatingModule
} from 'ngx-bootstrap';
import { FileUploadModule } from 'ng2-file-upload';
import { AppComponent } from './app.component';
import { routing } from './app.routing';
import {
  FeatureOriginPipe,
  ResultDetailComponent,
  ResultDetailModalComponent,
  ResultService,
  SearchComponent
} from './search';
import { NavigationComponent, NotFoundComponent } from './navigation';
import { GlossaryService, GlossaryComponent } from './glossary-edu';
import { ResearchProgrammesSkosdefComponent, ResearchProgrammesComponent } from './research-pg';
import {
  CardComponent,
  CategoriesService,
  DashboardButtonComponent,
  DashboardCategoryComponent,
  DashboardHomeComponent,
  ResultCardsComponent,
  ShareButtonComponent,
  ShareButtonService
} from './dashboards';
import { Ol3MapComponent } from './ol3-map';
import {
  AccountService,
  AccountComponent,
  AccountPasswordModalComponent,
  AccountProfileModalComponent,
  AccountDeleteSelfModalComponent,
  GApiAuthComponent,
  GApiAuthService,
  LoginComponent,
  ReCaptchaComponent,
  ReCaptchaService,
  RegisterComponent,
  ResetPassComponent,
  ResetPassRedeemComponent
} from './account';
import { AdminComponent, AdminService } from './admin';
import { WorkbenchService,
  BasicFileUploadComponent,
  MetadataEditorComponent,
  UserFilesComponent,
  UsermetarecordsComponent } from './workbench';
import {
  CollectionsService,
  CollectionsComponent,
  CollectionsDeskComponent,
  OwcAuthorComponent,
  OwcCategoryComponent,
  OwcContextPropertiesComponent,
  OwcResourceDetailModalComponent,
  OwcResourcePropertiesComponent,
  OwcLinkComponent,
  OwcContentComponent,
  OwcOperationComponent,
  OwcCreatorDisplayComponent,
  OwcCreatorApplicationComponent,
  OwcStyleSetComponent,
  OwcOfferingComponent
} from './owc';
import { X3dViewComponent } from './x3d-view';
import { API_URL_PROVIDERS, APP_VERSION_PROVIDERS } from './in-app-config';
import { AdminGuard, AuthGuard, RegisteredGuard } from './_guards';
import { NotificationComponent, NotificationService } from './notifications';
import { ClipboardModule } from 'ngx-clipboard';
import { ContextRetrieveComponent, FileLoaderComponent, LicensedlinkComponent } from './context';
import { TimeseriesComponent } from './timeseries';
import { TimeseriesConfiguratorModalComponent } from './timeseries';
import { UsplashImageCreditComponent } from './navigation';

@NgModule({
  imports: [BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    Ng2BootstrapModule,
    CookieModule.forRoot(),
    AccordionModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    DatepickerModule.forRoot(),
    PopoverModule.forRoot(),
    AlertModule.forRoot(),
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    TypeaheadModule.forRoot(),
    RatingModule.forRoot(),
    ProgressbarModule.forRoot(),
    FileUploadModule,
    ClipboardModule,
    routing],
  declarations: [AppComponent,
    ResultDetailComponent,
    DashboardHomeComponent,
    DashboardCategoryComponent,
    NavigationComponent,
    NotFoundComponent,
    ResearchProgrammesSkosdefComponent,
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
    AccountDeleteSelfModalComponent,
    MetadataEditorComponent,
    NotificationComponent,
    FeatureOriginPipe,
    ResultDetailModalComponent,
    DashboardButtonComponent,
    CollectionsComponent,
    CollectionsDeskComponent,
    UserFilesComponent,
    UsermetarecordsComponent,
    OwcResourceDetailModalComponent,
    OwcAuthorComponent,
    OwcCategoryComponent,
    OwcLinkComponent,
    OwcContentComponent,
    OwcOfferingComponent,
    OwcOperationComponent,
    OwcStyleSetComponent,
    OwcCreatorDisplayComponent,
    OwcCreatorApplicationComponent,
    OwcContextPropertiesComponent,
    OwcResourcePropertiesComponent,
    BasicFileUploadComponent,
    CardComponent,
    ContextRetrieveComponent,
    FileLoaderComponent,
    LicensedlinkComponent,
    TimeseriesComponent,
    TimeseriesConfiguratorModalComponent,
    UsplashImageCreditComponent
  ],
  providers: [
    API_URL_PROVIDERS,
    APP_VERSION_PROVIDERS,
    AccountService,
    AdminService,
    AuthGuard,
    RegisteredGuard,
    AdminGuard,
    NotificationService,
    CategoriesService,
    GlossaryService,
    ResultService,
    WorkbenchService,
    ReCaptchaService,
    GApiAuthService,
    CollectionsService,
    ShareButtonService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

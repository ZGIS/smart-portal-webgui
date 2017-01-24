import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
// import { CookieService } from 'angular2-cookie/services/cookies.service';
import { CookieService, BaseCookieOptions, CookieOptions } from 'angular2-cookie/core';
import {
  DropdownModule,
  ModalModule,
  DatepickerModule,
  AlertModule,
  TabsModule,
  TooltipModule,
  Ng2BootstrapModule
} from 'ng2-bootstrap';
import { AppComponent } from './app.component';
import { routing } from './app.routing';
import {
  ResultService,
  ResultDetailComponent,
  SearchComponent,
  FeatureOriginPipe,
  ResultDetailModalComponent
} from './search';
import { NavigationComponent } from './navigation';
import {
  DashboardHomeComponent,
  DashboardCategoryComponent,
  ResultCardsComponent,
  DashboardButtonComponent
} from './dashboards';
import { Ol3MapComponent } from './ol3-map';
import {
  LoginComponent,
  RegisterComponent,
  ResetPassComponent,
  ReCaptchaComponent,
  ReCaptchaService,
  AccountService,
  AccountComponent,
  GApiAuthComponent,
  GApiAuthService
} from './account';
import { MetadataEditorComponent, CollectionsService, CollectionsComponent } from './workbench';
import { API_URL_PROVIDERS } from './app.tokens';
import { AuthGuard } from './_guards';
import { NotificationComponent, NotificationService } from './notifications';

export function cookieServiceFactory() {
  return new CookieService();
}

@NgModule({
  imports: [BrowserModule,
    FormsModule,
    HttpModule,
    Ng2BootstrapModule,
    DropdownModule.forRoot(),
    ModalModule.forRoot(),
    DatepickerModule.forRoot(),
    AlertModule.forRoot(),
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    routing],
  declarations: [AppComponent,
    ResultDetailComponent,
    DashboardHomeComponent,
    DashboardCategoryComponent,
    NavigationComponent,
    SearchComponent,
    ResultCardsComponent,
    Ol3MapComponent,
    LoginComponent,
    ReCaptchaComponent,
    GApiAuthComponent,
    RegisterComponent,
    ResetPassComponent,
    AccountComponent,
    MetadataEditorComponent,
    NotificationComponent,
    FeatureOriginPipe,
    ResultDetailModalComponent,
    DashboardButtonComponent,
    CollectionsComponent
  ],
  providers: [
    { provide: CookieService, useFactory: cookieServiceFactory },
    AuthGuard,
    ResultService,
    AccountService,
    ReCaptchaService,
    GApiAuthService,
    NotificationService,
    CollectionsService,
    API_URL_PROVIDERS
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

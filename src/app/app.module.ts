import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { Ng2BootstrapModule } from 'ng2-bootstrap/ng2-bootstrap';
import { AppComponent } from './app.component';
import { routing } from './app.routing';
import { ResultService, ResultDetailComponent, SearchComponent } from './search';
import { NavigationComponent } from './navigation';
import { DashboardHomeComponent, DashboardCategoryComponent } from './dashboards';
import { Ol3MapComponent } from './ol3-map';
import {
  LoginComponent,
  RegisterComponent,
  ResetPassComponent,
  AccountService,
  AccountComponent
} from './account';
import { MetadataEditorComponent } from './workbench';
import { API_URL_PROVIDERS } from './app.tokens';
import { AuthGuard } from './_guards';
import { NotificationComponent } from './notifications/notification.component';
import { NotificationService } from './notifications/notification.service';
import { ResultCardsComponent } from './search/result-cards.component';

@NgModule({
  imports: [BrowserModule,
    FormsModule,
    HttpModule,
    Ng2BootstrapModule,
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
    RegisterComponent,
    ResetPassComponent,
    AccountComponent,
    MetadataEditorComponent,
    NotificationComponent
  ],
  providers: [
    CookieService,
    AuthGuard,
    ResultService,
    AccountService,
    NotificationService,
    API_URL_PROVIDERS
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Ng2BootstrapModule } from 'ng2-bootstrap/ng2-bootstrap';
import { AppComponent } from './app.component';
import { ResultService, ResultDetailComponent, SearchComponent } from './search';
import { routing } from './app.routing';
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
    Ol3MapComponent,
    LoginComponent,
    RegisterComponent,
    ResetPassComponent,
    AccountComponent,
    MetadataEditorComponent
  ],
  providers: [
    AuthGuard,
    ResultService,
    AccountService,
    API_URL_PROVIDERS
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

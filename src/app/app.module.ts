import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Ng2BootstrapModule } from 'ng2-bootstrap/ng2-bootstrap';
import { AppComponent } from './app.component';
import { ResultService } from './result.service';
import { ResultDetailComponent, SearchComponent } from './search/';
import { routing } from './app.routing';
import { NavigationComponent } from './navigation/navigation.component';
import { DashboardHomeComponent, DashboardCategoryComponent } from './dashboards';
import { Ol3MapComponent } from './ol3-map/ol3-map.component';
import { LoginComponent } from './account/login.component';
import { RegisterComponent } from './account/register.component';
import { AccountService } from './account/account.service';
import { API_URL_PROVIDERS } from './app.tokens';

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
    RegisterComponent],
  providers: [
    ResultService,
    AccountService,
    API_URL_PROVIDERS
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

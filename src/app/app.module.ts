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
import { DashboardHomeComponent, DashboardWaterbudgetComponent } from './dashboards';
import { Ol3MapComponent } from './ol3-map/ol3-map.component';
import { LoginComponent } from './account/login.component';
import { RegisterComponent } from './account/register.component';
import { AccountService } from './account/account.service';

@NgModule({
  imports: [BrowserModule,
    FormsModule,
    HttpModule,
    Ng2BootstrapModule,
    routing],
  declarations: [AppComponent,
    ResultDetailComponent,
    DashboardHomeComponent,
    DashboardWaterbudgetComponent,
    NavigationComponent,
    SearchComponent,
    Ol3MapComponent,
    LoginComponent,
    RegisterComponent],
  providers: [
    // 'http://localhost:9000/query'
    { provide: 'cswiApi', useValue: 'http://dev.smart-project.info/cswi-api/query' },
    // 'http://localhost:9000/api/v1'
    { provide: 'portalApi', useValue: 'http://dev.smart-project.info/api/v1' },
    ResultService,
    AccountService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}

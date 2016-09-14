import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import { HttpModule }    from '@angular/http';

import {Ng2BootstrapModule} from 'ng2-bootstrap/ng2-bootstrap';
import {AppComponent} from './app.component';
import {ResultService} from './result.service';
import {ResultDetailComponent, SearchComponent} from './search/';
import {routing} from './app.routing';
import {NavigationComponent} from './navigation/navigation.component';
import {DashboardHomeComponent, DashboardWaterbudgetComponent} from './dashboards';

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
    SearchComponent],
  providers: [ResultService],
  bootstrap: [AppComponent]
})
export class AppModule {
}

import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {Ng2BootstrapModule} from 'ng2-bootstrap/ng2-bootstrap';
import {AppComponent} from './app.component';
import {ResultService} from './result.service';
import {NavigationComponent} from './navigation/navigation.component';
import {HomeComponent} from './home/home.component';
import {WaterbudgetComponent} from './waterbudget/waterbudget.component';
import {ResultDetailComponent} from './search/result-detail.component';
import {SearchComponent} from './search/search.component';
import {routing} from './app.routing';

@NgModule({
  imports: [BrowserModule, FormsModule, Ng2BootstrapModule, routing],
  declarations: [AppComponent, ResultDetailComponent, NavigationComponent, HomeComponent, WaterbudgetComponent, SearchComponent],
  providers: [ResultService],
  bootstrap: [AppComponent]
})
export class AppModule {
}

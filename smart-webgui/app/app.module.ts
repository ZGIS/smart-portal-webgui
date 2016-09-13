import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';

import { Ng2BootstrapModule } from 'ng2-bootstrap/ng2-bootstrap';

import { AppComponent }  from './app.component';
import {ResultDetailComponent} from "./result-detail.component";
import {ResultService} from "./result.service";

@NgModule({
  imports: [ BrowserModule, FormsModule, Ng2BootstrapModule],
  declarations: [ AppComponent, ResultDetailComponent],
  providers: [ResultService],
  bootstrap: [ AppComponent ]
})
export class AppModule { }

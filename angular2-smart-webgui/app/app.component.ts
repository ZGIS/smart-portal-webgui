/**
 * Copyright (C) 2011-2017 Interfaculty Department of Geoinformatics, University of
 * Salzburg (Z_GIS) & Institute of Geological and Nuclear Sciences Limited (GNS Science)
 * in the SMART Aquifer Characterisation (SAC) programme funded by the New Zealand
 * Ministry of Business, Innovation and Employment (MBIE)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {Component} from '@angular/core';
import {AlertComponent, DATEPICKER_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';
import {NgModel} from '@angular/forms';

@Component({
    selector: 'my-app',
    directives: [AlertComponent, DATEPICKER_DIRECTIVES, NgModel],
    templateUrl: 'app/app.template.html'
})

export class AppComponent {
    public dt:Date = new Date();
    private minDate:Date = null;
    private events:Array<any>;
    private tomorrow:Date;
    private afterTomorrow:Date;
    private formats:Array<string> = ['DD-MM-YYYY', 'YYYY/MM/DD', 'DD.MM.YYYY', 'shortDate'];
    private format = this.formats[0];
    private dateOptions:any = {
        formatYear: 'YY',
        startingDay: 1
    };
    private opened:boolean = false;

    public getDate():number {
        return this.dt && this.dt.getTime() || new Date().getTime();
    }
}
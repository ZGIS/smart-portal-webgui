// Angular
import '@angular/platform-browser';
import '@angular/platform-browser-dynamic';
import '@angular/core';
import '@angular/common';
import '@angular/compiler';
import '@angular/http';
import '@angular/router';
import '@angular/forms';

// RxJS
import 'rxjs';

// Other vendors for example jQuery, Lodash or Bootstrap
// You can import js, ts, css, sass, ...

import '../node_modules/openlayers/dist/ol.css';

/*
 * is picked up by webpack css loader, needs to resolve glyphicons,
 * so I'll copy them into public folder too
 */
import '../public/css/theme.min.css';

import '../node_modules/bootstrap/dist/css/bootstrap-theme.min.css';
import '../node_modules/font-awesome/css/font-awesome.min.css';

import 'ng2-bootstrap';
import 'moment';
import 'openlayers';

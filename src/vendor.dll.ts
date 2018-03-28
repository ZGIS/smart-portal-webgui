/**
 * List all packages (modular or global) for DLL build
 * It's optional to list them all, but
 * it's recommended for big packages and speedy rebuilds
 */

// Angular
import '@angular/platform-browser';
import '@angular/platform-browser-dynamic';
import '@angular/core';
import '@angular/common';
import '@angular/compiler';
import '@angular/forms';
import '@angular/http';
import '@angular/router';

// HMR
import '@angularclass/hmr';

// RxJS
// Uncomment below if you use RxJS in many non-preload lazy-loaded modules
import 'rxjs';

// Global packages
import 'ngx-cookie';
import 'ngx-bootstrap';
import '@asymmetrik/ngx-leaflet';
import 'ng2-file-upload';
import 'ngx-clipboard';

import 'bootstrap/dist/js/bootstrap';
import 'moment';
import 'moment-timezone';
import 'openlayers';
import 'leaflet';
import 'plotly.js/dist/plotly.js';
import 'x3dom';

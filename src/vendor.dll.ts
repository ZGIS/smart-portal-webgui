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
import 'angular2-cookie/core';
import 'angular2-cookie/services';
import 'ngx-bootstrap';
import 'ng2-file-upload';
import 'ngx-clipboard';

import 'bootstrap/dist/js/bootstrap';
import 'moment';
import 'openlayers';
import 'x3dom';

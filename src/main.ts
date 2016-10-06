import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppModule } from './app/app.module';

// css mixing all over the place :-/

import '../node_modules/openlayers/dist/ol.css';

import '../node_modules/bootstrap/dist/css/bootstrap-theme.min.css';
import '../node_modules/font-awesome/css/font-awesome.min.css';

/*
 * is picked up by webpack css loader, needs to resolve glyphicons,
 * so I'll copy them into public folder too
 */
import '../public/css/theme.min.css';

if (process.env.ENV === 'production') {
    enableProdMode();
}
platformBrowserDynamic().bootstrapModule(AppModule);

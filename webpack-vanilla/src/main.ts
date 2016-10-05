import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { AppModule } from './app/app.module';

/*
 * is picked up by webpack css loader, needs to resolve glyphicons,
 * so I'll copy them into public folder too
 */
import '../public/css/theme.min.css';

if (process.env.ENV === 'production') {
    enableProdMode();
}
platformBrowserDynamic().bootstrapModule(AppModule);

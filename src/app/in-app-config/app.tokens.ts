import { InjectionToken, OpaqueToken } from '@angular/core';

// place an .env, copy example from config/internal/.env.travis
// this works in dev test and prod jit, used to fail silently in prod aot, but seems to work now reliably
export const envCswiApiUrl: string = APP_CSWI_API_URL;
export const envPortalApiUrl: string = APP_PORTAL_API_URL;

export const envAppVersion: string = APP_VERSION;

export const envAppBuildNumber: string = APP_BUILD_NUMBER;
export const fullAppVersionString: string = envAppVersion + '-' + envAppBuildNumber;

console.log('API providers:');
console.log(envCswiApiUrl);
console.log(envPortalApiUrl);
console.log('APP version: ' + fullAppVersionString);

export const CSWI_API_URL = new InjectionToken<string>('cswiApiUrl');
export const PORTAL_API_URL = new InjectionToken<string>('portalApiUrl');
export const WEBGUI_APP_VERSION = new InjectionToken<string>('appVersion');


export const API_URL_PROVIDERS = [
  {
    provide: CSWI_API_URL,
    useValue: envCswiApiUrl
  },
  {
    provide: PORTAL_API_URL,
    useValue: envPortalApiUrl
  }
];

export const APP_VERSION_PROVIDERS = [
  {
    provide: WEBGUI_APP_VERSION,
    useValue: fullAppVersionString
  }
];

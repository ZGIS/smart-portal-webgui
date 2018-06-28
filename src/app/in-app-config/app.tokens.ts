import { OpaqueToken } from '@angular/core';

// place an .env, copy example from config/internal/.env.travis
// this works in dev test and prod jit, used to fail silently in prod aot, but seems to work now reliably
const envCswiApiUrl: string = APP_CSWI_API_URL ? APP_CSWI_API_URL : 'https://foodev.smart-project.info/cswi-api/v1';
const envPortalApiUrl: string = APP_PORTAL_API_URL ? APP_PORTAL_API_URL : 'https://foodev.smart-project.info/api/v1';
let envAppVersion: string = APP_VERSION ? APP_VERSION : 'Snapshot';

let currDate = new Date();
let envAppBuildNumber: string = APP_BUILD_NUMBER ? APP_BUILD_NUMBER : currDate.toString();
const fullAppVersionString: string = envAppVersion + '-' + envAppBuildNumber;

console.log('API providers:');
console.log(envCswiApiUrl);
console.log(envPortalApiUrl);
console.log('APP version: ' + fullAppVersionString);

console.log('test app token TRAVIS: ' + process.env.TRAVIS_BUILD_NUMBER);

export const CSWI_API_URL = new OpaqueToken('cswiApiUrl');
export const PORTAL_API_URL = new OpaqueToken('portalApiUrl');
export const WEBGUI_APP_VERSION = new OpaqueToken('appVersion');

console.log(PORTAL_API_URL);

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

console.log(PORTAL_API_URL);

export const APP_VERSION_PROVIDERS = [
  {
    provide: WEBGUI_APP_VERSION,
    useValue: fullAppVersionString
  }
];

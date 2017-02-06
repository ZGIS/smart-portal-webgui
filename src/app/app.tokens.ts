import { OpaqueToken } from '@angular/core';

export const CSWI_API_URL = new OpaqueToken('cswiApiUrl');
export const PORTAL_API_URL = new OpaqueToken('portalApiUrl');

// place an .env, copy example from config/internal/.env.travis
const envCswiApiUrl = APP_CSWI_API_URL ? APP_CSWI_API_URL : 'https://dev.smart-project.info/cswi-api/query';
const envPortalApiUrl = APP_PORTAL_API_URL ? APP_PORTAL_API_URL : 'https://dev.smart-project.info/api/v1';

if (!(APP_CSWI_API_URL && APP_PORTAL_API_URL)) {
  console.warn('No API URL Providers found in ENV, using defaults');
}

console.log('API providers:');
console.log(envCswiApiUrl);
console.log(envPortalApiUrl);

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

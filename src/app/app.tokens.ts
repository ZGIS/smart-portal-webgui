import { OpaqueToken } from '@angular/core';

export const CSWI_API_URL = new OpaqueToken('cswiApiUrl');
export const PORTAL_API_URL = new OpaqueToken('portalApiUrl');

// place an .env, copy example from config/internal/.env.travis
const envCswiApiUrl = APP_CSWI_API_URL ? APP_CSWI_API_URL : 'https://dev.smart-project.info/cswi-api/query';
const envPortalApiUrl = APP_PORTAL_API_URL ? APP_PORTAL_API_URL : 'https://dev.smart-project.info/api/v1';

if (APP_CSWI_API_URL && APP_PORTAL_API_URL) {
  console.log(APP_CSWI_API_URL);
  console.log(APP_PORTAL_API_URL);
} else {
  console.log('No API URL Providers found in ENV, using defaults');
  console.log(this.envCswiApiUrl);
  console.log(this.envPortalApiUrl);
}

export const API_URL_PROVIDERS = [
  {
    provide: CSWI_API_URL,
    useValue: APP_CSWI_API_URL
  },
  {
    provide: PORTAL_API_URL,
    useValue: APP_PORTAL_API_URL
  }
];

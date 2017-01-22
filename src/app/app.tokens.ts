import { OpaqueToken } from '@angular/core';

export const CSWI_API_URL = new OpaqueToken('cswiApiUrl');
export const PORTAL_API_URL = new OpaqueToken('portalApiUrl');

let envCswiApiUrl = 'https://dev.smart-project.info/cswi-api/query';
let envPortalApiUrl = 'https://dev.smart-project.info/cswi-api/query';

// place into .env, copy example from config/internal/.env.travis
if (process.env.CSWI_API_URL && process.env.PORTAL_API_URL) {
  console.log(process.env.CSWI_API_URL);
  this.envCswiApiUrl = process.env.CSWI_API_URL;
  console.log(process.env.PORTAL_API_URL);
  this.envPortalApiUrl = process.env.PORTAL_API_URL;
} else {
  console.log('No API URL Providers found in ENV, using defaults');
  console.log(this.envCswiApiUrl);
  console.log(this.envPortalApiUrl);
}


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

import { OpaqueToken } from '@angular/core';

export const CSWI_API_URL = new OpaqueToken('cswiApiUrl');
export const PORTAL_API_URL = new OpaqueToken('portalApiUrl');

// 'http://localhost:9000/'
export const API_URL_PROVIDERS = [
  {
    provide: CSWI_API_URL,
    useValue: 'http://dev.smart-project.info/cswi-api/query'
  },
  {
    provide: PORTAL_API_URL,
    useValue: 'http://dev.smart-project.info/api/v1'
  }
];

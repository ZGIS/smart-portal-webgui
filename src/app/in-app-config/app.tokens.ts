import { OpaqueToken } from '@angular/core';
import { AppConfig } from './app.config';

/**
 *
 * @param u
 * @returns {string}
 */
export function getAppConfig(u: string): string {
  let appConfig = new AppConfig();
  if (u === 'csw') {
    return appConfig.cswiUrl;
  } if (u === 'portal') {
    return appConfig.portalUrl;
  } else {
    return appConfig.cswiUrl;
  }
}

// although this works, they can't be put into the tokens for some reason
// the AOT build will then fail, doesn't make any sense
export const otherCswiApiUrl: string = getAppConfig('csw');
export const otherPortalApiUrl: string = getAppConfig('portal');

console.log('Other providers:');
console.log(otherCswiApiUrl);
console.log(otherPortalApiUrl);

// place an .env, copy example from config/internal/.env.travis
export const envCswiApiUrl: string = APP_CSWI_API_URL ? APP_CSWI_API_URL : 'https://dev.smart-project.info/cswi-api/v1';
export const envPortalApiUrl: string = APP_PORTAL_API_URL ? APP_PORTAL_API_URL : 'https://dev.smart-project.info/api/v1';

console.log('API providers:');
console.log(envCswiApiUrl);
console.log(envPortalApiUrl);

export const CSWI_API_URL = new OpaqueToken('cswiApiUrl');
export const PORTAL_API_URL = new OpaqueToken('portalApiUrl');

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

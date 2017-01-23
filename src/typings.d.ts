/**
 * Declare custom typings here
 */

declare var System: any;

// Extra variables that live on Global that will be replaced by webpack DefinePlugin
declare var APP_CSWI_API_URL: string;
declare var APP_PORTAL_API_URL: string;

interface GlobalEnvironment {
  APP_CSWI_API_URL;
  APP_PORTAL_API_URL;
}

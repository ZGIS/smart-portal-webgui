export class AppConfig {

  cswiUrl: string;
  portalUrl: string;

  constructor() {
    if (APP_CSWI_API_URL) {
      this.cswiUrl = APP_CSWI_API_URL;
      console.log('AppConfig APP_CSWI_API_URL set: ' + this.cswiUrl);
    } else {
      this.cswiUrl = 'https://dev.smart-project.info/cswi-api/v1';
      console.log('AppConfig APP_CSWI_API_URL not set, taking default: ' + this.portalUrl);
    }
    if (APP_PORTAL_API_URL) {
      this.portalUrl = APP_PORTAL_API_URL;
      console.log('AppConfig APP_PORTAL_API_URL set: ' + this.portalUrl);
    } else {
      this.portalUrl = 'https://dev.smart-project.info/api/v1';
      console.log('AppConfig APP_PORTAL_API_URL not set, taking default: ' + this.portalUrl);
    }
  }

}

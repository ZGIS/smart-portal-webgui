import { Inject, Injectable, NgZone } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { PORTAL_API_URL } from '../in-app-config';

/**
 * Load script to make share button loader for Twitter and co easy
 *
 * https://www.addtoany.com/buttons/for/website
 *
 * others:
 * - https://www.addthis.com
 * - http://platform.sharethis.com/get-inline-share-buttons#
 * - https://lukkr.com/share-buttons/
 */
@Injectable()
export class ShareButtonService {

  public a2a_config: any;

  private scriptLoaded = false;
  private readySubject: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor( zone: NgZone,
               @Inject(PORTAL_API_URL) private portalApiUrl: string ) {
    /* the callback needs to exist before the API is loaded */
    window[ <any>'onloadCallback' ] = <any>(() => zone.run(this.onloadCallback.bind(this)));
  }

  /**
   * loads the script and return when ready
   *
   * @returns {Observable<T>}
   */
  public getReady(): boolean {
    if (!this.scriptLoaded) {
      this.scriptLoaded = true;
      let doc = <HTMLDivElement>document.body;

      let a2a_config = this.a2a_config || {};
      a2a_config.linkname = 'Groundwater Hub';
      // APP_PORTAL_API_URL=https://nz-groundwater-hub.org/api/v1
      a2a_config.linkurl = this.portalApiUrl.replace('/api/v1', '');

      let shareScript = document.createElement('script');
      shareScript.innerHTML = '';
      shareScript.src = 'https://static.addtoany.com/menu/page.js';
      shareScript.async = true;
      doc.appendChild(shareScript);
    }
    return this.scriptLoaded;
  }

  public isReady(): Observable<boolean> {
    let loaded = this.getReady();
    this.readySubject.next(loaded);
    return this.readySubject.asObservable();
  }

  private onloadCallback() {
    this.readySubject.next(true);
  }
}

import { Injectable, NgZone } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

@Injectable()
export class ShareButtonService {

  public a2a_config: any;

  private scriptLoaded = false;
  private readySubject: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(zone: NgZone) {
    /* the callback needs to exist before the API is loaded */
    window[<any>'onloadCallback'] = <any>(() => zone.run(this.onloadCallback.bind(this)));
  }

  public getReady(): Observable<boolean> {
    if (!this.scriptLoaded) {
      this.scriptLoaded = true;
      let doc = <HTMLDivElement>document.body;

      let a2a_config = this.a2a_config || {};
      a2a_config.linkname = 'SAC Groundwater Hub';
      a2a_config.linkurl = 'https://dev.smart-portal.info';

      let shareScript = document.createElement('script');
      shareScript.innerHTML = '';
      shareScript.src = 'https://static.addtoany.com/menu/page.js';
      shareScript.async = true;
      doc.appendChild(shareScript);
    }
    return this.readySubject.asObservable();
  }

  private onloadCallback() {
    this.readySubject.next(true);
  }
}

import { Injectable, NgZone } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';


@Injectable()
export class GApiAuthService {

  private scriptLoaded = false;
  private readySubject: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(zone: NgZone) {
    /* the callback needs to exist before the API is loaded */
    window[<any>'gapiOnloadCallback'] = <any>(() => zone.run(this.onloadCallback.bind(this)));
  }

  public getReady(): Observable<boolean> {
    if (!this.scriptLoaded) {
      this.scriptLoaded = true;
      let doc = <HTMLDivElement>document.body;
      let jqueryScript = document.createElement('script');
      jqueryScript.innerHTML = '';
      jqueryScript.src = 'https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js';

      let gapiScript = document.createElement('script');
      gapiScript.innerHTML = '';
      gapiScript.src = 'https://apis.google.com/js/client:platform.js?onload=gapiOnloadCallback';
      gapiScript.async = true;
      gapiScript.defer = true;
      doc.appendChild(gapiScript);
    }
    return this.readySubject.asObservable();
  }

  private onloadCallback() {
    this.readySubject.next(true);
  }
}

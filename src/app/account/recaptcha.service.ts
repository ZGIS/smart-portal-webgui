import { Injectable, NgZone } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

/*
 * from https://github.com/xmaestro/angular2-recaptcha
 *
 * LICENSE: https://spdx.org/licenses/ISC
 *
 * Common service shared by all reCaptcha component instances
 * through dependency injection.
 * This service has the task of loading the reCaptcha API once for all
 *
 * As the language is passed to the <script>, the first component
 * determines the language of all subsequent components. This is a limitation
 * of the present Google API.
 */
@Injectable()
export class ReCaptchaService {

  private scriptLoaded = false;
  private readySubject: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(zone: NgZone) {
    /* the callback needs to exist before the API is loaded */
    window[<any>'reCaptchaOnloadCallback'] = <any>(() => zone.run(this.onloadCallback.bind(this)));
  }

  public getReady(language: String): Observable<boolean> {
    if (!this.scriptLoaded) {
      this.scriptLoaded = true;
      let doc = <HTMLDivElement>document.body;
      let script = document.createElement('script');
      script.innerHTML = '';
      script.src = 'https://www.google.com/recaptcha/api.js?' +
        'onload=reCaptchaOnloadCallback&render=explicit' +
        (language ? '&hl=' + language : '');
      script.async = true;
      script.defer = true;
      doc.appendChild(script);
    }
    return this.readySubject.asObservable();
  }

  private onloadCallback() {
    this.readySubject.next(true);
  }
}

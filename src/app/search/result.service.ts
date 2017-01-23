import { Injectable, Inject } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { CSWI_API_URL } from '../app.tokens';
import { IGeoFeatureCollection } from './result';
import { NotificationService } from '../notifications';
// import {MOCK_RESULTS} from './mock-results';

@Injectable()
export class ResultService {

  /**
   * TODO we need to inject this, maybe even based on prod/test/dev env like webpack does support
   *
   * The Service URL inject from app.module as central inject of app constants
   *
   * @type {string}
   */
  constructor(@Inject(CSWI_API_URL) private cswiApiUrl: string,
              private http: Http,
              private notificationService: NotificationService) {
  }

  /**
   * Queries the csw-ingester
   * @param query
   * @param fromDate
   * @param toDate
   * @param bboxWkt
   * @returns {Promise<IGeoFeature[]>}
   */
  getResults(query: string,
             fromDate: string,
             toDate: string,
             bboxWkt: string): Promise<IGeoFeatureCollection> {
    let params: URLSearchParams = new URLSearchParams();
    params.set('query', query);
    params.set('fromDate', fromDate);
    params.set('toDate', toDate);
    params.set('bbox', bboxWkt);

    return this.http.get(this.cswiApiUrl, {search: params})
      .toPromise()
      /* FIXME not sure if I'm happy with this so far
       http://stackoverflow.com/questions/22875636/how-do-i-cast-a-json-object-to-a-typescript-class
       */
      .then(response => <IGeoFeatureCollection>response.json())
      .catch(this.handleError);
  }

  private handleError(error: Response | any): Promise<any> {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || 'An error occurred'} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    this.notificationService.addNotification({
      type: 'warning',
      message: 'An error occurred: ' + errMsg
    });
    return Promise.reject(error.message || error);
  };
}

import { Injectable, Inject } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { CSWI_API_URL } from '../app.tokens';
import { IGeoFeatureCollection, IErrorResult } from './result';
import { Observable } from 'rxjs';
import { isNullOrUndefined } from 'util';
// import {MOCK_RESULTS} from './mock-results';

@Injectable()
export class ResultService {

  /**
   * The Service URL inject from app.module as central inject of app constants
   *
   * @type {string}
   */
  constructor(@Inject(CSWI_API_URL) private cswiApiUrl: string,
              private http: Http) {
  }

  /**
   * Queries the csw-ingester
   * @param query
   * @param fromDate
   * @param toDate
   * @param bboxWkt
   * @returns {Observable<IGeoFeatureCollection>}
   */
  getResults(query: string,
             fromDate: string,
             toDate: string,
             bboxWkt: string,
             maxNumberOfResults?: number): Observable<IGeoFeatureCollection> {
    let params: URLSearchParams = new URLSearchParams();
    params.set('query', query);
    params.set('fromDate', fromDate);
    params.set('toDate', toDate);
    params.set('bbox', bboxWkt);
    if (!isNullOrUndefined(maxNumberOfResults)) {
      params.set('maxNumberOfResults', maxNumberOfResults.toString());
    }

    // TODO SR we should externalize the URL strings to one "service" wrapper class --> cswApiService.getQueryUrl() etc.
    return this.http.get(this.cswiApiUrl + '/query', {search: params})
    /* FIXME not sure if I'm happy with this so far
     http://stackoverflow.com/questions/22875636/how-do-i-cast-a-json-object-to-a-typescript-class
     */
      .map((response: Response) => <IGeoFeatureCollection>response.json())
      .catch((errorResponse: Response) => this.handleError(errorResponse));
  }

  /**
   *
   * @param error
   * @returns {any}
   */
  private handleError(errorResponse: Response) {
    console.log(errorResponse);

    if (errorResponse.headers.get('content-type').startsWith('text/json')) {
      let errorResult: IErrorResult = <IErrorResult>errorResponse.json();
      let message: String = `${errorResponse.statusText} while querying ingester: ${errorResult.message}`;
      return Observable.throw(<IErrorResult>{message: message, details: errorResult.details});
    }
    else {
      let message: String = `${errorResponse.statusText} (${errorResponse.status}) for ${errorResponse.url}`
      return Observable.throw(<IErrorResult>{message: message, details: errorResponse.text()})
    }
  }

}

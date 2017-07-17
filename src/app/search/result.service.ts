import { Injectable, Inject } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { CSWI_API_URL } from '../in-app-config';
import { IGeoFeatureCollection, IErrorResult } from './result';
import { Observable } from 'rxjs';
import { isNullOrUndefined } from 'util';
import * as moment from 'moment';

@Injectable()
export class ResultService {

  /** default date format */
  private DATE_FORMAT = 'YYYY-MM-DD';

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
   *
   * @param query
   * @param fromDate
   * @param toDate
   * @param bboxWkt
   * @param maxNumberOfResults
   * @returns {Observable<R|T>}
   */
  getResults(query: string,
             fromDate = moment('1970-01-01', this.DATE_FORMAT).format(this.DATE_FORMAT),
             toDate = moment().format(this.DATE_FORMAT),
             bboxWkt = 'ENVELOPE(-180,180,90,-90)',
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
    return this.http.get(this.cswiApiUrl + '/query', {params: params})
    /* FIXME not sure if I'm happy with this so far
     http://stackoverflow.com/questions/22875636/how-do-i-cast-a-json-object-to-a-typescript-class
     */
      .map((response: Response) => <IGeoFeatureCollection>response.json())
      .catch((errorResponse: Response) => this.handleError(errorResponse));
  }

  /**
   * Handles errors
   * @param error
   * @returns {any}
   */
  private handleError(errorResponse: Response) {
    console.log(errorResponse);

    if (errorResponse.headers.get('content-type').startsWith('text/json')) {
      let errorResult: IErrorResult = <IErrorResult>errorResponse.json();
      let message: String = `${errorResponse.statusText} while querying ingester: ${errorResult.message}`;
      return Observable.throw(<IErrorResult>{message: message, details: errorResult.details});
    } else {
      let message: String = `${errorResponse.statusText} (${errorResponse.status}) for ${errorResponse.url}`;
      return Observable.throw(<IErrorResult>{message: message, details: errorResponse.text()});
    }
  }
}

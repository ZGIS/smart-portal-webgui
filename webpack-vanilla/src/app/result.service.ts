import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';

import 'rxjs/add/operator/toPromise';

// import {MOCK_RESULTS} from './mock-results';
import { IGeoFeatureCollection } from './result';

@Injectable()
export class ResultService {
  private url = 'http://localhost:9000/query';

  constructor(private http: Http) {}

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

    return this.http.get(this.url, {search: params})
      .toPromise()
      /* FIXME not sure if I'm happy with this so far
      http://stackoverflow.com/questions/22875636/how-do-i-cast-a-json-object-to-a-typescript-class
      */
      .then(response => <IGeoFeatureCollection>response.json() )
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}

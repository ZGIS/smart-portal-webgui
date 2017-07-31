import { Injectable, Inject } from '@angular/core';
import { Http, Response, URLSearchParams } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { CSWI_API_URL } from '../in-app-config';
import { IGeoFeatureCollection, IErrorResult, IGeoFeature } from './result';
import { Observable } from 'rxjs';
import { isNullOrUndefined } from 'util';
import * as moment from 'moment';
import { OwcContext, OwcResource } from '../owc/collections';
import * as _ from 'lodash';

@Injectable()
export class ResultService {

  /** default date format */
  private DATE_FORMAT = 'YYYY-MM-DD';

  /**
   * The Service URL inject from app.module as central inject of app constants
   *
   * @type {string}
   */
  constructor( @Inject(CSWI_API_URL) private cswiApiUrl: string,
               private http: Http ) {
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
  getResults( query: string,
              fromDate = moment('1970-01-01', this.DATE_FORMAT).format(this.DATE_FORMAT),
              toDate = moment().format(this.DATE_FORMAT),
              bboxWkt = 'ENVELOPE(-180,180,90,-90)',
              maxNumberOfResults?: number ): Observable<IGeoFeatureCollection> {

    let params: URLSearchParams = new URLSearchParams();
    params.set('query', query);
    params.set('fromDate', fromDate);
    params.set('toDate', toDate);
    params.set('bbox', bboxWkt);
    params.set('contentType', 'GeoJson');
    if (!isNullOrUndefined(maxNumberOfResults)) {
      params.set('maxNumberOfResults', maxNumberOfResults.toString());
    }

    // TODO SR we should externalize the URL strings to one "service" wrapper class -->
    // cswApiService.getQueryUrl() etc.
    return this.http.get(this.cswiApiUrl + '/query', {params: params})
      .map(
        ( response: Response ) => {
          if (<IGeoFeatureCollection>response.json()) {
            let featureCollectionJson: IGeoFeatureCollection = response.json();
            const scores = featureCollectionJson.features.map(f => f.properties.searchScore);
            const maxValue = _.max(scores);
            const minValue = _.min(scores);
            // const minValue = 0;
            const normalised: IGeoFeature[] = featureCollectionJson.features.map(f => {
              const normalScore: number = (f.properties.searchScore - minValue) / (maxValue - minValue);
              let geoFeature = f;
              geoFeature.properties.searchScore = normalScore;
              return geoFeature;
            });
            featureCollectionJson.features = normalised;
            return featureCollectionJson;
          } else {
            let message: String = 'FeatureCollection not of type GeoJson';
            return Observable.throw(<IErrorResult>{
              message: message,
              details: `${response.statusText} (${response.status}) for ${response.url}`
            });
          }
        }
      )
      .catch(( errorResponse: Response ) => this.handleError(errorResponse));
  }

  /**
   * new content type to migrate for better linkages and offerings and copying of results into
   * user collections
   *
   * @param query
   * @param fromDate
   * @param toDate
   * @param bboxWkt
   * @param maxNumberOfResults
   * @returns {Observable<R|T>}
   */
  getResultsAsOwcGeoJson( query: string,
                          fromDate = moment('1970-01-01', this.DATE_FORMAT).format(
                            this.DATE_FORMAT),
                          toDate = moment().format(this.DATE_FORMAT),
                          bboxWkt = 'ENVELOPE(-180,180,90,-90)',
                          maxNumberOfResults?: number ): Observable<OwcContext> {

    let params: URLSearchParams = new URLSearchParams();
    params.set('query', query);
    params.set('fromDate', fromDate);
    params.set('toDate', toDate);
    params.set('bbox', bboxWkt);
    params.set('contentType', 'OwcContext');
    if (!isNullOrUndefined(maxNumberOfResults)) {
      params.set('maxNumberOfResults', maxNumberOfResults.toString());
    }

    // TODO SR we should externalize the URL strings to one "service" wrapper class -->
    // cswApiService.getQueryUrl() etc.
    return this.http.get(this.cswiApiUrl + '/query', {params: params})
      .map(
        ( response: Response ) => {
          if (<OwcContext>response.json()) {
            let featureCollectionJson: OwcContext = response.json();
            const scores = featureCollectionJson.features.map(f => f.searchScore);
            const maxValue = _.max(scores);
            const minValue = _.min(scores);
            // const minValue = 0;
            const normalised: OwcResource[] = featureCollectionJson.features.map(f => {
              const normalScore = (f.searchScore - minValue) / (maxValue - minValue);
              let owcResource = f;
              owcResource.searchScore = normalScore;
              return owcResource;
            });
            featureCollectionJson.features = normalised;
            return featureCollectionJson;
          } else {
            let message: String = 'FeatureCollection not of type GeoJson';
            return Observable.throw(<IErrorResult>{
              message: message,
              details: `${response.statusText} (${response.status}) for ${response.url}`
            });
          }
        }
      )
      .catch(( errorResponse: Response ) => this.handleError(errorResponse));
  }

  /**
   * Handles errors
   * @param errorResponse
   * @returns {any}
   */
  private handleError( errorResponse: Response ) {
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

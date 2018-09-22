import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { IErrorResult } from '../search/result';
import { SparqlResult } from './glossary.types';

/**
 *
 */
@Injectable()
export class GlossaryService {

  constructor( private http: Http ) {

  }

  /**
   * query Sparql for skos:Collections to get members of the collection with IRI id
   * and label
   *
   * @param {string} conceptUri
   * @param {string} spqQueryEndpoint
   * @returns {Observable<SparqlResult>}
   */
  public querySparqlCollection( conceptUri: string, spqQueryEndpoint: string ): Observable<SparqlResult> {

    let headers = new Headers({
      'Content-Type': 'application/sparql-query',
      'Accept': 'application/sparql-results+json,application/json'
    });
    let options = new RequestOptions({ headers: headers, withCredentials: false });

    const rq = this.getQueryForCollection(conceptUri);
    // console.log(rq);

    return this.http.post(spqQueryEndpoint, rq, options)
      .map(
        ( response: Response ) => {
          const sparqlResultJson = <SparqlResult>response.json();
          // console.log(sparqlResultJson);
          return sparqlResultJson;
        }
      )
      .catch(( errorResponse: Response ) => this.handleError(errorResponse));
  }

  /**
   * query Sparql for skos:Concept the actual terms with its attribute names and
   * the value
   *
   * @param {string} conceptUri
   * @param {string} spqQueryEndpoint
   * @returns {Observable<SparqlResult>}
   */
  public querySparqlConceptAttributes( conceptUri: string, spqQueryEndpoint: string ): Observable<SparqlResult> {

    let headers = new Headers({
      'Content-Type': 'application/sparql-query',
      'Accept': 'application/sparql-results+json,application/json'
    });
    let options = new RequestOptions({ headers: headers, withCredentials: false });

    const rq = this.getQueryForConcept(conceptUri);
    // console.log(rq);

    return this.http.post(spqQueryEndpoint, rq, options)
      .map(
        ( response: Response ) => {
          let sparqlResultJson = <SparqlResult>response.json();
          // console.log(sparqlResultJson);
          return sparqlResultJson;
        }
      )
      .catch(( errorResponse: Response ) => this.handleError(errorResponse));
  }

  /**
   * build sparql query to enquiry about all members of the referenced collection
   *
   * @param {string} conceptUri
   * @returns {string}
   */
  private getQueryForCollection( conceptUri: string ): string {
    return `PREFIX rdf:   <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs:   <http://www.w3.org/2000/01/rdf-schema#>
PREFIX dc:   <http://purl.org/dc/elements/1.1/>
PREFIX dcterms:   <http://purl.org/dc/terms/>
PREFIX skos:   <http://www.w3.org/2004/02/skos/core#>

SELECT ?iri ?label  WHERE {
  ?iri skos:inCollection <${conceptUri}> .
  ?iri skos:label ?label .
}
`;

  }

  /**
   * build sparql query for a specific concept / term
   *
   * @param {string} conceptUri
   * @returns {string}
   */
  private getQueryForConcept( conceptUri: string ): string {
    return `PREFIX rdf:   <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs:   <http://www.w3.org/2000/01/rdf-schema#>
PREFIX dc:   <http://purl.org/dc/elements/1.1/>
PREFIX dcterms:   <http://purl.org/dc/terms/>
PREFIX skos:   <http://www.w3.org/2004/02/skos/core#>

SELECT ?att ?val WHERE {
  <${conceptUri}> ?att ?val .
}`;

  }

  /**
   *
   * @param errorResponse
   * @returns {any}
   */
  private handleError( errorResponse: Response ) {
    console.log(errorResponse);

    if (errorResponse.headers.get('content-type').startsWith('text/json') ||
      errorResponse.headers.get('content-type').startsWith('application/json')) {
      let errorResult: IErrorResult = <IErrorResult>errorResponse.json();
      let message: String = `${errorResponse.statusText}: ${errorResult.message}`;
      return Observable.throw(<IErrorResult>{ message: message, details: errorResult.details });
    } else {
      let message: String = `${errorResponse.statusText} (${errorResponse.status}) for ${errorResponse.url}`;
      return Observable.throw(<IErrorResult>{ message: message, details: errorResponse.text() });
    }
  }
}

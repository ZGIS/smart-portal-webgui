import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, Response } from '@angular/http';
import { BehaviorSubject, Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { IErrorResult } from '../search';
import { IDashboardCategory } from './categories';
import { isNullOrUndefined } from 'util';

const categoriesSparqlGraph = 'https://vocab.smart-project.info/spq-categories/get';

/**
 * service holder for the categories and provide some logic helpers
 */
@Injectable()
export class CategoriesService {

  private mainCategoriesQueryStrings: string[] = [];

  private categoriesSparqlCacheSubject: BehaviorSubject<IDashboardCategory[]> = new BehaviorSubject([]);

  /**
   *
   */
  constructor( private http: Http ) {

    this.loadInitialCategories()
      .subscribe(
        jsonLdGraphCategories => {
          console.log(jsonLdGraphCategories);
          this.categoriesSparqlCacheSubject.next(jsonLdGraphCategories);
          jsonLdGraphCategories.forEach(( parentObj: IDashboardCategory ) => {
            if (parentObj.query_string) {
              this.mainCategoriesQueryStrings.push(parentObj.query_string);
            }
          });
        },
        error => {
          console.log(<any>error);
          this.categoriesSparqlCacheSubject.next([]);
        });
  }

  /**
   *
   * @returns {Observable<IDashboardCategory[]>}
   */
  public getAllCategories(): Observable<IDashboardCategory[]> {
    return this.categoriesSparqlCacheSubject.asObservable();
  }

  /**
   *
   * @param query_string
   * @returns {Observable<IDashboardCategory>}
   */
  public getMainCategoryForQueryString( query_string: string ): Observable<IDashboardCategory> {
    return this.categoriesSparqlCacheSubject.map(categories => categories.find(
      ( catObj: IDashboardCategory ) => (catObj.query_string === query_string) && (catObj.parent === 'main')
    ));
  }

  /**
   *
   * @param id
   * @returns {Observable<R>}
   */
  public getCildCategoryById( id: number ): Observable<IDashboardCategory> {
    // console.log('get child for ' + id);
    return this.categoriesSparqlCacheSubject.map((categories: IDashboardCategory[]) => {
      // console.log('observable map');
      const nested = categories.map(mainCategory => mainCategory.children);
      // console.log('in nested: ' + nested.length);
      const flattenedArray = ([] as IDashboardCategory[]).concat(...nested);
      // console.log('in flattenedArray: ' + flattenedArray.length);
      return flattenedArray.find(
        ( catObj: IDashboardCategory ) => (catObj.id === id)
      );
    });
  }

  /**
   *
   * @param child
   * @returns {IDashboardCategory}
   */
  public updateQueryStringforChildCategory( child: IDashboardCategory ): IDashboardCategory {

    let newChild = child;
    let keywordsQueryString = '';
    let catchallQueryString = '';

    if ((!child.query_string || child.query_string === '') && child.keyword_content.length > 0) {
      let singleKeywordQueries = child.keyword_content.map(keyword =>
        `keywords:"${keyword}"`
      );

      let singleFulltextQueries = child.keyword_content.map(keyword =>
        `catch_all:${keyword}`
      );

      singleKeywordQueries.forEach(( q: string ) => {
        if (keywordsQueryString === '') {
          keywordsQueryString = q;
        } else {
          keywordsQueryString = q.concat(' OR ', keywordsQueryString);
        }
      });

      singleFulltextQueries.forEach(( q: string ) => {
        if (catchallQueryString === '') {
          catchallQueryString = q;
        } else {
          catchallQueryString = q.concat(' OR ', catchallQueryString);
        }
      });
    } else {
      if (this.mainCategoriesQueryStrings.indexOf(child.query_string) > -1) {
        newChild.parent = 'main';
      }
    }

    if (keywordsQueryString !== '') {
      newChild.query_string = `(${keywordsQueryString})^1.5 OR ${catchallQueryString}`;
    }

    return newChild;
  }

  /**
   * not query but get full categories graph at once to parse into our categories
   *
   * @returns {Observable<IDashboardCategory[]>}
   */
  private loadInitialCategories(): Observable<IDashboardCategory[]> {
    let headers = new Headers({
      'Accept': 'application/ld+json'
    });
    let options = new RequestOptions({ headers: headers, withCredentials: false });

    return this.http.get(categoriesSparqlGraph, options)
      .map(
        ( response: Response ) => {
          const jsonLdGraph = response.json()[ '@graph' ];

          let mainCats: IDashboardCategory[] = [];
          let childCats: IDashboardCategory[] = [];

          jsonLdGraph.forEach((jsonLdCategory: any) => {
            let tmpKeywords = [];
            if (jsonLdCategory.keyword_content && jsonLdCategory.keyword_content !== '') {
              tmpKeywords = jsonLdCategory.keyword_content.split(',').map(( item: string ) => item.trim());
            }
            if (jsonLdCategory[ '@type' ] === 'http://vocab.smart-project.info/categories.rdfs#MainCategory') {
              mainCats.push(<IDashboardCategory>{
                id: Number(jsonLdCategory.id) || 0,
                hierarchy_number: jsonLdCategory.hierarchy_number,
                item_name: jsonLdCategory.item_name,
                description: jsonLdCategory.description,
                keyword_content: tmpKeywords,
                query_string: jsonLdCategory.query_string,
                parent: jsonLdCategory.parent,
                icon: jsonLdCategory.icon,
                bg_icon: jsonLdCategory.bg_icon
              });
            } else if (jsonLdCategory[ '@type' ] === 'http://vocab.smart-project.info/categories.rdfs#ChildCategory') {
              childCats.push(<IDashboardCategory>{
                id: Number(jsonLdCategory.id) || 0,
                hierarchy_number: jsonLdCategory.hierarchy_number,
                item_name: jsonLdCategory.item_name,
                description: jsonLdCategory.description,
                keyword_content: tmpKeywords,
                query_string: jsonLdCategory.query_string,
                parent: jsonLdCategory.parent,
                icon: jsonLdCategory.icon,
                bg_icon: jsonLdCategory.bg_icon
              });
            }
          });
          let finalCats = [] as IDashboardCategory[];
          mainCats.forEach(mainCat => {
            let mychildren: IDashboardCategory[] = childCats.filter(
              ( childCat: IDashboardCategory ) => childCat.parent === mainCat.query_string);
            // console.log(mainCat);
            mainCat.children = mychildren;
            finalCats.push(mainCat);
          });
          // console.log(finalCats);
          return finalCats;
        }
      )
      .catch(( errorResponse: Response ) => this.handleError(errorResponse));
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

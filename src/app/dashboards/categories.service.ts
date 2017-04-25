import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { IDashboardCategory } from './categories';

const myCategories = require('json-loader!./../../public/categories.json');

/**
 * service holder for the categories and provide some logic helpers
 */
@Injectable()
export class CategoriesService {

  private categoriesHolder: BehaviorSubject<IDashboardCategory[]> = new BehaviorSubject([]);
  private mainCategoriesQueryStrings: string[] = [];

  /**
   *
   */
  constructor() {
    this.categoriesHolder.next(myCategories.categories);
    myCategories.categories.forEach((parentObj: IDashboardCategory) => {
      if (parentObj.query_string) {
        this.mainCategoriesQueryStrings.push(parentObj.query_string);
      }
    });
  }

  /**
   *
   * @returns {Observable<IDashboardCategory[]>}
   */
  public getAllCategories(): Observable<IDashboardCategory[]> {
    return this.categoriesHolder.asObservable();
  }

  /**
   *
   * @param query_string
   * @returns {Observable<IDashboardCategory>}
   */
  public getMainCategoryForQueryString(query_string: string): Observable<IDashboardCategory> {
    return this.categoriesHolder.map(categories => categories.find(
      ( (catObj: IDashboardCategory) => (catObj.query_string === query_string) && (catObj.parent === 'main'))
    ));
  }

  /**
   *
   * @param id
   * @returns {Observable<R>}
   */
  public getCildCategoryById(id: number): Observable<IDashboardCategory> {
    return this.categoriesHolder.flatMap(categories => categories.map(
      catObj => catObj.children)
    ).map(categories => categories.find(
      ( (catObj: IDashboardCategory) => (catObj.id === id) )
    ));
  }

  /**
   *
   * @param child
   * @returns {IDashboardCategory}
   */
  public updateQueryStringforChildCategory(child: IDashboardCategory): IDashboardCategory {

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

      singleKeywordQueries.forEach((q: string) => {
        if (keywordsQueryString === '') {
          keywordsQueryString = q;
        } else {
          keywordsQueryString = q.concat(' OR ', keywordsQueryString);
        }
      });

      singleFulltextQueries.forEach((q: string) => {
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
}

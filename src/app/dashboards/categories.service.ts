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

  /**
   *
   */
  constructor() {
    this.categoriesHolder.next(myCategories.categories);
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
  public getMainCategoryForQueryString( query_string: string ): Observable<IDashboardCategory> {
    return this.categoriesHolder.map(categories => categories.find(
      ( ( catObj: IDashboardCategory ) => (catObj.query_string === query_string) && (catObj.parent === 'main'))
    ));

  }
}

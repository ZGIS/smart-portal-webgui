import { Injectable } from '@angular/core';
import {
  Router,
  Resolve,
  ActivatedRouteSnapshot, RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { isNullOrUndefined } from 'util';
import { CategoriesService } from '../dashboards';
import { IDashboardCategory } from '../dashboards';
import { IErrorResult } from '../search';
import { NotificationService } from '../notifications';

@Injectable()
export class ChildCategoriesResolve implements Resolve<IDashboardCategory> {

  constructor( private categoriesService: CategoriesService,
               private router: Router,
               private notificationService: NotificationService ) {
  }

  resolve( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): Observable<IDashboardCategory> {
    let categoryIdAsString = route.queryParams.categoryId;
    // console.log(`actual resolver categoryIdAsString with ${categoryIdAsString}`);
    let categoryIdAsNumber = Number(categoryIdAsString).valueOf();
    // console.log(`actual resolver categoryIdAsNumber with ${categoryIdAsNumber}`);
    // return this.categoriesService.getCildCategoryById(categoryIdAsNumber).filter(cat => !!cat).first();
    return this.categoriesService.getCildCategoryById(categoryIdAsNumber).skipWhile<IDashboardCategory>(( data, idx ) => {
      console.log(`skipping ${idx}`);
      return isNullOrUndefined(data);
    }).first().map(( category: IDashboardCategory ) => {
      if (category) {
        // console.log(category);
        return category;
      } else { // id not found
        this.notificationService.addNotification({
          type: 'warning',
          message: 'This category id was not found, sorry.'
        });
        throw <IErrorResult>{ message: 'This id was not found, sorry.' };
      }
    }).catch(err => {
      this.notificationService.addNotification({
        type: 'warning',
        message: 'This category id was not found, sorry.',
        details: err
      });
      return Observable.throw(<IErrorResult>{ message: 'This id was not found, sorry.', details: err });
    });
  }
}

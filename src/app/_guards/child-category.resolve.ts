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
import { CategoriesService }  from '../dashboards';
import { IDashboardCategory } from '../dashboards';

@Injectable()
export class ChildCategoriesResolve implements Resolve<any> {

  constructor(private categoriesService: CategoriesService, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IDashboardCategory> | boolean {
    let categoryIdAsString = route.params.categoryId;
    let categoryIdAsNumber = Number(categoryIdAsString).valueOf();
    console.log(`actual resolver doing sth wiht ${categoryIdAsNumber}`);
    return this.categoriesService.getCildCategoryById(categoryIdAsNumber).map (cat => {
      if (cat) {
        return cat;
      } else { // id not found
        console.log('error in resolve');
        this.router.navigate([ '/dashboard' ]);
        return false;
      }
    }).first();

  }
}

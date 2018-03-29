import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { CollectionsService, OwcContext } from '../owc';
import { AccountService } from '../account';

@Injectable()
export class OwcContextIdResolve implements Resolve<OwcContext> {

  constructor( private accountService: AccountService,
               private collectionsService: CollectionsService ) {
  }

  resolve( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): Observable<OwcContext> {
    let owcId = route.queryParams.id;
    console.log(`resolve: ${owcId}`);
    let owc: Observable<OwcContext> = this.accountService.isLoggedIn().flatMap(
      loggedInResult => {
        return this.collectionsService.queryCollectionsForViewing(loggedInResult, owcId, []).filter(
          collections => collections.length > 0
        ).map(filteredCollections => filteredCollections[ 0 ]);
      }
    );
    return owc;
  }
}

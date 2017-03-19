import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { IGeoFeatureCollection, IGeoFeature, ResultService } from '../search';
import * as moment from 'moment';
import { NotificationService } from '../notifications/notification.service';

// let moment = require('moment');

// let smallPlaceHolderImg = require('file!./../../../public/images/icon_folder_640.png');
// let largePaceHolderImg = require('file!./../../../public/images/icon_folder_1280.png');

@Component({
  selector: 'app-sac-gwh-result-cards',
  templateUrl: 'result-cards.component.html',
  styleUrls: ['result-cards.component.css'],
})

/**
 * CardComponent to show search results in Dashboard
 */
export class ResultCardsComponent implements OnInit, OnDestroy {

  results: IGeoFeatureCollection;
  resultsGroups: String[];

  private subscription: Subscription;

  /**
   * Constructor
   * @param resultService       - injected ResultService
   * @param activatedRoute      - injected ActivatedRoute
   * @param notificationService - injected NotificationService
   */
  constructor(private resultService: ResultService,
              private activatedRoute: ActivatedRoute,
              private notificationService: NotificationService) {
  }

  /**
   * OnInit - will load search results according to current query/category
   */
  ngOnInit(): void {
    this.results = <IGeoFeatureCollection>{
      'type': 'FeatureCollection',
      'crs': {'type': 'name', 'properties': {'name': 'urn:ogc:def:crs:OGC:1.3:CRS84'}},
      'count': 0,
      'countMatched': 0,
      'features': []
    };
    this.resultsGroups = [];

    // subscribe to router event
    this.subscription = this.activatedRoute.queryParams.subscribe(
      (param: any) => {
        let query = param['query'];

        if (!query) {
          query = '*:*';
        }

        this.resultService.getResults(
          query,
          '1970-01-01',
          moment().format('YYYY-MM-DD'),
          // 'ENVELOPE(147.7369328125,201.7896671875,-23.1815078125,-50.5154921875)'
          'ENVELOPE(-180,180,-90,90)'
        ).subscribe(
          (results: IGeoFeatureCollection) => {
            this.results = results;
            this.resultsGroups = this.getCataloguesOfResults();
          },
          (error: any) => {
            this.notificationService.addErrorResultNotification(error);
          }
        );
      });
  }

  /**
   * OnDestroy
   */
  ngOnDestroy(): void {
    // TODO SR this should not be needed anymore
    // prevent memory leak by unsubscribing
    this.subscription.unsubscribe();
  }

  /**
   * gets all origin catalogues out of the resuls
   *  and returns them as string array
   */
  private getCataloguesOfResults() {
    let cat = this.results.features.map(
      (feature: IGeoFeature) => {
        return feature.properties.origin;
      }
    );
    console.log(JSON.stringify(cat));
    let uniqueCat = cat.filter(function (item, pos, self) {
      return self.indexOf(item) === pos;
    });
    console.log(uniqueCat);
    return uniqueCat;
  }
}

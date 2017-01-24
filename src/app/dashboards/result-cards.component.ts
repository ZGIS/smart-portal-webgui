import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { IGeoFeatureCollection, IGeoFeature, ResultService } from '../search';
import * as moment from 'moment';

// let moment = require('moment');

// let smallPlaceHolderImg = require('file!./../../../public/images/icon_folder_640.png');
// let largePaceHolderImg = require('file!./../../../public/images/icon_folder_1280.png');

@Component({
  selector: 'app-sac-gwh-result-cards',
  templateUrl: 'result-cards.component.html',
  styleUrls: ['result-cards.component.css'],
})

export class ResultCardsComponent implements OnInit, OnDestroy {

  results: IGeoFeatureCollection;
  resultsGroups: String[];

  private subscription: Subscription;

  constructor(private resultService: ResultService,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.results = {
      'type': 'FeatureCollection',
      'crs': {'type': 'name', 'properties': {'name': 'urn:ogc:def:crs:OGC:1.3:CRS84'}},
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
          'ENVELOPE(147.7369328125,201.7896671875,-23.1815078125,-50.5154921875)')
          .then(results => {
            this.results = results;
            this.resultsGroups = this.getCataloguesOfResults();
          });
      });
  }

  ngOnDestroy(): void {
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

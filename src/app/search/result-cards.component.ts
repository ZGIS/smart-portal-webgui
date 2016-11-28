import {Component, OnInit, OnDestroy} from '@angular/core';
import {IGeoFeatureCollection} from './result';
import {ResultService} from './result.service';
import moment = require('moment');
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'my-result-cards',
  templateUrl: './result-cards.component.html'
})

export class ResultCardsComponent implements OnInit, OnDestroy {

  results: IGeoFeatureCollection;

  private subscription: Subscription;

  constructor(private resultService: ResultService,
              private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.results = {
      'type': 'FeatureCollection',
      'crs': {'type': 'name', 'properties': {'name': 'urn:ogc:def:crs:OGC:1.3:CRS84'}},
      'features': []
    };

    // subscribe to router event
    this.subscription = this.activatedRoute.queryParams.subscribe(
      (param: any) => {
        let query = param['query'];

        this.resultService.getResults(
          query,
          '1970-01-01',
          moment().format('YYYY-MM-DD'),
          "ENVELOPE(147.7369328125,201.7896671875,-23.1815078125,-50.5154921875)")
          .then(results => {
            this.results = results
          });
      });
  }

  ngOnDestroy(): void {
    // prevent memory leak by unsubscribing
    this.subscription.unsubscribe();
  }
}

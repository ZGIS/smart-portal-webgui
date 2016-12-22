import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { NotificationService } from '../notifications';
import { IOwcDocument } from './';
import { CollectionsService } from './';

@Component({
  selector: 'sac-gwh-collections',
  templateUrl: './collections.component.html',
  styleUrls: []
})

export class CollectionsComponent implements OnInit {

  myCollection: IOwcDocument;

  constructor(private _collectionsService: CollectionsService, private router: Router,
              private http: Http, private _notificationService: NotificationService) {
  }

  ngOnInit() {
    // get owcDoc from secure api end point
    this._collectionsService.getDefaultCollection()
      .subscribe(
        owcDoc => {
          this.myCollection = owcDoc;
        },
        error => {
          console.log(<any>error);
          this._notificationService.addNotification({type: 'ERR', message: error.toString()});
        });
  }
}

import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';
import { NotificationService } from '../notifications';
import { IOwcDocument } from './';
import { CollectionsService } from './';

@Component({
  selector: 'app-sac-gwh-collections',
  templateUrl: 'collections.component.html',
  styleUrls: []
})

export class CollectionsComponent implements OnInit {

  myCollection: IOwcDocument;

  constructor(private collectionsService: CollectionsService, private router: Router,
              private http: Http, private notificationService: NotificationService) {
  }

  ngOnInit() {
    // get owcDoc from secure api end point
    this.collectionsService.getDefaultCollection()
      .subscribe(
        owcDoc => {
          this.myCollection = owcDoc;
        },
        error => {
          console.log(<any>error);
          this.notificationService.addNotification({type: 'warning', message: error.toString()});
        });
  }
}

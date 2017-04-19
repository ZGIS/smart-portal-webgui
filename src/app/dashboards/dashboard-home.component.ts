import { Component, OnInit } from '@angular/core';
import { IDashboardCategory } from './categories';
import { CategoriesService } from './categories.service';
import { NotificationService } from '../notifications';

// const myCategories = require('json-loader!./../../public/categories.json');

@Component({
  selector: 'app-sac-gwh-dashboard-home',
  templateUrl: 'dashboard-home.component.html',
  styleUrls: [ 'dashboard-home.component.css' ]
})

export class DashboardHomeComponent implements OnInit {

  categoryObjs: IDashboardCategory[] = [];
  categoryImgs: string[] = [];

  constructor( private categoriesService: CategoriesService,
               private notificationService: NotificationService ) {
  };

  ngOnInit(): void {
    this.categoriesService.getAllCategories()
      .subscribe(
        result => {
          result.forEach(( catObj: IDashboardCategory ) => {
            let imgUrl = '/images/dashboard/' + catObj.icon;
            this.categoryImgs.push(imgUrl);
            this.categoryObjs.push(catObj);
          });
        },
        error => {
          this.notificationService.addErrorResultNotification(error);
        });
  }
}

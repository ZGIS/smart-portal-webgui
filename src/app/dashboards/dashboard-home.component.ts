import { Component, OnInit } from '@angular/core';
import { IDashboardCategory } from './categories';

const myCategories = require('json-loader!./../../public/categories.json');

@Component({
  selector: 'app-sac-gwh-dashboard-home',
  templateUrl: 'dashboard-home.component.html',
  styleUrls: ['dashboard-home.component.css']
})

export class DashboardHomeComponent implements OnInit {

  categoryObjs: IDashboardCategory[] = [];
  categoryImgs: string[] = [];

  ngOnInit(): void {
    myCategories.categories.forEach(( catObj: IDashboardCategory ) => {
      let imgUrl = '/images/dashboard/' + catObj.icon;
      this.categoryImgs.push(imgUrl);
      this.categoryObjs.push(catObj);
    });
  }
}

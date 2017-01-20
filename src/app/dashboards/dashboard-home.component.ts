import { Component, OnInit } from '@angular/core';

const myCategories = require('json-loader!./../../public/categories.json');

@Component({
  selector: 'sac-gwh-dashboard-home',
  templateUrl: 'dashboard-home.component.html',
  styleUrls: ['dashboard-home.component.css']
})

export class DashboardHomeComponent implements OnInit {

  categoryObjs: any[] = [];
  categoryImgs: string[] = [];

  ngOnInit(): void {
    myCategories.categories.forEach(( catObj: any ) => {

      let imgUrl = '/public/images/dashboard/' + catObj.icon;
      this.categoryImgs.push(imgUrl);
      this.categoryObjs.push(catObj);

    });
  }
}

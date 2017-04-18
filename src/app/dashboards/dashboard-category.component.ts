import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { IDashboardCategory } from './categories';

// TODO SR make service out of that?
const myCategories = require('json-loader!./../../public/categories.json');

@Component({
  selector: 'app-sac-gwh-dashboard-category',
  templateUrl: 'dashboard-category.component.html',
  styleUrls: [ 'dashboard-category.component.css' ]
})

export class DashboardCategoryComponent implements OnInit {

  categoryName = '';
  description = '';
  bgImage: any = {};
  children: IDashboardCategory[] = [];
  childrenImg: string[] = [];
  placeHolderImg = '/images/dashboard/0-placeholder-water-icon.jpg';

  ngOnInit(): void {
    this.route.params.forEach(( params: Params ) => {

      let currentCategory = params[ 'category' ];
      myCategories.categories.forEach(( catObj: IDashboardCategory ) => {
        if (catObj.query_string === currentCategory) {
          console.log(catObj);
          this.categoryName = catObj.item_name;
          this.description = catObj.description;

          let imgUrl = '/images/dashboard/' + catObj.bg_icon;
          this.bgImage.imgUrl = imgUrl;

          catObj.children.forEach(( childObj: IDashboardCategory ) => {
            this.children.push(childObj);

            let subImgUrl = '/images/dashboard/' + childObj.icon;
            this.childrenImg.push(subImgUrl);
          });
        }
      });

    });
  }

  constructor( private route: ActivatedRoute ) {
    this.bgImage.imgUrl = '/images/dashboard/0.0_main_background_empty.png';
  };

}

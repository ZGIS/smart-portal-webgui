import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';

// TODO SR make service out of that?
const myCategories = require('json-loader!./../../public/categories.json');

@Component({
  selector: 'sac-gwh-dashboard-category',
  templateUrl: 'dashboard-category.component.html',
  styleUrls: [ 'dashboard-category.component.css' ]
})

export class DashboardCategoryComponent implements OnInit {

  category = '';
  description = '';
  bgImage: any = {};
  children: any[] = [];
  childrenImg: string[] = [];
  placeHolderImg: string = '/public/images/dashboard/0-placeholder-water-icon.jpg';

  ngOnInit(): void {
    this.route.params.forEach(( params: Params ) => {

      let currentCategory = params[ 'category' ];
      myCategories.categories.forEach(( catObj: any ) => {
        if (catObj.query_string === currentCategory) {
          console.log(catObj);
          this.category = catObj.item_name;
          this.description = catObj.description;

          let imgUrl = '/public/images/dashboard/' + catObj.bg_icon;
          this.bgImage.imgUrl = imgUrl;

          catObj.children.forEach(( childObj: any ) => {
            this.children.push(childObj);

            let subImgUrl = '/public/images/dashboard/' + childObj.icon;
            this.childrenImg.push(subImgUrl);
          });
        }
      });

    });
  }

  constructor( private route: ActivatedRoute ) {
    this.bgImage.imgUrl = '/public/images/dashboard/0.0_main_background.png';
  };

}

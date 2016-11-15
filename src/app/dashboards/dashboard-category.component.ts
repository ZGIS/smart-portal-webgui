import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';

let myCategories = require("json!./../../../public/categories.json");
let placeHolderImg = require("file!./../../../public/images/0-placeholder-water-icon.jpg");

@Component({
  selector: 'sac-gwh-dashboard-category',
  templateUrl: './dashboard-category.component.html',
  styleUrls: ['./dashboard-category.component.css']
})

export class DashboardCategoryComponent implements OnInit {

  // query=groundwater&bbox=ENVELOPE(155.0,180.0,-30.0,-55.0)
  category = '';
  description = '';
  bg_image = placeHolderImg;

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {

      let currentCategory = params['category'];
      myCategories.categories.forEach((catObj: any) => {
        if (catObj.query_string == currentCategory) {
          console.log(catObj);
          this.category = catObj.item_name;
          this.description = catObj.description;
          this.bg_image = catObj.bg_icon;
        }
      });

    });
  }

  constructor( private route: ActivatedRoute) {};

}

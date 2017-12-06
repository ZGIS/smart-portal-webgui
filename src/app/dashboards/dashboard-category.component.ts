import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { IDashboardCategory } from './categories';
import { CategoriesService } from './categories.service';
import { NotificationService } from '../notifications/notification.service';

@Component({
  selector: 'app-sac-gwh-dashboard-category',
  templateUrl: 'dashboard-category.component.html',
  styleUrls: [ 'dashboard-home.component.less' ]
})

export class DashboardCategoryComponent implements OnInit {

  categoryName = '';
  description = '';
  bgImage: any = {};
  children: IDashboardCategory[] = [];
  childrenImg: string[] = [];
  placeHolderImg = '/images/dashboard/0-placeholder-water-icon.jpg';

  constructor( private route: ActivatedRoute,
               private categoriesService: CategoriesService,
               private notificationService: NotificationService ) {
    this.bgImage.imgUrl = '/images/dashboard/0.0_main_background_empty.png';
  }

  ngOnInit(): void {

    this.route.params.forEach(( params: Params ) => {

      let currentCategory = params[ 'category' ];

      this.categoriesService.getMainCategoryForQueryString(currentCategory)
        .subscribe(
          catObj => {
            if (catObj && catObj.query_string === currentCategory) {
              this.children = [];
              // console.log(catObj);
              this.categoryName = catObj.item_name;
              this.description = catObj.description;

              let imgUrl = '/images/dashboard/' + catObj.bg_icon;
              this.bgImage.imgUrl = imgUrl;

              catObj.children.forEach(( childObj: IDashboardCategory ) => {

                let newChild = this.categoriesService.updateQueryStringforChildCategory(childObj);
                // console.log(newChild.query_string);

                this.children.push(childObj);

                let subImgUrl = '/images/dashboard/' + childObj.icon;
                this.childrenImg.push(subImgUrl);
              });
            }
          },
          error => {
            this.notificationService.addErrorResultNotification(error);
          });

    });
  }

}

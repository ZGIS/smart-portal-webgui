import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';

@Component({
  selector: 'sac-gwh-dashboard-category',
  templateUrl: './dashboard-category.component.html',
  styleUrls: ['./dashboard-category.component.css']
})

export class DashboardCategoryComponent implements OnInit {

  category = 'waterbudget';

  ngOnInit(): void {
    this.route.params.forEach((params: Params) => {
      this.category = params['category'];
    });
  }

  constructor( private route: ActivatedRoute) {};

}
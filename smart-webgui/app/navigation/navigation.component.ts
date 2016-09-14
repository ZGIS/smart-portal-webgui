import {Component} from '@angular/core';

@Component({
  selector: 'sac-gwh-navigation',
  templateUrl: 'app/navigation/navigation.component.html'
//  styleUrls: [ 'app/navigation/navigation.component.css' ]
})

export class NavigationComponent {
  //FIXME make this an enum or so
  currentNav: string;
}

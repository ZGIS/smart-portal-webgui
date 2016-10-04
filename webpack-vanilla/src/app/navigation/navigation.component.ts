import {Component} from '@angular/core';
// import {DropdownModule} from 'ng2-bootstrap/ng2-bootstrap';

@Component({
//  directives: [DROPDOWN_DIRECTIVES],
  selector: 'sac-gwh-navigation',
  templateUrl: './navigation.component.html'
//  styleUrls: [ './navigation.component.css' ]
})

export class NavigationComponent {
  // FIXME make this an enum or so
  currentNav: string;
}

import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { IOwcDocument } from '../workbench/collections';

@Component({
  selector: 'app-sac-gwh-x3d-view',
  template: '<div id="x3dom"></div>',
  styleUrls: ['x3d-view.component.css']
})

/**
 * x3dom wrapper
 */
export class X3dViewComponent implements OnInit {

  ngOnInit(): void {
    console.log('init');
  }
}

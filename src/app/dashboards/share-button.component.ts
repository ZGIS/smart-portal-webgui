import {
  Component,
  AfterViewInit,
  OnInit,
  ViewChild,
  ElementRef, Input
} from '@angular/core';
import { ShareButtonService } from './share-button.service';

/**
 *
 */
@Component({
  selector: 'app-share-buttons',
  template: '<div #shareThis class="a2a_kit a2a_kit_size_32 a2a_default_style"' +
  ' [attr.data-a2a-url]="dataA2aUrlExt" [attr.data-a2a-title]="dataA2aTitle">' +
  '  <a class="a2a_dd" href="https://www.addtoany.com/share"></a>' +
  '  <a class="a2a_button_facebook"></a>' +
  '  <a class="a2a_button_twitter"></a>' +
  '  <a class="a2a_button_google_plus"></a>' +
  '  <a class="a2a_button_mendeley"></a>' +
  '  <a class="a2a_button_copy_link"></a>' +
  '</div>'
})

export class ShareButtonComponent implements AfterViewInit, OnInit {
  @ViewChild('shareThis') targetRef: ElementRef;
  // data-a2a-url="http://www.example.com/page.html" data-a2a-title="Example Page Title"
  @Input() dataA2aTitle: string;
  @Input() dataA2aUrl: string;
  dataA2aUrlExt = 'https://dev.smart-portal.info/#/context/resource/';

  constructor( private shareButtonService: ShareButtonService ) {
    if (this.dataA2aUrl) {
      this.dataA2aUrlExt = this.dataA2aUrlExt + this.dataA2aUrl;
    }
  }

  ngOnInit(): void {
    if (this.dataA2aUrl) {
      this.dataA2aUrlExt = this.dataA2aUrlExt + this.dataA2aUrl;
    }
  }
  ngAfterViewInit() {
    this.shareButtonService.getReady().subscribe(
      ( ready ) => {
        if (!ready) {
          return;
        }
        console.log('share script loaded');
      });
  }
}

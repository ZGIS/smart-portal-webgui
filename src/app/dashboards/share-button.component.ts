import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { ShareButtonService } from './share-button.service';

/**
 *
 */
@Component({
  selector: 'app-share-buttons',
  template: '<div #shareThis class="a2a_kit a2a_kit_size_32 a2a_default_style">' +
  '  <a class="a2a_dd" href="https://www.addtoany.com/share"></a>' +
  '  <a class="a2a_button_facebook"></a>' +
  '  <a class="a2a_button_twitter"></a>' +
  '  <a class="a2a_button_google_plus"></a>' +
  '  <a class="a2a_button_mendeley"></a>' +
  '  <a class="a2a_button_copy_link"></a>' +
  '</div>'
})

export class ShareButtonComponent implements AfterViewInit {
  @ViewChild('shareThis') targetRef: ElementRef;

  constructor(private shareButtonService: ShareButtonService) {
  }

  ngAfterViewInit() {
    this.shareButtonService.getReady().subscribe(
      (ready) => {
        if (!ready) {
          return;
        }
        console.log('share script loaded');
      });
  }
}

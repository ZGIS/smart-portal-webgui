import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { ShareButtonService } from './share-button.service';
import { PORTAL_API_URL } from '../in-app-config';

/**
 *
 */
@Component({
  selector: 'app-share-buttons',
  template: '<div *ngIf="!plain" #shareThis class="a2a_kit a2a_kit_size_32 a2a_default_style"' +
    ' [attr.data-a2a-url]="dataA2aUrlExt" [attr.data-a2a-title]="dataA2aTitle">' +
    '  <a class="a2a_dd" href="https://www.addtoany.com/share"></a>' +
    '  <a class="a2a_button_facebook"></a>' +
    '  <a class="a2a_button_twitter"></a>' +
    '  <a class="a2a_button_google_plus"></a>' +
    '  <a class="a2a_button_mendeley"></a>' +
    '  <a class="a2a_button_copy_link"></a>' +
    '</div>' +
    '<div *ngIf="plain"><a target="_blank" [href]="dataA2aUrlExt">{{ dataA2aTitle }} <i class="fa fa-globe"></i></a></div>'
})

export class ShareButtonComponent implements OnInit {
  @ViewChild('shareThis') targetRef: ElementRef;
  // data-a2a-url="http://www.example.com/page.html" data-a2a-title="Example Page Title"
  @Input() dataA2aTitle: string;
  @Input() dataA2aUrl: string;
  @Input() plain = false;
  // APP_PORTAL_API_URL=https://nz-groundwater-hub.org/api/v1
  // dataA2aUrlExt = 'https://dev.smart-project.info/#/context/resource/';
  dataA2aUrlExt_base = this.portalApiUrl.replace('/api/v1', '/#/context/resource/');
  dataA2aUrlExt = this.dataA2aUrlExt_base;

  constructor( private shareButtonService: ShareButtonService,
               @Inject(PORTAL_API_URL) private portalApiUrl: string ) {
  }

  ngOnInit(): void {
    if (this.plain) {
      return;
    }
    this.shareButtonService.isReady().subscribe(
      ( ready ) => {
        if (!ready) {
          return;
        }
        console.log('share add available');
        if (this.dataA2aUrl) {
          if (this.checkIfUrl(this.dataA2aUrl)) {
            // will know if it's complete url identifier
            this.dataA2aUrlExt = this.dataA2aUrl;
          } else {
            this.dataA2aUrlExt = this.dataA2aUrlExt_base + this.dataA2aUrl;
          }
        }
        console.log('ngoninit ' + this.dataA2aUrlExt);
      });
  }

  private checkIfUrl( testUrl: string ): boolean {
    return new RegExp('[a-zA-Z\d]+://(\w+:\w+@)?([a-zA-Z\d.-]+\.[A-Za-z]{2,4})(:\d+)?(/.*)?').test(testUrl);
  }
}

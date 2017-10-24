import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { NavigationComponent } from  './navigation/navigation.component';
import { AccountService } from './account/account.service';
import { AdminService } from './admin/admin.service';
import { API_URL_PROVIDERS, APP_VERSION_PROVIDERS } from './in-app-config';
import { Http, ConnectionBackend, BaseRequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { CookieModule, CookieService } from 'ngx-cookie';
import { NotificationService } from './notifications/notification.service';
import { CategoriesService } from './dashboards/categories.service';
import { GlossaryService } from './glossary-edu/glossary.service';
import { NotificationComponent } from './notifications/notification.component';
import { Ng2BootstrapModule } from 'ngx-bootstrap';
import { UsplashImageCreditComponent } from './navigation/usplash-credit-btn.component';


/**
 * fake backend provider
 * http://jasonwatmore.com/post/2016/08/16/
 * angular-2-jwt-authentication-example-tutorial#fakebackendprovider
 *
 */
describe('App Component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent, NavigationComponent, NotificationComponent, UsplashImageCreditComponent
      ],
      providers: [
        CookieService,
        AccountService,
        AdminService,
        NotificationService,
        GlossaryService,
        CategoriesService,
        API_URL_PROVIDERS,
        APP_VERSION_PROVIDERS,
        MockBackend,
        BaseRequestOptions,
        ConnectionBackend,
        {
          provide: Http, useFactory: (backend: ConnectionBackend,
                                      defaultOptions: BaseRequestOptions) => {
          return new Http(backend, defaultOptions);
        },
          deps: [MockBackend, BaseRequestOptions]
        }
      ],
      imports: [
        RouterTestingModule,
        Ng2BootstrapModule.forRoot(),
        CookieModule.forRoot()
        /*RouterTestingModule.withRoutes([
         {
         path: '/home',
         component: NavigationComponent
         }
         ]),*/
      ]
    }).compileComponents();
  });

  it('should work', () => {
    let fixture = TestBed.createComponent(AppComponent);

    expect(fixture.componentInstance instanceof AppComponent)
      .toBe(true, 'should create AppComponent');
  });
});

describe('AppComponent with TCB', function () {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent, NotificationComponent, UsplashImageCreditComponent
      ],
      providers: [
        CookieService,
        AccountService,
        AdminService,
        NotificationService,
        CategoriesService,
        GlossaryService,
        API_URL_PROVIDERS,
        APP_VERSION_PROVIDERS,
        Http
      ],
      imports: [
        RouterTestingModule
      ]
    });
  });

});

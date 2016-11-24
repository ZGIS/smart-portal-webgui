import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { NavigationComponent } from  './navigation/navigation.component';
import { AccountService } from './account/account.service';
import { API_URL_PROVIDERS } from './app.tokens';
import { Http, ConnectionBackend, BaseRequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { NotificationService } from './notifications/notification.service';
import { NotificationComponent } from './notifications/notification.component';
import { Ng2BootstrapModule } from 'ng2-bootstrap/ng2-bootstrap';

// import { By }             from '@angular/platform-browser';

////////  SPECS  /////////////

/// Delete this
describe('Smoke test', () => {
  it('should run a passing test', () => {
    expect(true).toEqual(true, 'should pass');
  });
});


// fake backend provider
// http://jasonwatmore.com/post/2016/08/16/
//   angular-2-jwt-authentication-example-tutorial#fakebackendprovider

describe('App Component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent, NavigationComponent, NotificationComponent
      ],
      providers: [
        CookieService,
        AccountService,
        NotificationService,
        API_URL_PROVIDERS,
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
        Ng2BootstrapModule
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
        AppComponent, NotificationComponent
      ],
      providers: [
        CookieService,
        AccountService,
        NotificationService,
        API_URL_PROVIDERS,
        Http
      ],
      imports: [
        RouterTestingModule
      ]
    });
  });

  /*
   it('should instantiate component', () => {
   let fixture = TestBed.createComponent(AppComponent);
   expect(fixture.componentInstance instanceof AppComponent)
   .toBe(true, 'should create AppComponent');
   });

   it('should have expected <h1> text', () => {
   let fixture = TestBed.createComponent(AppComponent);
   fixture.detectChanges();

   // it works
   let h1 = fixture.debugElement.query(el => el.name === 'h1').nativeElement;

   // preferred
   h1 = fixture.debugElement.query(By.css('h1')).nativeElement;

   expect(h1.innerText).toMatch(/angular 2 app/i,
   '<h1> should say something about "Angular 2 App"');
   });
   */
});

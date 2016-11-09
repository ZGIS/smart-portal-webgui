import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { NavigationComponent } from  './navigation/navigation.component';
import { AccountService } from './account/account.service';

// import { By }             from '@angular/platform-browser';

////////  SPECS  /////////////

/// Delete this
describe('Smoke test', () => {
  it('should run a passing test', () => {
    expect(true).toEqual(true, 'should pass');
  });
});

describe('App Component', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
          declarations: [
            AppComponent, NavigationComponent
          ],
          providers : [
            AccountService
          ],
          imports : [
            RouterTestingModule
            /*RouterTestingModule.withRoutes([
              {
                path: '/home',
                component: NavigationComponent
              }
            ]),*/
          ]
        }).compileComponents();
    });

    it ('should work', () => {
        let fixture = TestBed.createComponent(AppComponent);

        expect(fixture.componentInstance instanceof AppComponent)
            .toBe(true, 'should create AppComponent');
    });
});

describe('AppComponent with TCB', function () {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      providers : [
        AccountService
      ],
      imports : [
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

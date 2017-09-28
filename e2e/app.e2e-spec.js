describe('E2E Test Welcome Dashboard', function () {

  const expectedMsg = 'Welcome to the SAC groundwater hub';


  beforeEach(function () {
    // browser.ignoreSynchronization = true;
    // browser.waitForAngularEnabled(true);

    browser.get('/');
  });

  it('should display: ' + expectedMsg, function () {
    expect(element(by.id('dashboard-home')).getText()).toContain(expectedMsg);
  });

});

describe('E2E Test Dashboard Maps Category', function () {

  // const expectedMsg = 'Maps Maps and two-dimensional (map) datasets that are used in groundwater' + ' resource assessments';
  const expectedMsg = 'Understand our groundwater systems';


  beforeEach(function () {
    browser.get('/#/dashboard/1-understanding?categoryId=1');
  });


  it('should display: ' + expectedMsg, function () {
    //SR the category description has more content than just the description
    //SR changed toEqual -> toContain
    expect(element(by.id('dashboard-category')).getText()).toContain(expectedMsg);
  });

});

describe('E2E Test Dashboard Maps Category Query Aquifer has cards', function () {

  const notExpectedMsg = 'There are no documents for this query / category';

  beforeEach(function () {
    browser.get('/#/dashboard/7-protect/cards?query=(keywords%3A%22nz%20water%20quality%20maps%22)%5E1.5%20OR%20catch_all%3Anz%20water%20quality%20maps&categoryId=70');
  });

  it('should not have no-cards-found', function () {
    expect(element(by.id('no-cards-found')).isPresent()).toBeFalsy();
  });

  it('should have cards', function () {
    expect(element.all(by.tagName('app-sac-card')).count()).toBeGreaterThan(3);
  });

});

describe('E2E Test Search has map and list-tems', function () {

  beforeEach(function () {
    browser.get('/#/search');
  });

  it('should have map', function () {
    expect(element(by.className('ol-viewport')).isPresent()).toBe(true);
  });

  it('should have many list items', function () {
    expect(element.all(by.className('list-group-item')).count()).toBeGreaterThan(3);
  });

});

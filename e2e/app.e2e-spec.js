describe('E2E Test Welcome Dashboard', function () {

  const expectedMsg = 'Welcome to the SAC groundwater hub';


  beforeEach(function () {
    browser.get('/');
  });

  it('should display: ' + expectedMsg, function () {
    expect(element(by.id('dashboard-home')).getText()).toEqual(expectedMsg);
  });

});

describe('E2E Test Dashboard Maps Category', function () {

  const expectedMsg = 'Maps Maps and two-dimensional (map) datasets that are used in groundwater' + ' resource assessments';


  beforeEach(function () {
    browser.get('/#/dashboard/1-maps');
  });


  it('should display: ' + expectedMsg, function () {
    expect(element(by.id('dashboard-category')).getText()).toEqual(expectedMsg);
  });

});

describe('E2E Test Dashboard Maps Category Query Aquifer', function () {

  const notExpectedMsg = 'There are no documents for this query / category ';


  beforeEach(function () {
    browser.get('/#/dashboard/1-maps/cards?query=Aquifer');
  });

  it(expectedMsg + ' should have cards', function () {
    expect(element.all(by.tagName('app-sac-card')).count()).toBeGreaterThanOrEqual(1);
  });

  it('should not have no-cards-found', function () {
    expect(element(by.id('no-cards-found')).getText()).toEqual(notExpectedMsg);
  });

});

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
    browser.get('/#/dashboard/1-understanding');
  });


  it('should display: ' + expectedMsg, function () {
    expect(element(by.id('dashboard-category')).getText()).toEqual(expectedMsg);
  });

});

describe('E2E Test Dashboard Maps Category Query Aquifer has cards', function () {

  const notExpectedMsg = 'There are no documents for this query / category';

  beforeEach(function () {
    browser.get('/#/dashboard/1-maps/cards?query=Aquifer');
  });

  it('should not have no-cards-found', function () {
    expect(element(by.id('no-cards-found')).isPresent()).toBeFalsy();
  });

  it('should have cards', function () {
    expect(element.all(by.tagName('app-sac-card')).count()).toBeGreaterThan(3);
  });

});

describe('E2E Test Search has list-tems', function () {

  const expectedMsg = 'Search Results - ';

  beforeEach(function () {
    browser.get('/#/search');
  });

  it('should contain: ' + expectedMsg, function () {
    expect(element(by.deepCss('.col-md-4 > div:nth-child(1) > div:nth-child(1)')).getText()).toContain(expectedMsg);
  });

  it('should have many list items', function () {
    expect(element.all(by.className('list-group-item')).count()).toBeGreaterThan(3);
  });

});

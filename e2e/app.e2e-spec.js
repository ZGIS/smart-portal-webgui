describe('E2E Test Welcome Dashboard', function () {

  const expectedMsg = 'Welcome to the SAC groundwater hub';


  beforeEach(function () {
    browser.get('/');
  });


  it('should display: ' + expectedMsg, function () {
    expect(
      element(
        by.css('p')
      ).getText()
    ).toEqual(expectedMsg);
  });

});

describe('E2E Test Dashboard Category', function () {

  const expectedMsg = 'Maps and two-dimensional (map) datasets';


  beforeEach(function () {
    browser.get('/#/dashboard/1-maps');
  });


  it('should display: ' + expectedMsg, function () {
    expect(
      element(
        by.css('p')
      ).getText()
    ).toEqual(expectedMsg);
  });

});

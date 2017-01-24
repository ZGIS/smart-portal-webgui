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

describe('E2E Test Dashboard Maps Category', function () {

  const expectedMsg = 'Maps Maps and two-dimensional (map) datasets that are used in groundwater' +
    ' resource assessments';


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


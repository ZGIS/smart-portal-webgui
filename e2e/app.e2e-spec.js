describe('QuickStart E2E Tests', function () {

  const expectedMsg = 'Welcome to SAC groundwater hub';


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

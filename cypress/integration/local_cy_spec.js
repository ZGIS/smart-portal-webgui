// https://docs.cypress.io/guides/references/assertions.html#BDD-Assertions

describe('E2E Cypress Gw Hub Local Tests that timeout on Travis', function () {

  context('E2E Test Dashboard Category', function () {

    // const expectedMsg = 'Maps Maps and two-dimensional (map) datasets that are used in groundwater' + ' resource assessments';
    const expectedMsg = 'Understand our groundwater systems';

    beforeEach(function () {
      cy.visit('http://localhost:8080/#/dashboard/1-understanding?categoryId=1');
    });

    it('should display: ' + expectedMsg, function () {
      cy.get('#dashboard-category').should('contain', expectedMsg);
    });
  });

  context('E2E Test Dashboard Category has more cards', function () {

    const notExpectedMsg = 'There are no documents for this query / category';

    beforeEach(function () {
      cy.visit('http://localhost:8080/#/dashboard/7-protect/cards?query=(keywords%3A%22nz%20water%20quality%20maps%22)%5E1.5%20OR%20catch_all%3Anz%20water%20quality%20maps&categoryId=70');
    });

    it('should have cards', function () {

      // expect(element.all(by.tagName('app-sac-card')).count()).toBeGreaterThan(3);
      // body > app-sac-gwh > div > app-sac-gwh-result-cards > div:nth-child(2) > div:nth-child(2) > app-sac-card
      // cy.get('.row').find('app-sac-card').should('have.length', 'above', 3);
      // cy.get('app-sac-card').should('have.length', 'above', 3);
      cy.get('app-sac-gwh-result-cards > div#mdsearchresults > div.col-md-4').find('app-sac-card').its('length').should('be.gt', 3);
    });

  });

});

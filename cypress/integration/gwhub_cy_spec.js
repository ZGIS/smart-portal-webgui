// https://docs.cypress.io/guides/references/assertions.html#BDD-Assertions

describe('E2E Cypress Gw Hub Test', function () {

  context('E2E Test Welcome Dashboard', function () {
    const expectedMsg = 'Welcome to the groundwater hub';

    it('should display: ' + expectedMsg, function () {

      cy.visit('http://localhost:8080/');

      cy.get('#dashboard-home').should('contain', expectedMsg)
    });
  });

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

  context('E2E Test Dashboard Category has cards', function () {

    const notExpectedMsg = 'There are no documents for this query / category';

    beforeEach(function () {
      cy.visit('http://localhost:8080/#/dashboard/7-protect/cards?query=(keywords%3A%22nz%20water%20quality%20maps%22)%5E1.5%20OR%20catch_all%3Anz%20water%20quality%20maps&categoryId=70');
    });

    it('should not have no-cards-found', function () {
      // expect(element(by.id('no-cards-found')).isPresent()).toBeFalsy();
      // cy.get('.col-md-12').find('#no-cards-found').should('have.length', 0);
      cy.get('#no-cards-found').should('not.exist');
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
      cy.get('app-sac-gwh-result-cards > div.row > div.col-md-4').find('app-sac-card').its('length').should('be.gt', 3);
    });

  });

  context('E2E Test Search has map and list-tems', function () {

    beforeEach(function () {
      // cy.visit('http://localhost:8080/#/search');
    });

    it('should have map', function () {
      cy.visit('http://localhost:8080/#/search');

      // expect(element(by.className('ol-viewport')).isPresent()).toBe(true);
      cy.get('.ol-viewport').should('exist');
      // });

      // it('should have many list items', function () {
      // expect(element.all(by.className('list-group-item')).count()).toBeGreaterThan(3);
      // cy.get('.list-group').find('.list-group-item').should('have.length', 'greater.than', 3)
      // cy.get('.list-group').find('.list-group-item').should('have.length', 'greater.than', 3)
      cy.get('div.col-md-4 > div.panel > div.panel-body > div > div.list-group').find('a.list-group-item').its('length').should('be.gt', 3);
    });

  });

});

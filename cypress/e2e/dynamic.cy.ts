describe('dynamic spec', () => {
    it('passes', () => {
      cy.visit('/dynamic');
      cy.get('body').contains('url: http://localhost:3000/dynamic');
      cy.get('body').contains('type: layout');
      cy.get('body').contains('from: dynamic');
      cy.get('body').contains('get server user from');
      cy.get('body').contains('of user: test');
    });
  });
  
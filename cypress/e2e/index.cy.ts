describe('index spec', () => {
  it('passes', () => {
    cy.visit('/');
    cy.get('body').contains('url: http://localhost:3000/');
    cy.get('body').contains('type: page');
    cy.get('body').contains('url: http://localhost:3000/');
    cy.get('body').contains('from: default extra context');
    cy.get('body').contains('server user: test');
    cy.get('body').contains('client user: test');
    cy.wait(100);
    cy.getCookie('x-user-from-layout').should('have.property', 'value', 'yiminghe-from-layout');
  });

  it('action passes', () => {
    cy.visit('/');
    cy.get('[data-cy="action"]').click();
    cy.get('body').contains('from action: test');
  });
});

describe('index spec', () => {
  it('passes', () => {
    cy.visit('/');
    cy.get('body').contains('url: http://localhost:3000/');
    cy.get('body').contains('type: layout');
    cy.get('body').contains('url: http://localhost:3000/');
    cy.get('body').contains('from: default extra context');
    cy.get('body').contains('server user: test');
    cy.get('body').contains('client user: test');
  });
});

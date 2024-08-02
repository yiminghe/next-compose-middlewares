describe('route spec', () => {
  it('passes', () => {
    const req = cy.request('/get');
    cy.request('/get')
      .its('headers')
      .should('have.property', 'x-from', 'next-compose');
    cy.request('/get').its('body').should('deep.equal', {
      user: 'test',
      user2: 'test',
      type: 'route',
      from: 'route',
    });
    cy.getCookie('x-user-from-route').should('have.property', 'value', 'yiminghe-from-route');
  });
});

describe('route spec', () => {
    it('passes', () => {
      cy.request('/get').its('body').should('deep.equal', {
        user: 'test',
        user2: 'test',
        type: 'route',
        from: 'route',
      });
    });
  });
  
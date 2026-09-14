describe('Demo Login', () => {
  it('muestra la página de login', () => {
    cy.visit('/');
    cy.contains('Iniciar sesión');
    cy.contains('LOGIN');
  })
})

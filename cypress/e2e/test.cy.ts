describe('Task Manager', () => {
  it('muestra la aplicación', () => {
    cy.visit('/');
    cy.contains('Task Manager');
    cy.contains('Agregar tarea');
  })
})

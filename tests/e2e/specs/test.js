// https://docs.cypress.io/api/table-of-contents

describe('Login', () => {
  it('Visits the login screen and logs in', () => {
    cy.visit('/')
    cy.url().should('be.equal', `${Cypress.config("baseUrl")}login`)
    cy.contains('h1', 'Welcome')
    cy.contains('h2', 'Let the developer test journey begin!')

    cy.wait(2000)
    cy.get('input[name="email"]').type('abcd')
    cy.get('input[name="password"]').type('defg')
    cy.get('button').click()
    cy.url().should('be.equal', `${Cypress.config("baseUrl")}dashboard`)
  })
})

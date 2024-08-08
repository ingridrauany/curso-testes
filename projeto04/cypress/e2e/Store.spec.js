/// <reference types="cypress"/>

import { makeServer } from '../../miragejs/server'

describe('Store', () => {
  let server

  beforeEach(() => {
    server = makeServer({ environment: 'test' })
  })

  afterEach(() => {
    server.shutdown()
  })

  it('should display the store', () => {
    server.createList('product', 10)

    cy.visit('http://localhost:3000')
    cy.get('body').contains('Brand')
  })

  describe('Store > Search for Products', () => {
    it('should type in the search field', () => {
      cy.visit('http://localhost:3000')

      cy.get('input[type="search"]').type('Some text here')

      cy.get('input[type="search"]').should('have.value', 'Some text here')
    })

    it('should return the product search', () => {
      server.create('product', {
        title: 'Produto legal',
      })
      server.createList('product', 10)

      cy.visit('http://localhost:3000')

      cy.get('input[type="search"]').type('Produto legal')
      cy.get('[data-testid="search-form"]').submit()

      cy.get('[data-testid="product-card"]').should('have.length', 1)
    })

    it('should not return any product on search', () => {
      server.createList('product', 10)

      cy.visit('http://localhost:3000')

      cy.get('input[type="search"]').type('Produto legal')
      cy.get('[data-testid="search-form"]').submit()

      cy.get('[data-testid="product-card"]').should('have.length', 0)
      cy.get('body').contains('0 Product(s)')
    })
  })

  describe('Store > Product List', () => {
    it('should display "0 product" when no product is returned', () => {
      cy.visit('http://localhost:3000')

      cy.get('[data-testid="product-card"]').should('have.length', 0)
      cy.get('body').contains('0 Product(s)')
    })

    it('should display "1 Products" when 1 product is returned', () => {
      server.create('product')

      cy.visit('http://localhost:3000')

      cy.get('[data-testid="product-card"]').should('have.length', 1)
      cy.get('body').contains('1 Product(s)')
    })

    it('should display "15 Products" when 15 products is returned', () => {
      server.createList('product', 15)

      cy.visit('http://localhost:3000')

      cy.get('[data-testid="product-card"]').should('have.length', 15)
      cy.get('body').contains('15 Product(s)')
    })
  })

  describe('Store > Shopping cart', () => {
    it('should not display shopping cart when page first loads', () => {
      cy.visit('http://localhost:3000')

      cy.get('[data-testid="shopping-cart"]').should('have.class', 'hidden')
    })

    it('should toggle shopping cart visibility when button is clicked', () => {
      cy.visit('http://localhost:3000')

      cy.get('[data-testid="toggle-button"]').as('toggleButton')
      cy.get('@toggleButton').click()
      cy.get('[data-testid="shopping-cart"]').should('not.have.class', 'hidden')
      cy.get('@toggleButton').click({ force: true })
      cy.get('[data-testid="shopping-cart"]').should('have.class', 'hidden')
    })

    it('should open shopping cart when a product is added', () => {
      server.createList('product', 10)

      cy.visit('http://localhost:3000')
      cy.get('[data-testid="product-card"]').first().find('button').click()

      cy.get('[data-testid="shopping-cart"]').should('not.have.class', 'hidden')
    })

    it('should add first product to the cart', () => {
      server.createList('product', 10)

      cy.visit('http://localhost:3000')
      cy.get('[data-testid="product-card"]').first().find('button').click()

      cy.get('[data-testid="cart-item"]').should('have.length', 1)
    })

    it('should add 3 products to the cart', () => {
      server.createList('product', 10)

      cy.visit('http://localhost:3000')
      cy.get('[data-testid="product-card"]').eq(1).find('button').click()
      cy.get('[data-testid="product-card"]').eq(4).find('button').click()
      cy.get('[data-testid="product-card"]').eq(6).find('button').click()

      cy.get('[data-testid="cart-item"]').should('have.length', 3)
    })
  })
})

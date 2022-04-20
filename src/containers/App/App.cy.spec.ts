import { exampleFunction } from '../../../src/utils/formatFunctions';

describe('TEMPLATE TEST', () => {
  const a: number = exampleFunction()
  it('works', () => {
    cy.log(`${a}`);
    cy.visit('/')
    // IntelliSense and TS compiler should
    // not complain about unknown method

    // You can find components by their data-cy attribute e.g.: <header data-cy="greeting" className="app-header">.
    // This is a cleaner way than polluting the className with cypress specific class names.
    cy.dataCy('greeting') 
    cy.title().should('contain', 'myTesla')
  })
});

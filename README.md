# Códigos do curso de testes de aplicações Javascript

1. [Projeto 01](projeto01/): Criando funções básicas para utilizar o Jest para escrever testes com TDD
2. [Projeto 02](projeto02/): Cria um sistema de carrinho e testes para esse sistema
3. [Projeto 03](projeto02/): Escrita de testes para uma aplicação React/Nextjs

## Ferramentas

-   [Jest](https://jestjs.io/): Teste runner, localiza os testes e os executa
    -   Utiliza de expressão regular para buscar os testes
    -   Permite realizar mocks e observar métodos em bibliotecas
    -   Permite realizar assetions
-   [Testing Library](https://testing-library.com/): utiliários para montar componentes
    -   Oferece ferramentas para interagir com componentes como se fosse o usuário final
    -   Trabalha junto com o Jest
-   [Enzyme](https://enzymejs.github.io/enzyme/): provê utiliários para montar componentes React
    -   Oferece ferramentas para interagir com componentes como se fosse o usuário final
    -   Permite manejar estado e testar detalhes da implementação
        -   Alternativa ou uso em conjunto com a Testing Library
-   [Cypress](https://www.cypress.io/): framework de testes end-to-end
    -   Executa aplicação no browser (chrome, firefox, edge, electron), como se fosse usuário final

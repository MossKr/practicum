describe('Конструктор бургера', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-testid="ingredients-container"]', { timeout: 10000 }).should('exist');
  });

  it('должен позволять перетаскивать ингредиенты, создавать заказ и отображать модальные окна', () => {
    // Клик по ингредиенту и проверка модального окна
    cy.get('[data-testid="ingredient-item"]').first().click();

    // Проверяем, что URL изменился
    cy.url().should('include', '/ingredients/');

    // Проверяем, что модальное окно открылось
    cy.get('[data-testid="modal"]').should('exist');
    cy.get('[data-testid="ingredient-details"]').should('exist');

    // Закрываем модальное окно
    cy.get('[data-testid="modal-close-button"]').click();

    // Проверяем, что модальное окно закрылось и URL вернулся к исходному
    cy.get('[data-testid="modal"]').should('not.exist');
    cy.url().should('not.include', '/ingredients/');
    // перетаскиваем булку
    cy.get('h2').contains('Булки').next('ul').find('[data-testid="ingredient-item"]').first().as('bun');
    cy.get('@bun').drag('[data-testid="constructor-dropzone"]');

    // перетаскиваем соус
    cy.get('h2').contains('Соусы').next('ul').find('[data-testid="ingredient-item"]').first().as('sauce');
    cy.get('@sauce').drag('[data-testid="constructor-dropzone"]');

    // перетаскиваем начинку
    cy.get('h2').contains('Начинки').next('ul').find('[data-testid="ingredient-item"]').first().as('main');
    cy.get('@main').drag('[data-testid="constructor-dropzone"]');

    // Проверяем, что цена обновилась
    cy.get('[data-testid="total-price"]').should('not.have.text', '0');

    // Нажимаем кнопку "Оформить заказ"
    cy.get('[data-testid="order-button"]').click();

    // Проверяем, перенаправлены ли мы на страницу входа
    cy.url().then((url) => {
      if (url.includes('/login')) {
        // Вводим данные для входа
        cy.get('input[name="email"]').type('cypress@mail.com');
        cy.get('input[name="password"]').type('111Asd');
        cy.get('button[type="submit"]').click();

        // Ждем перенаправления на главную страницу
        cy.url().should('not.include', '/login');

        // Снова нажимаем "Оформить заказ"
        cy.get('[data-testid="order-button"]').click();
      }
    });

    // Ждем, пока появится модальное окно с деталями заказа
    cy.get('[data-testid="order-details"]', { timeout: 25000 }).should('be.visible');

    // Проверяем, что номер заказа отображается
    cy.get('[data-testid="order-number"]').should('exist');

    // Закрываем модальное окно
    cy.get('[data-testid="modal-close-button"]').click();

    // Проверяем, что модальное окно закрылось
    cy.get('[data-testid="order-details"]').should('not.exist');

    // Проверяем, что конструктор очистился после оформления заказа
    cy.get('[data-testid="constructor-empty-ingredients"]').should('exist');
    cy.get('[data-testid="constructor-empty-bun-top"]').should('exist');
    cy.get('[data-testid="constructor-empty-bun-bottom"]').should('exist');
  });
});

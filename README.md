# Яндекс.Практикум: Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TypeScript, Webpack

### Файловая структура проекта

- src/ — исходные файлы проекта, модули слоя приложения
- src/common.blocks/ - файлы стилей для блоков
- src/images/ - изображения
- src/pages/ - файлы html
- src/public/ - файлы, необходимые для сборки приложения
- src/scss/ - общие файлы стилей
- src/vendor/ - сторонние пакеты
- src/types/ - типы, используемые приложением
- src/utils/ - вспомогательные функции и классы
- src/components/ - исходные файлы TypeScript, валидация, управление состоянием 
- src/components/common/ - общие файлы, отвечающие за модели и представление
- src/components/base/ - базовые классы для функциональности проекта

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/styles/styles.scss — корневой файл стилей
- src/index.ts — точка входа приложения
- README.md # Документация по проекту

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Окружение

Для правильной сборки проекта необходимо задать переменную окружения `API_ORIGIN`

## Сборка

```
npm run build
```

или

```
yarn build
```

## Архитектура

## Проектирование архитектуры MVP веб-приложения "Web-Larek"

### Описание
MVP (Model-View-Presenter) - это архитектурный шаблон, который разделяет приложение на три основных компонента: модель (Model), представление (View) и презентер (Presenter). Этот шаблон помогает разделить логику приложения, пользовательский интерфейс и данные.

### Компоненты

1. **Модель (Model)**
   - Отвечает за управление данными и бизнес-логикой приложения.
   - Содержит классы, структуры и методы для работы с данными.
   - Не зависит от пользовательского интерфейса.

2. **Представление (View)**
   - Отображает данные пользователю и обрабатывает пользовательские действия.
   - Содержит компоненты пользовательского интерфейса, такие как страницы, формы, кнопки и т. д.
   - Отвечает за отображение данных из модели и передачу пользовательских действий презентеру.

3. **Презентер (Presenter)**
   - Содержит логику приложения и связывает модель и представление.
   - Получает данные из модели, обрабатывает их и передает представлению для отображения.
   - Принимает пользовательские действия от представления, обрабатывает их и обновляет модель.

### Связи между компонентами

- **Модель и Презентер**:
  - Презентер запрашивает данные у модели и обновляет ее при необходимости.
  - Модель оповещает презентер о любых изменениях данных.

- **Презентер и Представление**:
  - Презентер связан с представлением через интерфейс (контракт).
  - Представление отправляет пользовательские действия презентеру, который затем обрабатывает их и обновляет представление.

- **Модель и Представление**:
  - Модель не зависит от представления и не имеет прямого взаимодействия с ним.
  - Представление обновляет себя на основе данных, полученных от презентера.

### Классы

1. **ApiService**

   - **Описание**: Класс ApiService отвечает за взаимодействие с серверным API. Он предоставляет методы для отправки HTTP-запросов и получения данных.

   - **Методы**:

     - `getProducts()`: Получает список продуктов с сервера.

     - `getProduct(id)`: Получает информацию о продукте по его идентификатору.

     - `sendOrder(order)`: Отправляет заказ на сервер.

2. **EventEmitter**

   - **Описание**: Класс EventEmitter реализует шаблон "Издатель-Подписчик" и служит для управления событиями в приложении.

   - **Методы**:

     - `on(eventName, callback)`: Регистрирует обработчик для события.

     - `off(eventName, callback)`: Удаляет обработчик для события.

     - `emit(eventName, data)`: Инициирует событие и передает данные подписчикам.

3. **HomePage**

   - **Описание**: Класс HomePage отвечает за отображение главной страницы приложения и управление ее состоянием.

   - **Методы**:

     - `render(data)`: Отображает содержимое главной страницы на основе предоставленных данных.

4. **Modal**

   - **Описание**: Класс Modal управляет модальным окном в приложении, отображая его и скрывая по необходимости.

   - **Методы**:

     - `open()`: Открывает модальное окно.

     - `close()`: Закрывает модальное окно.

     - `render(data)`: Отображает содержимое модального окна на основе предоставленных данных.

5. **Basket**

   - **Описание**: Класс Basket отвечает за отображение содержимого корзины покупок и управление ее состоянием.

   - **Методы**:

     - `render(data)`: Отображает содержимое корзины на основе предоставленных данных.

6. **Product**

   - **Описание**: Базовый класс Product представляет собой абстрактный компонент, используемый для отображения информации о продукте.

   - **Методы**:

     - `render(model)`: Отображает информацию о продукте на основе предоставленных данных.

7. **OrderContacts**

   - **Описание**: Класс OrderContacts управляет формой заказа контактных данных пользователя.

   - **Методы**:

     - `render(data)`: Отображает форму заказа контактных данных на основе предоставленных данных.

8. **OrderPayment**

   - **Описание**: Класс OrderPayment управляет формой заказа и выбором метода оплаты.

   - **Методы**:

     - `render(data)`: Отображает форму заказа и метод оплаты на основе предоставленных данных.

9. **SuccessOrder**

   - **Описание**: Класс SuccessOrder отображает информацию о успешном заказе.

   - **Методы**:

     - `render(data)`: Отображает информацию о успешном заказе на основе предоставленных данных.

10. **BasketProduct**

    - **Описание**: Класс BasketProduct представляет продукт в корзине покупок.

    - **Методы**:

      - `render(data)`: Отображает информацию о продукте в корзине на основе предоставленных данных.

### Интерфейсы и типы данных

- **IEvents**: Интерфейс для управления событиями в приложении.

- **Product**: Интерфейс для описания продукта.

- **ApiListResponse<Type>**: Обобщенный тип для описания ответа от сервера с коллекцией элементов.

- **ApiPostMethods**: Тип данных для описания методов HTTP-запросов (POST, PUT, DELETE).

- **ApiResponse**: Интерфейс для описания ответа от сервера.

- **IHomePage**: Интерфейс для описания основных данных главной страницы.

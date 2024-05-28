# Яндекс.Практикум: Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TypeScript, Webpack

## Файловая структура проекта

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
─ README.md # Документация по проекту

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

# Архитектура MVP веб-приложения "Web-Larek"

### Описание
MVP (Model-View-Presenter) - это архитектурный шаблон, который разделяет приложение на три основных компонента: модель (Model), представление (View) и презентер (Presenter). Этот шаблон помогает разделить логику приложения, пользовательский интерфейс и данные.

## Компоненты

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

## Связи между компонентами

- **Модель и Презентер**:
  - Презентер запрашивает данные у модели и обновляет ее при необходимости.
  - Модель оповещает презентер о любых изменениях данных.

- **Презентер и Представление**:
  - Презентер связан с представлением через интерфейс (контракт).
  - Представление отправляет пользовательские действия презентеру, который затем обрабатывает их и обновляет представление.

- **Модель и Представление**:
  - Модель не зависит от представления и не имеет прямого взаимодействия с ним.
  - Представление обновляет себя на основе данных, полученных от презентера.

## Базовый код

### Класс Api

- **Свойства класса**

`baseUrl`: базовый URL для API запросов.

   *тип данных* - `string`
      
`options`: настройки для выполнения HTTP-запросов.

  *тип данных* - `RequestInit`
      
- **Конструктор**

`constructor(baseUrl: string, options: RequestInit = {})`
 
   *аргументы, принимаемые на вход* - `baseUrl`, `options`      

- **Методы класса**

`protected async handleResponse(response: Response): Promise<object>`: обрабатывает ответ от сервера.
 
   *аргументы, принимаемые на вход* - `response`, `options` - ответ HTTP-запроса.
      
`async get(uri: string)`: выполняет HTTP GET-запрос по указанному URI.
   *аргументы, принимаемые на вход* - строка `uri`, `options`.
       
`async post(uri: string, data: object, method: ApiPostMethods = 'POST')`: Выполняет HTTP POST-запрос по указанному URI с переданными данными.
 
   *аргументы, принимаемые на вход* - строка `uri`, объект с данными запроса `data`, HTTP-метод, который будет использован для запроса `method`.

### Класс EventEmitter

- **Свойства класса**

`_events`: все поступающие в обработку события.

   *тип данных* - `Map<EventName, Set<Subscriber>>`

- **Конструктор**

`constructor()`.

   *аргументы, принимаемые на вход* - не принимает аргументы на вход.

- **Методы класса**

`on<T extends object>(eventName: EventName, callback: (event: T) => void)`: устанавливает обработчик на событие.

   *аргументы, принимаемые на вход* - имя события `eventName`, функция, которая будет вызвана при возникновении события `callback: (data: T) => void`.
   
`off(eventName: EventName, callback: Subscriber)`: снимает обработчик с события.

   *аргументы, принимаемые на вход* - `eventName`, `callback: (data: T) => void`.
   
`emit<T extends object>(eventName: string, data?: T)`: инициирует событие с данными.

   *аргументы, принимаемые на вход* - `eventName`,  данные, которые будут переданы обработчикам события `data`.
   
`onAll(callback: (event: EmitterEvent) => void)`: слушает все события.

   *аргументы, принимаемые на вход* - `callback`.
   
`offAll()`: сбрасывает все обработчики.

`trigger<T extends object>(eventName: string, context?: Partial<T>)`: создает триггер для генерации события при вызове.

   *аргументы, принимаемые на вход* - имя события `eventName`, контекст, который будет объединен с данными события `context`.
    

### Класс Component<T>

- **Свойства класса**

`container`:  корневой DOM - элемент.

   *тип данных* - `HTMLElement`

- **Конструктор**

`constructor(container: HTMLElement)`

   *аргументы, принимаемые на вход* - корневой DOM - элемент `HTMLElement`    

- **Методы класса**

`toggleClass(element: HTMLElement, className: string, force?: boolean)`: преключает классы у элемента.

   *аргументы, принимаемые на вход* - элемент, у которого нужно переключить класс `element: HTMLElement`, имя класса `className: string`, `force (опционально): boolean` удалит или добавит класс.
   
`setText(element: HTMLElement, value: unknown)`: устанавливает текстовое содержимое.

   *аргументы, принимаемые на вход* - элемент, текст которого надо задать, сам текст `value: unknown`.
   
`setDisabled(element: HTMLElement, state: boolean)`: меняет статус блокировки элемента.

   *аргументы, принимаемые на вход* - элемент, состояние блокировки которого надо изменить `element: HTMLElemen`, поставить блокировку (true) или снять блокировку (false) `state: boolean`.
   
`setHidden(element: HTMLElement)`: скрывает элемент.

   *аргументы, принимаемые на вход* - эоемент, который нужно скрыть `element: HTMLElement`.
   
`setVisible(element: HTMLElement)`: показывает элемент.

   *аргументы, принимаемые на вход* - элемент, который надо показать `element: HTMLElement`.
   
`setImage(element: HTMLImageElement, src: string, alt?: string)`: устанавливает изображение и альтернативный текст для элемента.

   *аргументы, принимаемые на вход* - элемент, для которого это нужно сделать `element: HTMLElement`, URL источника изображения `src: string`, альтернативный текст для изображения `alt (опционально): string `.

`render(data?: Partial<T>): HTMLElement`: возвращает корневой DOM-элемент со всеми данными.

   *аргументы, принимаемые на вход* - данные для элемента `data (опционально): Partial<T>`.
    

## Основной код

### Класс 

**Свойства класса**
``:  
   **тип данных** - ``

**Конструктор**
``: 
    **аргументы, принимаемые на вход** -     

**Методы класса**
``:
   **аргументы, принимаемые на вход** - 


   
1. **ApiService** отвечает за взаимодействие с серверным API. Он предоставляет методы для отправки HTTP-запросов и получения данных о продуктах, а также для отправки заказов.

- **Конструктор**

**Аргументы**:
- `apiUrl` (`string`): Базовый URL для запросов к API.
- `cdnUrl` (`string`): URL для получения изображений продуктов.

**Свойства**
- `_api` (`Api`): Экземпляр класса `Api`, используемый для отправки HTTP-запросов.
- `apiUrl` (`string`): Базовый URL для запросов к API.
- `cdnUrl` (`string`): URL для получения изображений продуктов.

**Методы**

-`getProducts()`-  Получает список продуктов с сервера.

**Возвращает**: `Promise<Product[]>`
  - Промис, который разрешается в массив объектов типа `Product`.

 `getProduct(id: ProductId)'- Получает информацию о продукте по его идентификатору.

**Аргументы**:
  - `id` (`ProductId`): Идентификатор продукта.
  
**Возвращает**: `Promise<Product>`
  - Промис, который разрешается в объект типа `Product`.

`sendOrder(order: Order)`: Отправляет заказ на сервер.

**Аргументы**:
  - `order` (`Order`): Объект заказа, содержащий информацию о заказанных продуктах.
  
**Возвращает**: `Promise<SentOrder>`
  - Промис, который разрешается в объект типа `SentOrder`.


**HomePage**

   - **Описание**: Класс HomePage отвечает за отображение главной страницы приложения и управление ее состоянием.

   - **Методы**:

     - `render(data)`: Отображает содержимое главной страницы на основе предоставленных данных.

**Modal**

   - **Описание**: Класс Modal управляет модальным окном в приложении, отображая его и скрывая по необходимости.

   - **Методы**:

     - `open()`: Открывает модальное окно.

     - `close()`: Закрывает модальное окно.

     - `render(data)`: Отображает содержимое модального окна на основе предоставленных данных.

 **Basket**

   - **Описание**: Класс Basket отвечает за отображение содержимого корзины покупок и управление ее состоянием.

   - **Методы**:

     - `render(data)`: Отображает содержимое корзины на основе предоставленных данных.

**Product**

   - **Описание**: Базовый класс Product представляет собой абстрактный компонент, используемый для отображения информации о продукте.

   - **Методы**:

     - `render(model)`: Отображает информацию о продукте на основе предоставленных данных.

**OrderContacts**

   - **Описание**: Класс OrderContacts управляет формой заказа контактных данных пользователя.

   - **Методы**:

     - `render(data)`: Отображает форму заказа контактных данных на основе предоставленных данных.

 **OrderPayment**

   - **Описание**: Класс OrderPayment управляет формой заказа и выбором метода оплаты.

   - **Методы**:

     - `render(data)`: Отображает форму заказа и метод оплаты на основе предоставленных данных.

**SuccessOrder**

   - **Описание**: Класс SuccessOrder отображает информацию о успешном заказе.

   - **Методы**:

     - `render(data)`: Отображает информацию о успешном заказе на основе предоставленных данных.

 **BasketProduct**

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


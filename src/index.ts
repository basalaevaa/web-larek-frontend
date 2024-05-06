import { ensureElement, cloneTemplate } from './utils/utils';
import { EventEmitter } from './components/base/events';
import { Service } from './components/ServiceStore';
import { API_URL, CDN_URL } from './utils/constants';
import {
	EventsEnum,
	CustomerInterface,
	ProductCategoryType,
	PlaceOrderResponse,
	ProductInterface,
    BasketInterface,
	CardPreview,
    FormDataInterface
} from './types';
import { AppState, CatalogChangeEvent } from './components/AppComponent';
import { Page } from './components/Page';
import { Card } from './components/Card';
import './scss/styles.scss';
import { Modal } from './components/Modal';
import { Basket } from './components/Basket';
import { CustomerDataForm, OrderDetailsForm } from './components/Form';
import { SuccessModal } from './components/Success';


const events = new EventEmitter();
const api = new Service(CDN_URL, API_URL);
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);


// Все шаблоны
const successModalTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewModalTemplate =
	ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderDetailsFormTemplate = ensureElement<HTMLTemplateElement>('#order');
const customerDataFormTemplate = ensureElement<HTMLTemplateElement>('#contacts');

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderForm = new OrderDetailsForm(
	cloneTemplate(orderDetailsFormTemplate),
	events
);
const customerDataForm = new CustomerDataForm(
	cloneTemplate(customerDataFormTemplate),
	events
);
const succesModal = new SuccessModal(
	cloneTemplate(successModalTemplate),
	events
);


// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
        console.log(eventName, data);
});

// Получаем лоты с сервера
api
	.getProductList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err);
	});

// Изменились элементы каталога
events.on<CatalogChangeEvent>(EventsEnum.CatalogChanged, () => {
    page.gallery = appData.catalog.map((item) => {
		const card = new Card<ProductCategoryType>(
			'card',
			cloneTemplate(cardTemplate),
			{
				onClick: () => events.emit(EventsEnum.CardSelected, item),
			}
		);
		return card.renderComponent({
			title: item.title,
			image: item.image,
			category: item.category,
			price: item.price,
		});
	});
});

// Открыли карточку
// Открыли карточку
events.on<CardPreview>(EventsEnum.CardSelected, (item) => {
	const card = new Card<CardPreview>(
		'card',
		cloneTemplate(cardPreviewModalTemplate),
		{
			onClick: () => {
				events.emit(EventsEnum.BasketAppended, item);
				card.disableButton();
			},
		}
	);
	if (appData.isItemInBasket(item)) { // Вызываем метод isItemInBasket из объекта appData
		card.disableButton();
	}
	modal.render({
		content: card.renderComponent({
			title: item.title,
			image: item.image,
			category: item.category,
			price: item.price,
			about: item.description,
		}),
	});
	page.locked = true;
});


// Добавили товар в корзину
events.on(EventsEnum.BasketAppended, (item: CardPreview) => {
	appData.addToBasket(item);
	modal.close();
  });
  

// Удалили товар из корзины
events.on(EventsEnum.BasketReduced, (productToRemove: ProductInterface) => {
	appData.removeFromBasket(productToRemove);
	if (appData.basket.items.length === 0) {
	  basket.setEmpty();
	}
 });
  

// Реагируем на изменения корзины
events.on(EventsEnum.BasketChanged, () => {
	basket.updateBasket();
	basket.total = appData.getTotalBasketPrice();
	page.counter = appData.getTotalItemsInBasket();
});

// Открыли корзину
events.on(EventsEnum.BasketOpened, () => {
	modal.render({
		content: basket.renderComponent({
			items: appData.basket.items.map((item) => {
				// Создаем экземпляр класса Card для каждого элемента корзины
				const cardItem = new Card<BasketInterface>(
					'card',
					cloneTemplate(cardBasketTemplate),
					{
						onClick: () => {
							cardItem.remove();
							events.emit(EventsEnum.BasketReduced, item);
						},
					}
				);
				return cardItem.renderComponent({
					title: item.title,
					price: item.price,
				});
			}),
			total: appData.getTotalBasketPrice(),
		}),
	});
});

// Приступили к оформлению заказа
events.on(EventsEnum.OrderDetailsInfoEntered, () => {
	modal.close();
	modal.render({
		content: orderForm.render({
			valid: appData.validateAddress(),
			errors: [],
		}),
	});
});

// Начали вводить контактные данные
events.on(EventsEnum.OrderContactInfoEntered, () => {
	modal.close();
    modal.render({
		content: customerDataForm.render({
			valid: appData.validateCustomerData(),
			errors: [],
		}),
	});
});


// Изменилось состояние валидации формы
events.on('formErrors:change', (errors: Partial<FormDataInterface>) => {
	// Проверяем наличие ошибок в адресе доставки
	if (errors.deliveryAddress) {
		orderForm.valid = false;
		orderForm.errors = errors.deliveryAddress;
	} else {
		orderForm.valid = true;
		orderForm.errors = '';
	}

	// Проверяем наличие ошибок в email и телефоне
	if (errors.email || errors.phone) {
		customerDataForm.valid = false;
		customerDataForm.errors = Object.values({
			phone: errors.phone,
			email: errors.email,
		})
			.filter((i) => !!i)
			.join('; ');
	} else {
		customerDataForm.valid = true;
		customerDataForm.errors = '';
	}
});

// Изменилось одно из полей
events.on(
	/^(contacts\.(phone|email)|order\.address):change/,
	(data: { field: keyof CustomerInterface; value: string }) => {
		if (!['email', 'phone'].includes(data.field)) {
			// Поле, которое изменилось, не является email или phone, значит это адрес
			appData.setOrderData({
				orderDetails: {
					...appData.orderData.orderDetails, 
					deliveryAddress: data.value, 
				},
			});
		} else {
			const newData: Partial<CustomerInterface> = {
				[data.field]: data.value,
			};
			appData.setOrderData({
				customerData: {
					...appData.orderData.customerData, 
					...newData, 
				},
			});
		}
	}
);


events.on(EventsEnum.OrderAddressChanged, () => {
	appData.validateAddress();
});

events.on(EventsEnum.OrderPhoneNumberChanged, () => {
	appData.validateCustomerData();
});

events.on(EventsEnum.OrderEmailChanged, () => {
	appData.validateCustomerData();
});


events.on(EventsEnum.BasketCleared, () => {
	basket.setEmpty();
});

events.on(EventsEnum.ModalClosed, () => {
    page.locked = false;
})

events.on(EventsEnum.OrderPlaced, () => {
	appData.setOrderData({
		customerData: {
			email: appData.orderData.customerData.email,
			phone: appData.orderData.customerData.phone,
		},
	});

	api
		.sendOrder({
			payment: appData.orderData.orderDetails.paymentMethod,
			email: appData.orderData.customerData.email,
			phone: appData.orderData.customerData.phone,
			address: appData.orderData.orderDetails.deliveryAddress,
			total: appData.getTotalBasketPrice(),
			items: appData.basket.items.map((item) => item.id),
		})
		.then((res: PlaceOrderResponse) => {
			succesModal.total = res.total;
		});

	modal.close();
	modal.render({
		content: succesModal.renderComponent(),
	});
});

events.on(EventsEnum.OrderComplete, () => {
	modal.close();
    appData.clearOrderData();
	basket.setEmpty();
	orderForm.clearInputs();
	customerDataForm.clearInputs();
});
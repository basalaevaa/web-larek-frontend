import './scss/styles.scss';
import { API_URL, CDN_URL, categories } from './utils/constants';
import { EventEmitter } from './components/base/Events';
import { ApiService } from './components/ApiService';
import { Product } from './types';
import { HomePage } from './components/common/Page';
import { Modal } from './components/common/Modal';
import { Basket } from './components/common/Basket';
import { BasketProduct } from './components/common/Product';
import {
	OrderContacts,
	OrderPayment,
} from './components/common/Order';
import { SuccessOrder } from './components/common/Success';
import { BasketState, OrderState } from './components/State';
import {
	CatalogProduct,
	ProductCard,
} from './components/common/Product';

// Спасибо за ревью!
// немножко поигралась со скроллом в корзине и на основной странице, чтобы он был под стиль страницы

const events = new EventEmitter();
const apiService = new ApiService(API_URL, CDN_URL);
const homePage = new HomePage(events);
const modal = new Modal(events);
const basketState = new BasketState();
const orderState = new OrderState();
const basket = new Basket(events);
const orderPayment = new OrderPayment(events);
const orderContacts = new OrderContacts(events);
const successOrder = new SuccessOrder(events);

const renderProduct = (product: Product) => {
    const products = new CatalogProduct({
        onProductCardClick: () => events.emit('product', { product }),
    });
    const price = product.price !== null ? `${product.price} синапсов` : 'Бесценно';
    return products.render({
        ...product,
        price,
        categoryClass: categories[product.category as keyof typeof categories],
    });
};

const renderProductCard= (product: Product) => {
    const products = new ProductCard({
        toggleBasket: () => {
            const itemIndex = basketState.findItem(product);
            itemIndex === undefined ? basketState.addItem(product) : basketState.removeItem(product);
            homePage.render({ counter: basketState.count() });
            modal.close();
        },
    });
    const price = product.price !== null ? `${product.price} синапсов` : 'Бесценно';
    const content = products.render({
        ...product,
        price,
        categoryClass: categories[product.category as keyof typeof categories],
        isInBasket: basketState.findItem(product) !== undefined,
    });
    modal.render({ content });
};

if (process.env.NODE_ENV !== 'production') {
	events.onAll(({ eventName, data }) => {
		console.log(eventName, data);
	});
}

apiService
    .getProducts()
    .then(products => {
        const catalogItems = products.map(renderProduct);
        homePage.render({ gallery: catalogItems });

        events.on<{ product: Product }>('product', ({ product }) => renderProductCard(product));
    })
    .catch(console.error);

	
function createBasketItem(basket: Basket) {
	return (product: Product, itemIndex: number) => {
		const products = new BasketProduct({
			onDeleteClick: () => {
				events.emit('deleteProduct', { product, basket });
			},
		});
		return products.render({
			...product,
			price: `${product.price} синапсов`,
			categoryClass: '',
			itemIndex: itemIndex + 1,
		});
	};
}

events.on<{ product: Product; basket: Basket }>(
	'deleteProduct',
	({ product, basket }) => {
		basketState.removeItem(product);
		homePage.render({ counter: basketState.count() });
		modal.render({
			content: basket.render({
				items: basketState.items.map((item, i) => createBasketItem(basket)(item, i)),
				total: `${basketState.total} синапсов`,
			}),
		});
	}
);

events.on('basketOpen', () => {
    const content = basket.render({
        items: basketState.items.map((item, i) => createBasketItem(basket)(item, i)),
        total: `${basketState.total} синапсов`,
    });
    modal.render({ content });
	basket._toggleScroll();
});

events.on('basketOrder', () => {
	if (basketState.items.length) {
		orderState.items = basketState.items;
	}

	const orderValidation = orderState.validation([
		'items',
		'address',
	]);

	modal.render({
		content: orderPayment.render({
			payment: orderState.payment,
			validation: orderValidation,
			submitDisabled: orderValidation.length > 0,
		}),
	});
});

events.on('addressInput', (data: { value: string }) => {
	orderState.address = data.value;
	orderPayment.render({
		validation: orderState.validation(['address', 'items']),
	});
});

['buttonCard', 'buttonCash'].forEach((event) => {
	events.on(event, () => {
		orderState.togglePaymentType();
		orderPayment.render({ payment: orderState.value.payment });
	});
});

events.on('submitPayment', () => {
	const orderValidation = orderState.validation([
		'phone',
		'email',
	]);
	modal.render({
		content: orderContacts.render({
			validation: orderValidation,
			submitDisabled: true,
		}),
	});
});

events.on('emailInput', (data: { value: string }) => {
	const { value } = data;
	orderState.email = value;
	orderContacts.render({
		validation: orderState.validation(['email', 'phone']),
	});
});

events.on('phoneNumberInput', (data: { value: string }) => {
	const { value } = data;
	orderState.phone = value;
	orderContacts.render({
		validation: orderState.validation(['email', 'phone']),
	});
});

events.on('submitContact', () => {
    apiService.sendOrder(orderState.value).then(function (res) {
        if ('error' in res) {
            console.log(res);
            return;
        }

        const orderValidation = orderState.validation([
            'phone',
            'email',
        ]);

        basketState.clear();
        orderState.clear();
		homePage.render({ counter: basketState.count() });
        modal.render({
            content: successOrder.render({
                validation: orderValidation,
                description: `Списано ${res.total} синапсов`,
            }),
        });
    });
});

events.on('successСlose', () => {

	modal.close();
	basketState.clear();
    homePage.render({ counter: basketState.count() });
});

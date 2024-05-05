import { DataModel } from './Components';
import { IEvents } from './base/events';
import { ProductInterface, AppStateInterface, BasketStateInterface, ProductCategoryType, EventsEnum, OrderInterface, FormErrors } from '../types/index';

export type CatalogChangeEvent = {
    catalog: Product[];
};

export type CardPreview = {
  category: string;
  title: string;
  image: string;
  price: number;
  about: string;
};

export class AppState extends DataModel<AppStateInterface> {
  catalog: Product[] = [];
	basket: BasketStateInterface = {
		items: [],
		total: 0,
	};
	orderData: OrderInterface = {
		orderDetails: {
			paymentMethod: 'online',
			deliveryAddress: '',
		},
		customerData: {
			email: '',
			phone: '',
		},
	};
	formErrors: FormErrors = {};

	setCatalog(items: ProductInterface[]) {
		this.catalog = items.map((item) => new Product(item, this.eventHandlers));
		this.emitChangesToHandlers(EventsEnum.CatalogChanged, { catalog: this.catalog });
	}

	addToBasket(product: ProductInterface) {
		this.basket.items.push(product);
		this.basket.total += product.price;
		this.emitChangesToHandlers(EventsEnum.BasketChanged, { basket: this.basket });
	}

	removeFromBasket(product: ProductInterface) {
		this.basket.items = this.basket.items.filter((item) => {
			return item.id !== product.id;
		});
		this.basket.total -= product.price;
		this.emitChangesToHandlers(EventsEnum.BasketChanged, { basket: this.basket });
	}

	clearBasket() {
		this.basket.items = [];
		this.basket.total = 0;
		this.emitChangesToHandlers(EventsEnum.BasketCleared, { basket: this.basket });
	}

  isItemInBasket(item: ProductInterface) {
      return this.basket.items.some((basketItem) => basketItem.id === item.id);
  }

	getTotalItemsInBasket() {
		return this.basket.items.length;
	}

	getTotalBasketPrice() {
		return this.basket.total;
	}

	setOrderData(data: Partial<OrderInterface>) {
		this.orderData = {
			...this.orderData,
			orderDetails: {
				...this.orderData.orderDetails,
				...data.orderDetails,
			},
			customerData: {
				...this.orderData.customerData,
				...data.customerData,
			},
		};
	}

	clearOrderData() {
		this.setOrderData({
			orderDetails: {
				paymentMethod: 'online',
				deliveryAddress: '',
			},
			customerData: {
				email: '',
				phone: '',
			},
    });
		this.clearBasket();
	}

	validateAddress(): boolean {
		const errors: typeof this.formErrors = {};
		const addressRegex = /^[а-яА-ЯёЁ0-9][а-яА-ЯёЁ0-9\s.,-]{8,}[а-яА-ЯёЁ0-9]$/;

		if (!this.orderData.orderDetails.deliveryAddress) {
			errors.deliveryAddress = 'Укажите ваш адрес';
		} else if (
			!addressRegex.test(this.orderData.orderDetails.deliveryAddress)
		) {
			errors.deliveryAddress = 'Слишком короткий адрес, такое возможно?';
		}

		this.formErrors = errors;
		this.eventHandlers.emit('formErrors:change', this.formErrors);

		return Object.keys(errors).length === 0;
	}

	validateCustomerData(): boolean {
		const errors: typeof this.formErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;

		if (!this.orderData.customerData.email) {
			errors.email = 'Укажите ваш e-mail';
		} else if (!emailRegex.test(this.orderData.customerData.email)) {
			errors.email = 'Введите e-mail в формате example@test.com';
		}

		if (!this.orderData.customerData.phone) {
			errors.phone = 'Необходимо указать телефон';
		} else if (!phoneRegex.test(this.orderData.customerData.phone)) {
			errors.phone = 'Неверный формат номера телефона';
		}

		this.formErrors = errors;
		this.eventHandlers.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}

export class Product extends DataModel<ProductInterface> {
    id: string;
    category: ProductCategoryType;
    title: string;
    image: string;
    price: number;
    about: string;

    constructor(data: Partial<ProductInterface>, events: IEvents) {
      super(data, events);
      this.id = data.id || '';
      this.category = data.category || 'other';
      this.title = data.title || '';
      this.image = data.image || '';
      this.price = data.price || 0;
      this.about = data.about || '';
    }
}
import { Order, Product, Validation } from '../types';
import { validateOrder } from './ValidationForm';

export class BasketState {
	protected _value: { items: Product[] };

	constructor() {
		this._value = { items: [] };
	}

	findItem(product: Product): number | undefined {
		const res = this._value.items.findIndex((value) => value.id === product.id);
		return res === -1 ? undefined : res;
	}

	addItem(item: Product) {
		this._value.items.push(item);
	}

	removeItem(item: Product) {
		this._value.items = this._value.items.filter((x) => x.id !== item.id);
	}

	clear() {
		this._value.items = [];
	}

	count(): number {
		return this._value.items.length;
	}

	get items(): Product[] {
		return this._value.items;
	}

	get total(): number | string {
		const total = this._value.items.reduce(
			(total, { price = 0 }) => total + price,
			0
		);
		return total === 0 ? 'Корзина пуста: 0' : total;
	}
}

type OrderValidationKeys = 'items' | 'address' | 'email' | 'phone';

export class OrderState {
	protected _value: Order;
	protected _validation: Validation;

	constructor() {
		this._value = this.emptyOrder();
		this._validation = [];
	}

	protected emptyOrder(): Order {
		return {
			payment: 'card',
			email: '',
			phone: '',
			address: '',
			total: 0,
			items: [],
		};
	}

	clear(): void {
		this._value = this.emptyOrder();
	}

	validation(keys: OrderValidationKeys[]): Validation {
		this._validation = validateOrder(this._value, keys);
		return this._validation;
	}

	togglePaymentType(): void {
		this._value.payment = this._value.payment === 'card' ? 'cash' : 'card';
	}

	get value(): Order {
		return this._value;
	}
	set value(value: Order) {
		this._value = value;
	}

	get payment(): Order['payment'] {
		return this._value.payment;
	}

	get address(): Order['address'] {
		return this._value.address;
	}
	set address(value: string) {
		this._value.address = value;
	}

	get email(): Order['email'] {
		return this._value.email;
	}
	set email(value: string) {
		this._value.email = value;
	}

	get phone(): Order['phone'] {
		return this._value.phone;
	}
	set phone(value: string) {
		this._value.phone = value;
	}

	get items(): Order['items'] {
		return this._value.items;
	}
	set items(value: Order['items']) {
		this._value.items = value;
		this._value.total = value.reduce((acc, x) => acc + x.price || 0, 0);
	}
}

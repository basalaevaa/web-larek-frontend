export type ProductCategoryType =
	| 'soft-skill'
	| 'other'
	| 'additional'
	| 'button'
	| 'hard-skill';

export const enum EventsEnum {
	CatalogChanged = 'catalog:changed',
	CardSelected = 'card:selected',
	ModalClosed = 'modal:close',
	ModalOpened = 'modal:open',
	BasketAppended = 'basket:appended',
	BasketReduced = 'basket:reduced',
	BasketCleared = 'basket:cleared',
	BasketChanged = 'basket:changed',
	BasketOpened = 'basket:opened',
	OrderDetailsInfoEntered = 'order:details-info-entered',
	OrderAddressChanged = 'order.address:change',
	OrderContactInfoEntered = 'order:contact-info-entered',
	OrderEmailChanged = 'contacts.email:change',
	OrderPhoneNumberChanged = 'contacts.phone:change',
	OrderPlaced = 'order:placed',
	OrderComplete = 'order:complete',
	FormErrorsChange = 'formErrors:change'
}

export type PaymentMethod = 'online' | 'upon-receipt';

export type FormErrors = Partial<Record<keyof FormDataInterface, string>>;

export type CardPreview = {
	id: string;
	category: ProductCategoryType;
	title: string;
	image: string;
	price: number;
	description: string;
	about?: string;
};

export type PlaceOrderRequest = {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
};

export type PlaceOrderResponse = {
	id: string[],
	total: number
}

export interface FormDataInterface extends CustomerInterface, OrderElementsInterface {}

export interface ProductInterface {
    id: string;
    category: ProductCategoryType;
    title: string;
    image: string;
    price: number;
    about?: string;
}

export interface CustomerInterface {
    phone: string;
    email: string;
}

export interface OrderElementsInterface {
	paymentMethod: PaymentMethod;
	deliveryAddress: string;
}

export interface OrderInterface {
	orderDetails: OrderElementsInterface;
	customerData: CustomerInterface;
}

export interface BasketStateInterface {
    items: ProductInterface[];
    total: number;
}

export interface BasketInterface {
	items: HTMLElement[];
	total: number;
}

export interface PageInterface {
	catalog: HTMLElement[];
	locked: boolean;
}

export interface CardInterface {
    category: string;
    title: string;
    image: string;
    price: number;
    about?: string;
}

export interface CardActionsInterface {
    onClick: (event: MouseEvent) => void;
}

export interface ModalInterface {
  content: HTMLElement;
}

export interface FormInterface {
	valid: boolean;
	errors: string[];
}

export interface AppStateInterface {
    catalog: ProductInterface[];
	basket: BasketStateInterface;
	orderData: (OrderElementsInterface & CustomerInterface) | null;
}

export interface SuccessInterface {
	total: number;
}

export interface IForm<T> {
	data: T;
	submit(): void;
}
export type ProductId = string;

export type Product = {
	id: ProductId;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
};

export type PaymentType = 'card' | 'cash';

export type Order = {
	payment: PaymentType;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: Product[];
};

export type SentOrder = {
	id: string;
	total: number;
};

export type Validation = {
	key: string;
	error: string;
}[];

export type OrderValidationKeys = 'items' | 'address' | 'email' | 'phone';

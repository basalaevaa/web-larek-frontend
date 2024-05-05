import {
	ProductInterface,
	PlaceOrderRequest,
	PlaceOrderResponse,
} from '../types';
import { Api } from './base/api';

export type ApiListResponse<Type> = {
    total: number;
    items: Type[];
};

export interface ServiceStoreInterface {
    getProductList: () => Promise<ProductInterface[]>;
	getProductItem: (id: string) => Promise<ProductInterface>;
	sendOrder: (
		orderData: Partial<PlaceOrderRequest>
	) => Promise<PlaceOrderResponse>;
}

export class Service extends Api implements ServiceStoreInterface {
    readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getProductList(): Promise<ProductInterface[]> {
		return this.get('/product').then((data: ApiListResponse<ProductInterface>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	getProductItem(id: string): Promise<ProductInterface> {
		return this.get(`/product/${id}`).then((item: ProductInterface) => ({
			...item,
			image: this.cdn + item.image,
		}));
	}

	sendOrder(requestBody: PlaceOrderRequest): Promise<PlaceOrderResponse> {
		return this.post('/order', requestBody).then(
			(order: PlaceOrderResponse) => order
		);
	}
}
import { Api } from './base/api';
import { Order, Product, ProductId, SentOrder } from '../types';

export interface IApiService {
    getProducts: () => Promise<Product[]>;
    getProduct: (id: ProductId) => Promise<Product>;
    sendOrder: (order: Order) => Promise<SentOrder>;
}

export class ApiService implements IApiService {
    protected _api: Api;

    constructor(protected apiUrl: string, protected cdnUrl: string) {
        this._api = new Api(apiUrl);
    }

    async getProducts(): Promise<Product[]> {
        const response = await this._api.get('/product') as { items: Product[] };
        return response.items.map(item => ({ ...item, image: `${this.cdnUrl}${item.image}` }));
    }

    async getProduct(id: ProductId): Promise<Product> {
        const item = await this._api.get(`/product/${id}`) as Product;
        return { ...item, image: `${this.cdnUrl}${item.image}` };
    }

    async sendOrder(order: Order): Promise<SentOrder> {
        const { id, total } = await this._api.post('/order', { ...order, items: order.items.map(({ id }) => id)}, 'POST') as SentOrder;
        return { ...order, id, total };
    }
}

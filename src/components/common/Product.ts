import { ensureElement, cloneTemplate } from '../../utils/utils';
import { Component } from '../Component';
import { Validation } from '../../types';

interface IProduct {
	description: string;
	image: string;
	title: string;
	category: string;
	price: string;
	isInBasket?: boolean;
	itemIndex?: number;
	validation?: Validation;
	categoryClass: string;
}

export interface ProductEvents {
	toggleBasket: () => void;
	onProductCardClick: () => void;
	onDeleteClick: () => void;
}

abstract class Product extends Component<IProduct> {
	protected _image: HTMLImageElement;
	protected _title: HTMLElement;
	protected _category: HTMLElement;
	protected _price: HTMLElement;

	protected ensureCategory() {
		this._category = ensureElement('.card__category', this.container);
	}

	protected ensureImage() {
		this._image = ensureElement<HTMLImageElement>(
			'.card__image',
			this.container
		);
	}

	constructor(templateId: string) {
		const container = cloneTemplate<HTMLElement>(templateId);
		super(container);

		this._title = ensureElement<HTMLElement>('.card__title', this.container);
		this._price = ensureElement<HTMLElement>('.card__price', this.container);
	}

	render(model: IProduct) {
		return super.render(model);
	}

	set title(value: string) {
		this._title.textContent = value;
	}

	set image(value: string) {
		this._image && this.setImage(this._image, value);
	}

	set category(value: string) {
		this._category && this.setText(this._category, value);
	}

	set price(value: string) {
		this._price && (this._price.textContent = value);
	}

	set categoryClass(value: string) {
		if (this._category) {
			this._category.classList.forEach(
				(x) =>
					x.startsWith('card__category_') && this._category.classList.remove(x)
			);
			this._category.classList.add(`card__category_${value}`);
		}
	}
}

export class CatalogProduct extends Product {
	constructor(events: Pick<ProductEvents, 'onProductCardClick'>) {
		super('#card-catalog');

		this._category = ensureElement('.card__category', this.container);
		this._image = ensureElement<HTMLImageElement>(
			'.card__image',
			this.container
		);

		this.container.addEventListener('click', () => events.onProductCardClick());
	}
}


export class ProductCard extends Product {
	protected _description: HTMLElement;
	protected _toBasketButton: HTMLButtonElement;

	constructor(events: Pick<ProductEvents, 'toggleBasket'>) {
		super('#card-preview');

		this._category = ensureElement('.card__category', this.container);
		this._image = ensureElement<HTMLImageElement>(
			'.card__image',
			this.container
		);
		this._description = ensureElement<HTMLElement>(
			'.card__text',
			this.container
		);
		this._toBasketButton = ensureElement<HTMLButtonElement>(
			'.button',
			this.container
		);

		this._toBasketButton.addEventListener('click', () => events.toggleBasket());
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set isInBasket(inBasket: boolean) {
		this.setText(this._toBasketButton, inBasket ? 'Убрать' : 'В корзину');
	}

	set validation(value: IProduct['validation']) {
		if (value && value.length !== 0) {
			this.setDisabled(this._toBasketButton, true);
			this._toBasketButton.setAttribute(
				'title',
				value.map((x) => x.error).join('; ')
			);
		} else {
			this.setDisabled(this._toBasketButton, false);
			this._toBasketButton.setAttribute('title', '');
		}
	}
}

export class BasketProduct extends Product {
	protected _itemIndex: HTMLElement;
	protected _deleteFromBasketButton: HTMLElement;
	protected _events: Pick<ProductEvents, 'onDeleteClick'>;

	constructor(events: Pick<ProductEvents, 'onDeleteClick'>) {
		super('#card-basket');
		this._events = events;

		this._itemIndex = ensureElement<HTMLElement>(
			'.basket__item-index',
			this.container
		);
		this._deleteFromBasketButton = ensureElement<HTMLElement>(
			'.basket__item-delete',
			this.container
		);
		this._deleteFromBasketButton.addEventListener('click', () => {
			this._events.onDeleteClick();
		});
	}

	set itemIndex(value: number) {
		this.setText(this._itemIndex, ` ${value}`);
	}
}

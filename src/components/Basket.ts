import { Component } from './Components';
import { formatNumber, createElement, ensureElement } from './../utils/utils';
import { EventEmitter } from './base/events';
import { EventsEnum, BasketInterface } from './../types';

export class Basket extends Component<BasketInterface> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLElement;
	protected _itemIndex: HTMLElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.containerElement);
		this._total = this.containerElement.querySelector('.basket__price');
		this._button = this.containerElement.querySelector('.button');
		this._itemIndex = this.containerElement.querySelector('.basket__item-index');

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit(EventsEnum.OrderDetailsInfoEntered);
			});
		}
		this.items = [];
        this.setEmpty();
	}

	updateBasket() {
		const items = Array.from(this._list.children) as HTMLElement[];
		const isBasketEmpty = items.length === 0;
	
		if (!isBasketEmpty) {
			items.forEach((item, index) => {
				const itemIndex = item.querySelector('.basket__item-index');
				itemIndex && (itemIndex.textContent = String(index + 1));
			});
			this._button.removeAttribute('disabled');
		} else {
			this.setEmpty();
		}
	}

	setEmpty() {
		const emptyParagraph = createElement<HTMLParagraphElement>('p', { textContent: 'Корзина пуста' });
		this._list.replaceChildren(emptyParagraph);
		this._button.setAttribute('disabled', 'true');
	}
	set items(items: HTMLElement[]) {
		if (items.length) {
			items.forEach((item, index) => {
				const itemIndex = item.querySelector('.basket__item-index');
				if (itemIndex) {
					itemIndex.textContent = String(index + 1);
				}
			});
			this._list.replaceChildren(...items);
		}
	}

	set total(total: number) {
		this.setTextContent(this._total, `${formatNumber(total)} синапсов`);
	}

	get list() {
		return this._list;
	}
}
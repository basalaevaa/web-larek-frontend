import { ensureElement, cloneTemplate } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

interface IBasket {
	items: HTMLElement[];
	total: string;
}

export class Basket extends Component<IBasket> {
	protected _items: HTMLElement;
	protected _total: HTMLElement;
	protected _submitButton: HTMLButtonElement;

	constructor(events: IEvents) {
		super(cloneTemplate<HTMLTemplateElement>('#basket'));

		this._items = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = ensureElement<HTMLElement>('.basket__price', this.container);
		this._submitButton = ensureElement<HTMLButtonElement>(
			'.basket__button',
			this.container
		);
		this._submitButton.addEventListener('click', () => {
			events.emit('basketOrder');
		});
	}

	set items(items: HTMLElement[]) {
		this._items.replaceChildren(...items);
		this._submitButton.disabled = items.length === 0;
	}

	set total(value: number) {
		this.setText(this._total, value);
	}
}

import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface IHomePage {
	counter: number;
	gallery: HTMLElement[];
	locked: boolean;
}
export class HomePage extends Component<IHomePage> {
	protected _headerCounter: HTMLElement;
	protected _gallery: HTMLElement;
	protected _headerBasket: HTMLElement;
	protected _wrapper: HTMLElement;

	constructor(protected events: IEvents) {
		super(document.body);

		this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
		this._gallery = ensureElement<HTMLElement>('.gallery');
		this._headerBasket = ensureElement<HTMLElement>('.header__basket');
		this._headerCounter = ensureElement<HTMLElement>('.header__basket-counter');
		this._headerBasket.addEventListener('click', () => {
			events.emit('basketOpen');
		});
	}

	set counter(value: number) {
		this.setText(this._headerCounter, String(value));
	}

	set gallery(items: HTMLElement[]) {
		this._gallery.replaceChildren(...items);
	}

	set locked(value: boolean) {
		this._wrapper.classList.toggle('page__wrapper_locked', value);
	}
}

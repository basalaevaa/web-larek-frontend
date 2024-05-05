import { Component } from './Components';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';
import { EventsEnum, PageInterface } from '../types';

export class Page extends Component<PageInterface> {
    protected _gallery: HTMLElement;
	protected _basket: HTMLElement;
	protected _wrapper: HTMLElement;
	protected _counter: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
		this._gallery = ensureElement<HTMLElement>('.gallery');
		this._basket = ensureElement<HTMLElement>('.header__basket');
		this._counter = ensureElement<HTMLElement>('.header__basket-counter');

		this._basket.addEventListener('click', () => {
			this.events.emit(EventsEnum.BasketOpened);
		});
	}

	set gallery(items: HTMLElement[]) {
		this._gallery.replaceChildren();
		items.forEach(item => this._gallery.appendChild(item));
	}
	  
	set counter(value: number) {
		this._counter.textContent = value.toString();
	} 

	set locked(value: boolean) {
		this._wrapper.classList.toggle('page__wrapper_locked', value);
	}
}
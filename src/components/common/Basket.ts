import { ensureElement, cloneTemplate } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

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
        this._toggleScroll();
    }

    set total(value: string) {
        this._total.textContent = value;
    }

    _toggleScroll() {
        const windowHeight = window.innerHeight;
        const itemListHeight = this._items.scrollHeight;

        if (itemListHeight > windowHeight * 0.6) {
            this._items.style.maxHeight = `${windowHeight * 0.6}px`;
            this._items.style.overflowY = 'auto';
        } else {
            this._items.style.maxHeight = '';
            this._items.style.overflowY = '';
        }
    }

	render(data: IBasket): HTMLElement {
        super.render(data);
        return this.container;
    }
}

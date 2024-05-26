import { ensureElement, cloneTemplate } from '../../utils/utils';
import { Component } from '../Component';
import { IEvents } from '../base/events';
import { ValidationHelper } from '../Validation';
import { Validation } from '../../types';

interface IBasket {
    items: HTMLElement[];
    total: string;
    validation?: Validation;
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
            events.emit('basket_order');
        });
    }

    set items(items: HTMLElement[]) {
        this._items.replaceChildren(...items);
    }

    set total(value: number) {
        this.setText(this._total, value);
    }

    set validation(value: Validation) {
        const validator = new ValidationHelper(this._submitButton, document.createElement('div')); // Создаем временный элемент для отображения ошибок
        validator.setValidationBasket(value);
    }
}

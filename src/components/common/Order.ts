import { ensureElement, cloneTemplate } from '../../utils/utils';
import { Component } from '../base/Component';
import { Validation } from '../../types';
import { IEvents } from '../base/Events';
import { ValidationHelper } from '../Validation';

interface IOrder {
	payment: 'card' | 'cash';
	validation?: Validation;
	submitDisabled?: boolean;
}

abstract class Order extends Component<IOrder> {
	protected _submitButton: HTMLButtonElement;
	protected _formErrors: HTMLElement;
	protected _form: HTMLFormElement;
	protected _formValidation: ValidationHelper;

	constructor(templateId: string) {
		super(cloneTemplate<HTMLElement>(templateId));

		this._submitButton = ensureElement<HTMLButtonElement>(
			'button[type="submit"]',
			this.container
		);
		this._formErrors = ensureElement<HTMLElement>(
			'.form__errors',
			this.container
		);
		this._form = this.container as HTMLFormElement;

		this._formValidation = new ValidationHelper(
			this._submitButton,
			this._formErrors
		);

		this._form.addEventListener('submit', () => this._form.reset());
	}

	set validation(value: IOrder['validation']) {
		this._formValidation.setFormValidation(value);
	}

	set submitDisabled(value: boolean) {
		this.setDisabled(this._submitButton, value);
	}
}

export class OrderPayment extends Order {
	protected _buttonCard: HTMLButtonElement;
	protected _buttonCash: HTMLButtonElement;
	protected _addressInput: HTMLInputElement;
	protected _events: IEvents;

	constructor(events: IEvents) {
		super('#order');
		this._events = events;

		this._buttonCard = ensureElement<HTMLButtonElement>(
			'button[name="card"]',
			this.container
		);
		this._buttonCash = ensureElement<HTMLButtonElement>(
			'button[name="cash"]',
			this.container
		);
		this._addressInput = ensureElement<HTMLInputElement>(
			'input[name="address"]',
			this.container
		);

		this._buttonCard.addEventListener('click', () =>
			this._events.emit('buttonCard')
		);

		this._buttonCash.addEventListener('click', () =>
			this._events.emit('buttonCash')
		);

		this._addressInput.addEventListener('input', (ev: Event) => {
			const target = ev.target as HTMLInputElement;
			if (target instanceof HTMLInputElement) {
				this._events.emit('addressInput', { value: target.value });
			}
		});

		this.container.addEventListener('submit', (ev: Event) => {
			ev.preventDefault();
			this._events.emit('submitPayment');
		});
	}

	set payment(value: IOrder['payment']) {
		const buttonOnlineActive = value === 'card';
		this._buttonCard.classList.toggle('button_alt-active', buttonOnlineActive);
		this._buttonCash.classList.toggle('button_alt-active', !buttonOnlineActive);
	}
}

export class OrderContacts extends Order {
	protected _emailInput: HTMLInputElement;
	protected _phoneNumberInput: HTMLInputElement;
	protected _events: IEvents;

	constructor(events: IEvents) {
		super('#contacts');
		this._events = events;

		this._emailInput = ensureElement<HTMLInputElement>(
			'input[name="email"]',
			this.container
		);
		this._phoneNumberInput = ensureElement<HTMLInputElement>(
			'input[name="phone"]',
			this.container
		);

		this._emailInput.addEventListener(
			'input',
			this._dataInput.bind(this, 'email')
		);
		this._phoneNumberInput.addEventListener(
			'input',
			this._dataInput.bind(this, 'phoneNumber')
		);
		this.container.addEventListener('submit', (ev: Event) => {
			ev.preventDefault();
			this._events.emit('submitContact');
		});
	}

	protected _dataInput(type: string, ev: Event) {
		const target = ev.target as HTMLInputElement;
		if (target && target instanceof HTMLInputElement) {
			this._events.emit(`${type}Input`, { value: target.value });
		}
	}
}

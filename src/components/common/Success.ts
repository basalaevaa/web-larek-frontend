import { ensureElement, cloneTemplate } from '../../utils/utils';
import { Component } from '../Component';
import { IEvents } from '../base/events';
import { Validation } from '../../types';
import { ValidationHelper } from '../Validation';

interface ISuccess {
	description: string;
	validation?: Validation;
}

export class SuccessOrder extends Component<ISuccess> {
	protected _closeButton: HTMLButtonElement;
	protected _description: HTMLElement;
	protected _formValidation: ValidationHelper;

	constructor(events: IEvents) {
		super(cloneTemplate<HTMLTemplateElement>('#success'));

		this._description = ensureElement<HTMLElement>(
			`.order-success__description`,
			this.container
		);

		this._closeButton = ensureElement<HTMLButtonElement>(
			`.order-success__close`,
			this.container
		);

		this._closeButton.addEventListener('click', () => {
			events.emit('success_close');
		});
	}

	set description(value: number) {
		this.setText(this._description, value);
	}
}

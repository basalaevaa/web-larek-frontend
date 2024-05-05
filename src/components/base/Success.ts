import { EventsEnum, SuccessInterface } from './../types';
import { Component } from './Components';
import { EventEmitter } from './base/events';
import { formatNumber } from './../utils/utils';

export class SuccessModal extends Component<SuccessInterface> {
	protected _total: HTMLElement;
	protected _button: HTMLElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._total = this.containerElement.querySelector('.order-success__description');
		this._button = this.containerElement.querySelector('.order-success__close');

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit(EventsEnum.OrderComplete);
			});
		}
	}

  set total(total: number) {
    this._total.textContent = `Списано ${formatNumber(total)} синапсов`;
  }
}
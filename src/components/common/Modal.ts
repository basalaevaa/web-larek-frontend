import { ensureElement } from '../../utils/utils';
import { Component } from '../Component';
import { IEvents } from '../base/events';

interface IModal {
	content: HTMLElement;
}

export class Modal extends Component<IModal> {
	protected _closeButton: HTMLButtonElement;
	protected _content: HTMLElement;

	constructor(protected events: IEvents) {
		super(ensureElement<HTMLElement>('#modal-container'));
		this._closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			this.container
		);
		this._content = ensureElement<HTMLElement>(
			'.modal__content',
			this.container
		);

		const closeHandler = () => this.close();

		this._closeButton.addEventListener('click', closeHandler);
		this.container.addEventListener('click', closeHandler);
		this._content.addEventListener('click', (event) => event.stopPropagation());
		document.addEventListener(
			'keydown',
			(event) => event.key === 'Escape' && this.close()
		);
	}

	set content(value: HTMLElement) {
		this._content.replaceChildren(value);
	}

	open() {
		this.container.classList.add('modal_active');
	}

	close() {
		this.container.classList.remove('modal_active');
	}

	render(data: IModal): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}

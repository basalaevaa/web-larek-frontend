import { Component } from "./Components";
import { ensureElement } from "../utils/utils";
import { IEvents } from "./base/events";
import { EventsEnum , ModalInterface } from "./../types";

export class Modal extends Component<ModalInterface> {
  protected _closeButton: HTMLButtonElement;
  protected _content: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
    this._content = ensureElement<HTMLElement>('.modal__content', container);

    this._closeButton.addEventListener('click', this.close.bind(this));
    this.containerElement.addEventListener('click', this.close.bind(this));
    this._content.addEventListener('click', (event) => event.stopPropagation());
  }

  set content(value: HTMLElement) {
    this._content.replaceChildren(value);
  }

  open() {
    this.containerElement.classList.add('modal_active');
    this.events.emit(EventsEnum.ModalOpened);
  }

  close() {
    this.containerElement.classList.remove('modal_active');
    this.content = null;
    this.events.emit(EventsEnum.ModalClosed);
  }

  render(data: ModalInterface): HTMLElement {
    super.renderComponent(data);
    this.open();
    return this.containerElement;
  }
}
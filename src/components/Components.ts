import {IEvents} from "./base/events";

export const isInstanceOfDataModel = (obj: unknown): obj is DataModel<any> => {
    return obj instanceof DataModel;
}

export abstract class DataModel<T> {
    constructor(data: Partial<T>, protected eventHandlers: IEvents) {
        Object.assign(this, data);
    }

    emitChangesToHandlers(event: string, payload?: object) {
        this.eventHandlers.emit(event, payload ?? {});
    }
}

export abstract class Component<T> {
    protected constructor(protected readonly containerElement: HTMLElement) {}

    toggleClassOnElement(element: HTMLElement, className: string, force?: boolean) {
        element.classList.toggle(className, force);
    }

    protected setTextContent(element: HTMLElement, value: unknown) {
        if (element) {
            element.textContent = String(value);
        }
    }

    protected setImageContent(element: HTMLImageElement, imageData: { src: string, alt?: string }) {
        element.src = imageData.src;
        element.alt = imageData.alt ?? '';
    }
    

    protected setHiddenElement(element: HTMLElement) {
        element.hidden = true;
    }
    
    protected setVisibleElement(element: HTMLElement) {
        element.hidden = false;
    }

    renderComponent(data?: Partial<T>): HTMLElement {
        Object.assign(this as object, data ?? {});
        return this.containerElement;
    }
    
    changeDisabledStatus(element: HTMLElement, state: boolean) {
        if (element) {
            if (state) element.setAttribute('disabled', 'disabled');
            else element.removeAttribute('disabled');
        }
    }
}
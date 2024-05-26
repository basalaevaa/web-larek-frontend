import { Validation } from '../types';

export class ValidationHelper {
    protected _submitButton: HTMLButtonElement;
    protected _formErrors: HTMLElement;

    constructor(submitButton: HTMLButtonElement, formErrors: HTMLElement) {
        this._submitButton = submitButton;
        this._formErrors = formErrors;
    }

    setValidationBasket(validation: Validation): void {
        this._submitButton.disabled = validation && validation.length !== 0;
    }

    setFormValidation(validation: Validation): void {
        this._submitButton.disabled = validation && validation.length !== 0;
        this._formErrors.innerText = validation.length === 0 ? '' : validation.map((x) => x.error).join('. ');
    }
}

import { Validation, OrderValidationKeys } from '../types';

export function validateOrder(order: any, keys: OrderValidationKeys[]): Validation {
    const validation: Validation = [];

    keys.forEach((key) => {
        switch (key) {
            case 'items':
                if (order.items.length === 0) {
                    validation.push({ key, error: 'Нет товаров' });
                }
                break;
            case 'address':
                if (order.address.trim() === '') {
                    validation.push({ key, error: 'Не заполнен адрес' });
                }
                break;
            case 'email':
                if (order.email.trim() === '') {
                    validation.push({ key, error: 'Не заполнен email' });
                } else if (!order.email.toLowerCase().match(/^\S+@\S+\.\S+$/)) {
                    validation.push({ key, error: 'Email неккоректен' });
                }
                break;
            case 'phone':
                if (order.phone.trim() === '') {
                    validation.push({ key, error: 'Не заполнен номер телефона' });
                } else if (!order.phone.match(/^\+?\d{11}$/)) {
                    validation.push({ key, error: 'Номер телефона неккоректен' });
                }
                break;
        }
    });

    return validation;
}
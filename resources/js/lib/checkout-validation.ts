import type { CheckoutFormData } from '@/types/checkout';

export type CheckoutInputName = Exclude<
    keyof CheckoutFormData,
    'plan_id' | 'accept_terms'
>;

export type CheckoutValidationErrors = Partial<
    Record<CheckoutInputName, string>
>;

const representativeNamePattern = /^[\p{L}\s.'-]+$/u;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateCheckoutFields(
    data: CheckoutFormData,
): CheckoutValidationErrors {
    const errors: CheckoutValidationErrors = {};

    const representativeName = data.representative_name.trim();
    const companyName = data.company_name.trim();
    const address = data.representative_address.trim();
    const email = data.representative_email.trim();

    if (!representativeName) {
        errors.representative_name =
            'Ingresa el nombre completo del representante legal.';
    } else if (representativeName.length < 5) {
        errors.representative_name =
            'El nombre completo debe tener al menos 5 caracteres.';
    } else if (!representativeNamePattern.test(representativeName)) {
        errors.representative_name =
            'El nombre solo puede contener letras, espacios, apóstrofes y guiones.';
    }

    if (!data.representative_rut.trim()) {
        errors.representative_rut =
            'Ingresa el RUT del representante legal.';
    } else if (!isValidChileanRut(data.representative_rut)) {
        errors.representative_rut =
            'El RUT del representante legal no es válido.';
    }

    if (!companyName) {
        errors.company_name =
            'Ingresa la razón social o nombre de la empresa.';
    } else if (companyName.length < 2) {
        errors.company_name =
            'La razón social debe tener al menos 2 caracteres.';
    }

    if (!data.company_rut.trim()) {
        errors.company_rut = 'Ingresa el RUT de la empresa.';
    } else if (!isValidChileanRut(data.company_rut)) {
        errors.company_rut = 'El RUT de la empresa no es válido.';
    }

    if (!address) {
        errors.representative_address =
            'Ingresa la dirección particular del representante legal.';
    } else if (address.length < 8) {
        errors.representative_address =
            'Ingresa una la dirección completa.';
    }

    if (!email) {
        errors.representative_email =
            'Ingresa el correo electrónico del representante legal.';
    } else if (!emailPattern.test(email)) {
        errors.representative_email =
            'Ingresa un correo electrónico válido.';
    }

    if (!data.representative_whatsapp.trim()) {
        errors.representative_whatsapp =
            'Ingresa el número de WhatsApp del representante legal.';
    } else if (!isValidChileanMobile(data.representative_whatsapp)) {
        errors.representative_whatsapp =
            'Ingresa un número válido, por ejemplo: +56 9 9999 9999.';
    }

    return errors;
}

export function isCheckoutFormComplete(
    data: CheckoutFormData,
): boolean {
    return Object.keys(validateCheckoutFields(data)).length === 0;
}

export function isValidChileanRut(value: string): boolean {
    const normalizedRut = value
        .toUpperCase()
        .replace(/[^0-9K]/g, '');

    if (normalizedRut.length < 8 || normalizedRut.length > 9) {
        return false;
    }

    const body = normalizedRut.slice(0, -1);
    const providedDigit = normalizedRut.slice(-1);

    if (!/^\d+$/.test(body)) {
        return false;
    }

    let sum = 0;
    let multiplier = 2;

    for (let index = body.length - 1; index >= 0; index -= 1) {
        sum += Number(body[index]) * multiplier;
        multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }

    const result = 11 - (sum % 11);

    const expectedDigit =
        result === 11
            ? '0'
            : result === 10
              ? 'K'
              : String(result);

    return providedDigit === expectedDigit;
}

export function formatChileanRut(value: string): string {
    const cleanedValue = value
        .toUpperCase()
        .replace(/[^0-9K]/g, '')
        .slice(0, 9);

    if (cleanedValue.length <= 1) {
        return cleanedValue;
    }

    const body = cleanedValue.slice(0, -1);
    const verificationDigit = cleanedValue.slice(-1);

    const formattedBody = body.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        '.',
    );

    return `${formattedBody}-${verificationDigit}`;
}

export function isValidChileanMobile(value: string): boolean {
    const digits = value.replace(/\D/g, '');

    return /^9\d{8}$/.test(digits) || /^569\d{8}$/.test(digits);
}

export function formatChileanMobile(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 11);

    const localNumber = digits.startsWith('56')
        ? digits.slice(2, 11)
        : digits.slice(0, 9);

    if (!localNumber) {
        return '';
    }

    const firstDigit = localNumber.slice(0, 1);
    const firstBlock = localNumber.slice(1, 5);
    const secondBlock = localNumber.slice(5, 9);

    return [
        '+56',
        firstDigit,
        firstBlock,
        secondBlock,
    ]
        .filter(Boolean)
        .join(' ');
}
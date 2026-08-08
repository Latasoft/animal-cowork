import type { ContractGenerationData } from '@/types/checkout';

const checkoutStorageKey = 'animal_cowork_checkout';

const sharedRequiredFields = [
    'plan_id',
    'representative_email',
    'representative_whatsapp',
    'representative_name',
    'representative_rut',
    'representative_address',
    'representative_commune',
    'representative_region',
    'contract_date',
    'contract_start_date',
    'contract_end_date',
] as const satisfies readonly (keyof ContractGenerationData)[];

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
}

function hasRequiredString(
    value: Record<string, unknown>,
    key: keyof ContractGenerationData,
): boolean {
    return typeof value[key] === 'string' && value[key].trim().length > 0;
}

export function isCompleteContractData(
    value: unknown,
): value is ContractGenerationData {
    if (!isRecord(value)) {
        return false;
    }

    if (
        typeof value.is_natural_person !== 'boolean' ||
        typeof value.company_in_progress !== 'boolean' ||
        typeof value.company_name !== 'string' ||
        typeof value.company_rut !== 'string' ||
        !sharedRequiredFields.every((field) => hasRequiredString(value, field))
    ) {
        return false;
    }

    if (value.company_in_progress) {
        return false;
    }

    if (value.is_natural_person) {
        return true;
    }

    return (
        hasRequiredString(value, 'company_name') &&
        hasRequiredString(value, 'company_rut')
    );
}

export function readContractData(): ContractGenerationData | null {
    if (typeof window === 'undefined') {
        return null;
    }

    const storedValue = window.sessionStorage.getItem(checkoutStorageKey);

    if (!storedValue) {
        return null;
    }

    try {
        const parsedValue: unknown = JSON.parse(storedValue);

        if (isCompleteContractData(parsedValue)) {
            return parsedValue;
        }
    } catch {
        // El valor se elimina abajo para que un JSON corrupto no bloquee el checkout.
    }

    window.sessionStorage.removeItem(checkoutStorageKey);

    return null;
}

export function storeContractData(data: ContractGenerationData): void {
    if (typeof window === 'undefined') {
        return;
    }

    window.sessionStorage.setItem(checkoutStorageKey, JSON.stringify(data));
}

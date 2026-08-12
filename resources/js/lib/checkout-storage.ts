import type { ContractFlow, ContractGenerationData } from '@/types/checkout';
import type { Plan } from '@/types/plan';

const checkoutStorageKey = 'animal_cowork_checkout';

export interface RenewalContractStorageContext {
    previous_plan_id: Plan['id'];
    expires_at: string;
}

export interface ContractStorageState {
    data: ContractGenerationData;
    flow: ContractFlow;
    renewal: RenewalContractStorageContext | null;
}

interface StoredContractEnvelope {
    version: 1;
    contract_data: ContractGenerationData;
    flow: ContractFlow;
    renewal?: RenewalContractStorageContext;
}

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
    return readContractStorage()?.data ?? null;
}

export function readContractStorage(): ContractStorageState | null {
    if (typeof window === 'undefined') {
        return null;
    }

    const storedValue = window.sessionStorage.getItem(checkoutStorageKey);

    if (!storedValue) {
        return null;
    }

    try {
        const parsedValue: unknown = JSON.parse(storedValue);

        if (
            isRecord(parsedValue) &&
            parsedValue.version === 1 &&
            isCompleteContractData(parsedValue.contract_data) &&
            (parsedValue.flow === 'checkout' || parsedValue.flow === 'renewal')
        ) {
            const renewal = parsedValue.renewal;

            if (parsedValue.flow === 'checkout') {
                return {
                    data: parsedValue.contract_data,
                    flow: 'checkout',
                    renewal: null,
                };
            }

            if (
                isRecord(renewal) &&
                typeof renewal.previous_plan_id === 'string' &&
                renewal.previous_plan_id.trim().length > 0 &&
                typeof renewal.expires_at === 'string' &&
                renewal.expires_at.trim().length > 0
            ) {
                return {
                    data: parsedValue.contract_data,
                    flow: 'renewal',
                    renewal: {
                        previous_plan_id: renewal.previous_plan_id,
                        expires_at: renewal.expires_at,
                    },
                };
            }
        }

        // Compatibilidad con sesiones creadas antes de incorporar el flujo.
        if (isCompleteContractData(parsedValue)) {
            return {
                data: parsedValue,
                flow: 'checkout',
                renewal: null,
            };
        }
    } catch {
        // El valor se elimina abajo para que un JSON corrupto no bloquee el checkout.
    }

    window.sessionStorage.removeItem(checkoutStorageKey);

    return null;
}

export function storeContractData(data: ContractGenerationData): void {
    storeContractStorage({
        data,
        flow: 'checkout',
        renewal: null,
    });
}

export function storeContractStorage(state: ContractStorageState): void {
    if (typeof window === 'undefined') {
        return;
    }

    const storedValue: StoredContractEnvelope = {
        version: 1,
        contract_data: state.data,
        flow: state.flow,
        ...(state.renewal ? { renewal: state.renewal } : {}),
    };

    window.sessionStorage.setItem(
        checkoutStorageKey,
        JSON.stringify(storedValue),
    );
}

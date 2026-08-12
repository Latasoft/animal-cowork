import type { Plan } from '@/types/plan';

export interface CheckoutPlan {
    id: string;
    name: string;
    tagline: string;
    price: number;
    duration: string;
    contractDurationMonths: number;
    image: string;
    imageAlt: string;
}

export interface CheckoutFormData {
    plan_id: string;

    // Datos solicitados antes del pago
    representative_email: string;
    representative_whatsapp: string;
    discount_code: string;

    // Consentimientos
    accept_terms: boolean;
    accept_data_policy: boolean;
}

export type CheckoutFormErrors = Partial<
    Record<keyof CheckoutFormData, string>
>;

export type SetCheckoutFormData = <Key extends keyof CheckoutFormData>(
    key: Key,
    value: CheckoutFormData[Key],
) => void;

export interface ContractDataFormData {
    representative_name: string;
    representative_rut: string;
    company_name: string;
    company_rut: string;
    representative_address: string;
    company_in_progress: boolean;
    is_natural_person: boolean;
    representative_commune: string;
    representative_region: string;
}

export interface ContractDates {
    contract_date: string;
    contract_start_date: string;
    contract_end_date: string;
}

export type ContractGenerationData = Pick<
    CheckoutFormData,
    'plan_id' | 'representative_email' | 'representative_whatsapp'
> &
    ContractDataFormData &
    ContractDates;

export type ContractFlow = 'checkout' | 'renewal';

export type ContractDataFormErrors = Partial<
    Record<keyof ContractDataFormData, string>
>;

export type SetContractDataFormData = <Key extends keyof ContractDataFormData>(
    key: Key,
    value: ContractDataFormData[Key],
) => void;

/**
 * Información de un cliente que ya completó anteriormente
 * el proceso de contratación.
 *
 * Más adelante este objeto será retornado desde Laravel/MySQL.
 */
export interface StoredCustomerContract {
    representative_name: string;
    representative_rut: string;

    company_name: string;
    company_rut: string;

    representative_address: string;
    representative_commune: string;
    representative_region: string;

    representative_email: string;
    representative_whatsapp: string;

    /**
     * Nos permite saber qué plantilla contractual utilizar
     * posteriormente en la previsualización.
     */
    is_natural_person: boolean;

    /**
     * ID del plan proveniente del catálogo central de planes.
     */
    current_plan: Plan['id'];

    /**
     * Temporalmente string para facilitar la simulación frontend.
     * Posteriormente probablemente vendrá como fecha desde backend.
     */
    expires_at: string;
}

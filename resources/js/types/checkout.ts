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

export type CheckoutFlow = 'checkout' | 'renewal';

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

export type ContractDataFormErrors = Partial<
    Record<keyof ContractDataFormData, string>
>;

export type SetContractDataFormData = <Key extends keyof ContractDataFormData>(
    key: Key,
    value: ContractDataFormData[Key],
) => void;

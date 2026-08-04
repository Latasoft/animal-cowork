export interface CheckoutPlan {
    id: string;
    name: string;
    tagline: string;
    price: number;
    duration: string;
    image: string;
    imageAlt: string;
}

export interface CheckoutFormData {
    plan_id: string;
    representative_name: string;
    representative_rut: string;
    company_name: string;
    company_rut: string;
    representative_address: string;
    representative_email: string;
    representative_whatsapp: string;
    accept_terms: boolean;
}

export type CheckoutFormErrors = Partial<
    Record<keyof CheckoutFormData, string>
>;

export type SetCheckoutFormData = <
    Key extends keyof CheckoutFormData,
>(
    key: Key,
    value: CheckoutFormData[Key],
) => void;
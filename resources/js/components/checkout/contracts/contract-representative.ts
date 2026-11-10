import type { CheckoutFlow } from '@/types/checkout';

export interface ContractRepresentative {
    name: string;
    rut: string;
}

/** Representante legal en los contratos de nuevas ventas (planes Fénix, León y Lobo). */
const SALES_REPRESENTATIVE: ContractRepresentative = {
    name: 'CAMILO ALONSO MC-WOLFF MUÑOZ',
    rut: '16.146.030-3',
};

/** Representante legal en los contratos de renovaciones. */
const RENEWAL_REPRESENTATIVE: ContractRepresentative = {
    name: 'CRISTÓBAL VICENTE FIORI-LEGGERO VISLYON',
    rut: '16.660.000-6',
};

export function contractRepresentative(
    flow: CheckoutFlow = 'checkout',
): ContractRepresentative {
    return flow === 'renewal' ? RENEWAL_REPRESENTATIVE : SALES_REPRESENTATIVE;
}

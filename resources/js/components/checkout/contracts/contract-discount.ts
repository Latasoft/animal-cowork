import type { ContractDiscount } from '@/types/checkout';

/**
 * Renta que se escribe en el contrato: el precio de oficina del plan
 * menos el descuento aplicado (cupón o transferencia por un monto menor).
 * Así el contrato muestra el monto que el cliente realmente pagó.
 */
export function contractRent(
    priceOffice: number,
    discount: ContractDiscount | null | undefined,
): number {
    if (!discount || discount.amount <= 0) {
        return priceOffice;
    }

    return Math.max(0, priceOffice - discount.amount);
}

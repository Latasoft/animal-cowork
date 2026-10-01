import type { ContractDiscount } from '@/types/checkout';
import { formatClp } from '@/utils/currency';

/**
 * Frase del contrato cuando la contratación tuvo descuento
 * (cupón o transferencia por un monto menor). Sin descuento, no se agrega nada.
 */
export function contractDiscountParagraphs(
    discount: ContractDiscount | null | undefined,
): string[] {
    if (!discount || discount.amount <= 0) {
        return [];
    }

    const applied = discount.code
        ? `el cupón de descuento ${discount.code} por ${formatClp(discount.amount)}`
        : `un descuento de ${formatClp(discount.amount)}`;

    return [
        `En esta contratación se aplicó ${applied}, por lo que el monto total pagado fue de ${formatClp(discount.total)}.`,
    ];
}

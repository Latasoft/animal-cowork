import type { ContractGenerationData } from '@/types/checkout';
import type { Plan } from '@/types/plan';

function sanitizeFileSegment(value: string): string {
    return value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase('es-CL')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

export function createContractFile(
    blob: Blob,
    data: ContractGenerationData,
    plan: Plan,
): File {
    const customerIdentifier = data.is_natural_person
        ? data.representative_rut
        : data.company_name;
    const fileName = [
        'contrato-animal-cowork',
        sanitizeFileSegment(plan.id),
        sanitizeFileSegment(customerIdentifier),
    ]
        .filter(Boolean)
        .join('-');

    return new File([blob], `${fileName}.pdf`, {
        type: 'application/pdf',
    });
}

/**
 * El backend deberá volver a validar todos los datos y regenerar o verificar
 * el documento antes de considerarlo definitivo.
 */
export function createContractConfirmationPayload(
    file: File,
    data: ContractGenerationData,
    plan: Plan,
): FormData {
    const payload = new FormData();

    payload.append(
        'contract_type',
        data.is_natural_person ? 'natural_person' : 'legal_entity',
    );
    payload.append('plan_id', plan.id);
    payload.append('contract_action', 'new');
    payload.append('contract_data', JSON.stringify(data));
    payload.append('contract_pdf', file);

    return payload;
}

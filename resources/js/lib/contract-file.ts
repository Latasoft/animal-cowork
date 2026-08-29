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

export function createContractFileName(
    data: ContractGenerationData,
    plan: Plan,
): string {
    const customerIdentifier = data.is_natural_person
        ? data.representative_rut
        : data.company_name;
    const fileName = [
        'contrato-animal-cowork',
        sanitizeFileSegment(plan.slug),
        sanitizeFileSegment(customerIdentifier),
    ]
        .filter(Boolean)
        .join('-');

    return `${fileName}.pdf`;
}

export function blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            const result = reader.result;

            if (typeof result !== 'string') {
                reject(new Error('No fue posible leer el contrato.'));

                return;
            }

            resolve(result.slice(result.indexOf(',') + 1));
        };

        reader.onerror = () =>
            reject(
                reader.error ?? new Error('No fue posible leer el contrato.'),
            );

        reader.readAsDataURL(blob);
    });
}

/**
 * El backend vuelve a validar todos los datos y consulta el plan real
 * desde la base de datos antes de considerarlo definitivo.
 *
 * El PDF viaja como base64 (y no como archivo multipart) para evitar
 * depender del mecanismo de subida de archivos del servidor de desarrollo.
 */
export function createContractConfirmationPayload(
    data: ContractGenerationData,
    pdfBase64: string,
    pdfName: string,
): FormData {
    const payload = new FormData();

    payload.append(
        'contract_type',
        data.is_natural_person ? 'natural' : 'legal',
    );
    payload.append('email', data.representative_email);
    payload.append('phone', data.representative_whatsapp);
    payload.append('representative_name', data.representative_name);
    payload.append('representative_rut', data.representative_rut);
    payload.append('address', data.representative_address);
    payload.append('commune', data.representative_commune);
    payload.append('region', data.representative_region);

    if (!data.is_natural_person) {
        payload.append('company_name', data.company_name);
        payload.append('company_rut', data.company_rut);
    }

    payload.append('contract_pdf_base64', pdfBase64);
    payload.append('contract_pdf_name', pdfName);

    return payload;
}

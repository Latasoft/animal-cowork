import { pdf } from '@react-pdf/renderer';

import type { ContractGenerationData } from '@/types/checkout';
import type { Plan } from '@/types/plan';
import { LegalEntityContractPdf } from './legal-entity-contract-pdf';
import { NaturalPersonContractPdf } from './natural-person-contract-pdf';

export async function generateContractPdf(
    data: ContractGenerationData,
    plan: Plan,
): Promise<Blob> {
    const document = data.is_natural_person ? (
        <NaturalPersonContractPdf data={data} plan={plan} />
    ) : (
        <LegalEntityContractPdf data={data} plan={plan} />
    );

    return pdf(document).toBlob();
}

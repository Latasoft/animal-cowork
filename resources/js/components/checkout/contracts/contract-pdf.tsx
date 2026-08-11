import { pdf } from '@react-pdf/renderer';

import type { ContractGenerationData } from '@/types/checkout';
import type { Plan } from '@/types/plan';
import type { ContractLogoSource } from './contract-pdf-layout';
import { LegalEntityContractPdf } from './legal-entity-contract-pdf';
import { NaturalPersonContractPdf } from './natural-person-contract-pdf';

const contractLogoPath = '/images/Logo/logo.webp';
let logoSourcePromise: Promise<ContractLogoSource> | null = null;

interface BufferCompatibility {
    isBuffer: (value: unknown) => boolean;
}

function ensureImageBufferCompatibility(): void {
    const runtime = globalThis as unknown as {
        Buffer?: BufferCompatibility;
    };

    runtime.Buffer ??= {
        isBuffer: (value) => value instanceof Uint8Array,
    };
}

function loadImage(source: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new window.Image();

        image.onload = () => resolve(image);
        image.onerror = () =>
            reject(new Error('No fue posible cargar el logo.'));
        image.src = source;
    });
}

async function getPdfLogoSource(): Promise<ContractLogoSource> {
    logoSourcePromise ??= (async () => {
        const image = await loadImage(contractLogoPath);
        const canvas = document.createElement('canvas');
        const targetWidth = 424;
        const targetHeight = Math.round(
            targetWidth * (image.naturalHeight / image.naturalWidth),
        );

        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const context = canvas.getContext('2d');

        if (!context) {
            throw new Error('No fue posible preparar el logo del contrato.');
        }

        context.drawImage(image, 0, 0, targetWidth, targetHeight);

        return {
            uri: canvas.toDataURL('image/png'),
        } as ContractLogoSource;
    })();

    return logoSourcePromise;
}

export async function generateContractPdf(
    data: ContractGenerationData,
    plan: Plan,
): Promise<Blob> {
    ensureImageBufferCompatibility();

    const logoSource = await getPdfLogoSource();

    return renderContractPdf(data, plan, logoSource);
}

export function renderContractPdf(
    data: ContractGenerationData,
    plan: Plan,
    logoSource: ContractLogoSource,
): Promise<Blob> {
    const document = data.is_natural_person ? (
        <NaturalPersonContractPdf
            data={data}
            plan={plan}
            logoSource={logoSource}
        />
    ) : (
        <LegalEntityContractPdf
            data={data}
            plan={plan}
            logoSource={logoSource}
        />
    );

    return pdf(document).toBlob();
}

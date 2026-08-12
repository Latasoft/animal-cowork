import type { Plan } from '@/types/plan';

export const plans: Plan[] = [
    {
        id: 'lobo',
        name: 'Lobo',
        badge: 'Recomendado',
        priceOffice: 47580,
        priceAdditional: 42410,
        image: '/images/plans/lobo.webp',
        imageAlt: 'Ilustración de un lobo',
        features: [
            'Contrato de Oficina Virtual por 1 año',
            'Gestión de patente comercial',
            'Dirección tributaria',
            'Dirección comercial',
            'Recepción de documentos y correspondencia',
            'Escaneo de documentos',
            'Acceso a sala de reuniones',
        ],
        action: {
            label: 'ELIGIR PLAN',
            href: '/checkout/lobo',
        },
        theme: 'green',
        contractDurationMonths: 12,
    },
    {
        id: 'fenix',
        name: 'Fénix',
        badge: 'Más vendido',
        priceOffice: 59990,
        priceAdditional: 0,
        image: '/images/plans/fenix.webp',
        imageAlt: 'Ilustración de un fénix',
        features: [
            'Contrato de Oficina Virtual por 2 años',
            'Acceso a sala de reuniones',
            'Dirección tributaria',
            'Dirección comercial',
            'Recepción de documentos y correspondencia',
            'Escaneo de documentos',
        ],
        action: {
            label: 'ELIGIR PLAN',
            href: '/checkout/fenix',
        },
        theme: 'orange',
        featured: true,
        contractDurationMonths: 24,
    },
    {
        id: 'leon',
        name: 'León',
        priceOffice: 59990,
        priceAdditional: 30000,
        image: '/images/plans/leon.webp',
        imageAlt: 'Ilustración de un león',
        features: [
            'Contrato de Oficina Virtual por 2 años',
            'Gestión de patente comercial',
            'Dirección tributaria',
            'Dirección comercial',
            'Recepción de documentos y correspondencia',
            'Escaneo de documentos',
            'Acceso a sala de reuniones',
        ],
        action: {
            label: 'ELIGIR PLAN',
            href: '/checkout/leon',
        },
        theme: 'gold',
        contractDurationMonths: 24,
    },
];

export function getPlanTotalPrice(plan: Plan): number {
    return plan.priceOffice + plan.priceAdditional;
}

export function formatClp(value: number): string {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

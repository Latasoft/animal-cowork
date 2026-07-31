import type { Plan } from '@/types/plan';

export const plans: Plan[] = [
    {
        id: 'lobo',
        name: 'Lobo',
        badge: 'Recomendado',
        price: '$89.990',
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
            href: '#contacto',
        },
        theme: 'green',
    },
    {
        id: 'fenix',
        name: 'Fénix',
        badge: 'Más vendido',
        price: '$59.990',
        image: '/images/plans/fenix.webp',
        imageAlt: 'Ilustración de un fénix',
        features: [
            'Contrato de Oficina Virtual por 2 años',
            'Dirección tributaria',
            'Dirección comercial',
            'Recepción de documentos y correspondencia',
            'Escaneo de documentos',
            'Acceso a sala de reuniones',
        ],
        action: {
            label: 'ELIGIR PLAN',
            href: '#contacto',
        },
        theme: 'orange',
        featured: true,
    },
    {
        id: 'leon',
        name: 'León',
        price: '$98.000',
        image: '/images/plans/leon.webp',
        imageAlt: 'Ilustración de un león',
        features: [
            'Contrato de Oficina Virtual por 2 años',
            'Dirección tributaria',
            'Dirección comercial',
            'Recepción de documentos y correspondencia',
            'Escaneo de documentos',
            'Acceso a sala de reuniones',
        ],
        action: {
            label: 'ELIGIR PLAN',
            href: '#contacto',
        },
        theme: 'gold',
    },
];

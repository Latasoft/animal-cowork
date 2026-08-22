export type PrivateOfficeCurrency = 'CLP' | 'UF';

export type PrivateOfficeBenefitIcon =
    | 'wifi'
    | 'meeting-room'
    | 'kitchen'
    | 'common-areas'
    | 'parking'
    | 'expenses'
    | 'flexible-rent';

export interface PrivateOffice {
    id: string;
    name: string;
    slug: string;
    image: string;
    imageAlt: string;
    areaM2: number;
    isAvailable: boolean;
    price: number | null;
    currency: PrivateOfficeCurrency;
    expensesIncluded: boolean;
    features: string[];
    sortOrder: number;
    isVisible: boolean;
}

export interface PrivateOfficesPageContent {
    seo: {
        title: string;
        description: string;
    };
    hero: {
        eyebrow: string;
        title: string;
        subtitle: string;
        description: string;
        image: string;
        imageAlt: string;
        highlights: string[];
    };
    benefits: {
        label: string;
        icon: PrivateOfficeBenefitIcon;
    }[];
    officesSection: {
        eyebrow: string;
        title: string;
        description: string;
    };
    whatsapp: {
        phone: string;
        defaultMessage: string;
        heroActionLabel: string;
        officeActionLabel: string;
        finalActionLabel: string;
    };
    requirements: {
        title: string;
        description: string;
        actionLabel: string;
        documentUrl: string;
    };
    finalCta: {
        eyebrow: string;
        title: string;
        description: string;
        details: string[];
    };
}

const standardOfficeFeatures = [
    'Wifi',
    'Sala de reuniones',
    'Cocina',
    'Salas de espera y terraza',
    'Estacionamiento',
];

export const privateOfficesPageContent: PrivateOfficesPageContent = {
    seo: {
        title: 'Oficinas Privadas',
        description:
            'Arrienda oficinas privadas all inclusive en Animal Co-work. Espacios equipados, sala de reuniones, cocina, estacionamiento y gastos incluidos.',
    },
    hero: {
        eyebrow: 'Espacios para tu empresa',
        title: 'Oficinas Privadas',
        subtitle: 'Oficinas all inclusive',
        description:
            'Trabaja en un espacio privado, equipado y listo para comenzar. Nuestras oficinas incluyen los principales servicios que necesitas para desarrollar tu actividad en un entorno profesional.',
        image: '/images/plans/OFICINAS-PRIVADAS.jpg',
        imageAlt:
            'Oficinas privadas y espacios comunes de Animal Co-work en Providencia',
        highlights: [
            'Arriendo flexible',
            'Facilidades de pago para el mes de garantía',
            'Gastos incluidos',
        ],
    },
    benefits: [
        { label: 'Wifi gratuito', icon: 'wifi' },
        { label: 'Sala de reuniones', icon: 'meeting-room' },
        { label: 'Acceso a cocina', icon: 'kitchen' },
        { label: 'Salas de espera y terraza', icon: 'common-areas' },
        { label: 'Estacionamiento', icon: 'parking' },
        { label: 'Gastos incluidos', icon: 'expenses' },
        { label: 'Arriendo flexible', icon: 'flexible-rent' },
    ],
    officesSection: {
        eyebrow: 'Espacios privados',
        title: 'Nuestras Oficinas Privadas',
        description:
            'Conoce nuestros espacios y consulta por próximas disponibilidades.',
    },
    whatsapp: {
        phone: '+56 9 9055 6983',
        defaultMessage:
            'Hola, quisiera consultar por disponibilidad de oficinas privadas en Animal Co-work.',
        heroActionLabel: 'Consultar disponibilidad',
        officeActionLabel: 'Consultar disponibilidad',
        finalActionLabel: 'Consultar por WhatsApp',
    },
    requirements: {
        title: '¿Quieres conocer los requisitos de arrendamiento?',
        description:
            'Revisa la documentación necesaria antes de consultar por una oficina.',
        actionLabel: 'Descargar requisitos',
        documentUrl:
            '/images/plans/REQUISITOS-ARRENDAMIENTO-ANIMAL-COWORKING..pdf',
    },
    finalCta: {
        eyebrow: 'Próximas disponibilidades',
        title: '¿Buscas una oficina privada?',
        description:
            'Consulta por próximas disponibilidades y alternativas de arriendo.',
        details: [
            'Consulta por facilidades de pago para el mes de garantía.',
            'Evaluación para arriendo flexible.',
        ],
    },
};

export const privateOffices: PrivateOffice[] = [
    {
        id: 'office-4',
        name: 'Oficina 4',
        slug: 'oficina-4',
        image: '/images/plans/ofice4.jpg',
        imageAlt: 'Interior de la Oficina 4 de Animal Co-work',
        areaM2: 11,
        isAvailable: false,
        price: 260000,
        currency: 'CLP',
        expensesIncluded: true,
        features: [...standardOfficeFeatures],
        sortOrder: 1,
        isVisible: true,
    },
    {
        id: 'office-2',
        name: 'Oficina 2',
        slug: 'oficina-2',
        image: '/images/plans/ofice2.jpg',
        imageAlt: 'Interior de la Oficina 2 de Animal Co-work',
        areaM2: 15,
        isAvailable: false,
        price: 340000,
        currency: 'CLP',
        expensesIncluded: true,
        features: [...standardOfficeFeatures],
        sortOrder: 2,
        isVisible: true,
    },
    {
        id: 'office-3',
        name: 'Oficina 3',
        slug: 'oficina-3',
        image: '/images/plans/ofice3.jpg',
        imageAlt: 'Interior de la Oficina 3 de Animal Co-work',
        areaM2: 20,
        isAvailable: false,
        price: 390000,
        currency: 'CLP',
        expensesIncluded: true,
        features: [...standardOfficeFeatures],
        sortOrder: 3,
        isVisible: true,
    },
    {
        id: 'office-5',
        name: 'Oficina 5',
        slug: 'oficina-5',
        image: '/images/plans/ofice5.jpg',
        imageAlt: 'Interior de la Oficina 5 de Animal Co-work',
        areaM2: 10.5,
        isAvailable: false,
        price: 260000,
        currency: 'CLP',
        expensesIncluded: true,
        features: [...standardOfficeFeatures],
        sortOrder: 4,
        isVisible: true,
    },
    {
        id: 'office-7',
        name: 'Oficina 7',
        slug: 'oficina-7',
        image: '/images/plans/ofice7.jpg',
        imageAlt: 'Interior de la Oficina 7 de Animal Co-work',
        areaM2: 9,
        isAvailable: false,
        price: 280000,
        currency: 'CLP',
        expensesIncluded: true,
        features: [...standardOfficeFeatures],
        sortOrder: 5,
        isVisible: true,
    },
    {
        id: 'office-9',
        name: 'Oficina 9',
        slug: 'oficina-9',
        image: '/images/plans/ofice9.jpg',
        imageAlt: 'Interior de la Oficina 9 de Animal Co-work',
        areaM2: 13.5,
        isAvailable: false,
        price: 340000,
        currency: 'CLP',
        expensesIncluded: true,
        features: ['Aire acondicionado', ...standardOfficeFeatures],
        sortOrder: 6,
        isVisible: true,
    },
];

export type PrivateOfficeBenefitIcon =
    | 'wifi'
    | 'meeting-room'
    | 'kitchen'
    | 'common-areas'
    | 'parking'
    | 'expenses'
    | 'flexible-rent';

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
        {
            label: 'Wifi gratuito',
            icon: 'wifi',
        },
        {
            label: 'Sala de reuniones',
            icon: 'meeting-room',
        },
        {
            label: 'Acceso a cocina',
            icon: 'kitchen',
        },
        {
            label: 'Salas de espera y terraza',
            icon: 'common-areas',
        },
        {
            label: 'Estacionamiento',
            icon: 'parking',
        },
        {
            label: 'Gastos incluidos',
            icon: 'expenses',
        },
        {
            label: 'Arriendo flexible',
            icon: 'flexible-rent',
        },
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

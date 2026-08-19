export interface CompanyFormationPageContent {
    eyebrow: string;
    title: string;
    description: string;

    externalService: {
        label: string;
        title: string;
        price: number;
        description: string;
    };

    virtualOffice: {
        label: string;
        title: string;
        price: number;
        duration: string;
    };

    totalPrice: number;

    serviceSection: {
        eyebrow: string;
        title: string;
        description: string;
        requirements: string[];
        foreignerNotice: string;
    };

    includedServices: {
        title: string;
        items: string[];
    };

    contact: {
        title: string;
        description: string;
        email: string;
        whatsapp: string;
    };

    image: {
        src: string;
        alt: string;
    };

    primaryAction: {
        label: string;
        href: string;
    };
}

export const companyFormationContent: CompanyFormationPageContent = {
    eyebrow: 'Servicio para clientes Animal Co-work',

    title:
        'Constitución de Empresa + Inicio de Actividades + Oficina Virtual 2 años',

    description:
        'Obtén la constitución de tu sociedad, realiza el inicio de actividades ante el SII y contrata tu Oficina Virtual Animal Co-work por 2 años.',

    externalService: {
        label: 'Servicio adicional externo',

        title:
            'Constitución de Empresa + Inicio de Actividades',

        price: 35000,

        description:
            'Valor exclusivo al contratar una Oficina Virtual Animal Co-work.',
    },

    virtualOffice: {
        label: 'Oficina Virtual Animal Co-work',

        title: 'Oficina Virtual',

        price: 59990,

        duration: '2 años',
    },

    totalPrice: 94990,

    serviceSection: {
        eyebrow: 'Constitución e iniciación de empresas',

        title:
            'Obtén tu empresa legalmente constituida y con RUT ante el SII',

        description:
            'El servicio de creación de empresa permite obtener tu empresa legalmente constituida y realizar el proceso de inicio de actividades ante el Servicio de Impuestos Internos.',

        requirements: [
            'Clave personal del Servicio de Impuestos Internos (SII).',
            'Clave Única del Registro Civil.',
            'Cédula de identidad vigente.',
        ],

        foreignerNotice:
            'En el caso de extranjeros, las cédulas deben encontrarse vigentes. El representante legal de la empresa debe contar con permanencia definitiva. Los socios pueden contar con permanencia temporal.',
    },

    includedServices: {
        title: '¿Qué incluye el servicio?',

        items: [
            'Constitución de empresa.',
            'Inicio de actividades ante el SII.',
            'Verificación de actividades.',
            'Activación del proceso de facturación.',
            'Oficina Virtual Animal Co-work por 2 años.',
        ],
    },

    contact: {
        title: '¿Necesitas ayuda antes de contratar?',

        description:
            'Puedes comunicarte directamente con nuestro equipo para resolver dudas sobre el servicio.',

        email: 'oficinavirtual@animalcoworking.cl',

        whatsapp: '+56990556983',
    },

    image: {
        src: '/images/plans/constitucion.jpg',

        alt:
            'Constitución de empresa, inicio de actividades y oficina virtual Animal Co-work',
    },

    primaryAction: {
        label: 'CONTRATAR AHORA',

        /*
         * Temporal.
         * Posteriormente este enlace deberá iniciar la creación
         * de la orden y redirigir al link de pago.
         */
        href: '#contratar',
    },
};

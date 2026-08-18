import { patent_management } from '@/routes/services';
import type {
    AdditionalService,
    OfficeSetupStep,
} from '@/types/additional-services';

export const additionalServices: AdditionalService[] = [
    {
        id: 'patente-providencia',
        title: 'GESTIÓN DE PATENTE COMERCIAL EN PROVIDENCIA',
        description:
            'Gestionamos tu patente comercial de forma rápida y segura.',
        icon: 'patent',
        action: {
            label: 'CONTRATAR SERVICIO',
            href: patent_management.url(),
        },
    },
    {
        id: 'constitucion-empresa',
        title: 'CONSTITUCIÓN DE EMPRESA + INICIO DE ACTIVIDADES Y OFICINA VIRTUAL',
        description:
            'Constituye tu empresa, realiza el inicio de actividades ante el SII y contrata tu oficina virtual en un solo proceso.',
        icon: 'company',
        action: {
            label: 'CONTRATAR SERVICIO',
            href: '/constitucion-de-empresa',
        },
    },
];

export const officeSetupSteps: OfficeSetupStep[] = [
    {
        id: 'step-1',
        step: 1,
        title: 'Elige tu Plan.',
        description:
            'Selecciona el plan LOBO, FÉNIX o LEÓN según lo que necesites.',
        icon: 'select-plan',
        action: {
            label: 'COMIENZA AHORA',
            href: '#planes',
        },
    },
    {
        id: 'step-2',
        step: 2,
        title: 'Llena el formulario.',
        description:
            'Llena los campos solicitados con los datos que necesitamos, luego realiza el pago vía webpay.',
        icon: 'fill-form',
    },
    {
        id: 'step-3',
        step: 3,
        title: 'Revisa tu contrato.',
        description:
            'Luego del pago, podrás visualizar el borrador de contrato y firmarlo para finalizar el proceso.',
        icon: 'review-contract',
    },
];

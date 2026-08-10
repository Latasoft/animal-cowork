export interface PatentManagementPageContent {
    eyebrow: string;
    title: string;

    description: string;
    serviceSectionTitle: string;
    serviceSectionDescription: string;
    legalNotice: string;
    serviceName: string;
    servicePrice: string;
    municipalPaymentTitle: string;
    municipalPaymentAmount: string;
    municipalPaymentFrequency: string;
    municipalPaymentDetail: string;
    exclusiveNotice: string;
    image: {
        src: string | null;
        alt: string;
    };
    primaryAction: {
        label: string;
        href: string;
    };
    closingTitle: string;
    closingDescription: string;
}

// Replace this destination with the typed checkout route when payment is implemented.
const patentCheckoutHref = '#';

export const patentManagementContent: PatentManagementPageContent = {
    eyebrow: 'Servicio para clientes Animal Co-work',
    title: 'SERVICIO DE GESTIÓN DE PATENTE COMERCIAL DE OFICINA VIRTUAL',
    description:
        'Animal Coworking, a través de este servicio, gestiona todo lo que necesitas para poder obtener la aprobación de tu patente comercial de oficina virtual desde la Municipalidad de Providencia.',
    serviceSectionTitle: '¿Qué gestionamos?',
    serviceSectionDescription:
        'Gestionamos el proceso necesario para solicitar la aprobación de tu patente comercial de oficina virtual ante la Municipalidad de Providencia.',
    legalNotice:
        'Solicitar la patente comercial es una OBLIGACIÓN LEGAL para todo tipo de giro comercial, por tanto es sumamente importante que lo consideres dentro de la planificación económica de tu empresa.',
    serviceName: 'Gestión de Patente Comercial',
    servicePrice: '$50.000',
    municipalPaymentTitle: 'Por derecho de aseo',
    municipalPaymentAmount: '$35.000 aprox.',
    municipalPaymentFrequency: 'por semestre',
    municipalPaymentDetail:
        'Considera que el pago de tu patente de OFICINA VIRTUAL es libre de cobro por derecho de aseo y el valor es de $35.000 ( aprox.) semestrales que se paga dos veces al año , hasta el 31 de enero (primer periodo) y luego hasta el 31 de julio (segundo periodo). Este pago se realiza directamente a la municipalidad una vez aprobada tu patente luego de la solicitud inicial.',

    exclusiveNotice: 'Valores exclusivos clientes Animal Coworking.',
    image: {
        src: null,
        alt: 'Gestión de patente comercial de oficina virtual',
    },
    primaryAction: {
        label: 'CONTRATAR',
        href: patentCheckoutHref,
    },
    closingTitle: 'Gestiona tu patente comercial con Animal Co-work',
    closingDescription:
        'Nos encargamos de gestionar el proceso para que puedas solicitar la aprobación de tu patente comercial de oficina virtual.',
};

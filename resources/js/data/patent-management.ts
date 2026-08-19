export interface PatentManagementPageContent {
    eyebrow: string;
    title: string;
    description: string;
    serviceSectionTitle: string;
    serviceSectionDescription: string;
    legalNotice: string;
    servicePrice: string;
    municipalPaymentDetail: string;
    exclusiveNotice: string;
    primaryAction: {
        label: string;
        href: string;
    };
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

    servicePrice: '$50.000',

    municipalPaymentDetail:
        'Considera que el pago de tu patente de OFICINA VIRTUAL es libre de cobro por derecho de aseo y el valor es de $35.000 (aprox.) semestrales, que se paga dos veces al año: hasta el 31 de enero (primer periodo) y luego hasta el 31 de julio (segundo periodo). Este pago se realiza directamente a la municipalidad una vez aprobada tu patente luego de la solicitud inicial.',

    exclusiveNotice:
        'Valores exclusivos clientes Animal Coworking.',

    primaryAction: {
        label: 'CONTRATAR',
        href: patentCheckoutHref,
    },
};

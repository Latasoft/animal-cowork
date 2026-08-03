import type { FaqItem } from '@/types/faq';

export const faqItems: FaqItem[] = [
    {
        id: 'direccion-tributaria-sii',
        question:
            '¿La dirección tributaria es válida ante el Servicio de Impuestos Internos (SII)?',
        answer: 'Sí. Nuestra dirección puede utilizarse para acreditar el domicilio tributario de tu empresa ante el Servicio de Impuestos Internos, según los antecedentes y requisitos aplicables a tu actividad.',
    },
    {
        id: 'contratacion-online',
        question: '¿Cómo se realiza la contratación de la oficina virtual?',
        answer: 'El proceso se realiza 100% online. Debes seleccionar un plan, completar el formulario con tus datos, realizar el pago, revisar el contrato y firmarlo mediante Firma Electrónica Avanzada.',
    },
    {
        id: 'correspondencia-documentos',
        question:
            '¿Qué sucede con los documentos y la correspondencia que reciban a mi nombre?',
        answer: 'Nuestro equipo recibe tus documentos y correspondencia en la dirección contratada. También podrás acceder al servicio de escaneo y coordinar el retiro de la documentación según las condiciones de tu plan.',
    },
    {
        id: 'renovacion-contrato',
        question: '¿Cómo puedo renovar mi contrato de oficina virtual?',
        answer: 'Puedes renovar tu contrato directamente desde la sección de renovación del sitio. El proceso está diseñado para ser rápido y mantener activo tu servicio sin interrupciones.',
    },
];

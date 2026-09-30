import { Head } from '@inertiajs/react';

import { Footer } from '@/components/layout/footer';
import { Container } from '@/components/ui/container';
import { PublicLayout } from '@/layouts/public-layout';

interface LegalSection {
    title: string;
    paragraphs: string[];
}

const sections: LegalSection[] = [
    {
        title: '1. Responsable del tratamiento',
        paragraphs: [
            'ANIMAL COWORKING GROUP, RUT 77.188.172-6, con domicilio en Eulogia Sánchez N.º 065, Providencia, Santiago, Chile, es responsable del tratamiento de los datos personales que recopila directamente en sus canales y servicios, dentro del alcance que determine la legislación aplicable.',
        ],
    },
    {
        title: '2. Alcance',
        paragraphs: [
            'Esta Política se aplica a datos entregados mediante el sitio web, formularios, correo electrónico, WhatsApp, procesos de contratación, firma electrónica, atención de clientes y otros canales administrados por Animal Coworking.',
        ],
    },
    {
        title: '3. Datos que pueden recopilarse',
        paragraphs: [
            'Según la relación con el cliente, pueden recopilarse nombre, RUT, copia de documento de identidad, domicilio, correo, teléfono, datos de empresa, representante legal, antecedentes societarios, información de contratación, pagos y comunicaciones necesarias para prestar el servicio.',
        ],
    },
    {
        title: '4. Finalidades',
        paragraphs: [
            'Los datos podrán tratarse para gestionar solicitudes y contrataciones; validar identidad; preparar y administrar contratos; prestar oficina virtual y servicios asociados; gestionar pagos; coordinar firma electrónica; administrar correspondencia; atender consultas y reclamos; cumplir obligaciones legales; prevenir fraude y abusos; mantener seguridad; y realizar comunicaciones comerciales cuando exista base legal o autorización cuando corresponda.',
        ],
    },
    {
        title: '5. Base jurídica',
        paragraphs: [
            'Animal Coworking tratará datos únicamente cuando exista una base jurídica que lo permita, como ejecución de un contrato, cumplimiento de obligaciones legales, consentimiento cuando sea requerido u otra base reconocida por la normativa aplicable.',
        ],
    },
    {
        title: '6. Conservación',
        paragraphs: [
            'Los datos se conservarán durante el tiempo necesario para cumplir las finalidades informadas y, cuando corresponda, durante los plazos exigidos por obligaciones legales, contables, tributarias, contractuales o para atender eventuales responsabilidades.',
        ],
    },
    {
        title: '7. Proveedores y terceros',
        paragraphs: [
            'Podrán acceder a datos proveedores que presten servicios necesarios para la operación, como plataformas de pago, firma electrónica, alojamiento tecnológico, comunicaciones u otros. Se procurará limitar el acceso a lo necesario y exigir medidas adecuadas de protección conforme a la legislación aplicable.',
        ],
    },
    {
        title: '8. Transferencias y comunicaciones',
        paragraphs: [
            'Los datos podrán ser comunicados a autoridades competentes cuando exista obligación o facultad legal, y a terceros cuando sea necesario para ejecutar el servicio contratado o exista otra base jurídica válida.',
        ],
    },
    {
        title: '9. Seguridad',
        paragraphs: [
            'Animal Coworking adoptará medidas técnicas y organizativas razonables para proteger los datos frente a acceso, pérdida, alteración, uso o divulgación no autorizados, considerando la naturaleza de la información y los riesgos del tratamiento.',
        ],
    },
    {
        title: '10. Derechos de los titulares',
        paragraphs: [
            'Las personas podrán ejercer los derechos que reconozca la legislación aplicable respecto de sus datos personales, mediante los canales de contacto de Animal Coworking. Las solicitudes serán atendidas conforme a los requisitos y plazos legales vigentes.',
        ],
    },
    {
        title: '11. Cookies y tecnologías similares',
        paragraphs: [
            'El sitio web podrá utilizar cookies o tecnologías similares para funciones técnicas, seguridad, medición y, cuando corresponda, personalización o marketing. Cuando la legislación exija consentimiento, este será solicitado mediante los mecanismos correspondientes.',
        ],
    },
    {
        title: '12. Menores de edad',
        paragraphs: [
            'Los servicios de Animal Coworking están dirigidos a personas con capacidad legal para contratar. No se busca recopilar deliberadamente datos de menores para fines incompatibles con la legislación aplicable.',
        ],
    },
    {
        title: '13. Comunicaciones comerciales',
        paragraphs: [
            'Las comunicaciones promocionales se realizarán conforme a la normativa aplicable. El destinatario podrá ejercer los mecanismos de oposición o baja que correspondan.',
        ],
    },
    {
        title: '14. Cambios de política',
        paragraphs: [
            'Esta Política podrá actualizarse por cambios legales, regulatorios, tecnológicos o en los servicios. La versión vigente será publicada en el sitio web.',
        ],
    },
    {
        title: '15. Ley 21.719',
        paragraphs: [
            'Animal Coworking revisará y adecuará sus procedimientos, contratos, mecanismos de consentimiento, gestión de derechos, seguridad y demás procesos a la Ley N.º 21.719 y sus normas complementarias desde las fechas en que resulten exigibles.',
        ],
    },
    {
        title: '16. Contacto',
        paragraphs: [
            'Para consultas sobre privacidad y tratamiento de datos: privacidaddedatos@animalcoworking.cl. Domicilio: Eulogia Sánchez N.º 065, Providencia, Santiago, Chile. Teléfono/WhatsApp: +56 9 9055 6983.',
        ],
    },
    {
        title: '17. Vigencia',
        paragraphs: [
            'Esta Política entra en vigencia desde su publicación y reemplaza versiones anteriores sobre la misma materia.',
        ],
    },
];

export default function PoliticaDePrivacidad() {
    return (
        <PublicLayout>
            <Head title="Política de Privacidad" />

            <section className="bg-deep-blue py-12 sm:py-16">
                <Container>
                    <header className="mx-auto max-w-3xl text-center">
                        <p className="text-sm font-extrabold tracking-[0.16em] text-instinct uppercase">
                            Documento institucional
                        </p>
                        <h1 className="mt-3 text-4xl leading-[1.05] font-extrabold tracking-[-0.04em] text-white sm:text-5xl">
                            Política de Privacidad y Tratamiento de Datos
                            Personales
                        </h1>
                        <p className="mt-5 text-base leading-7 text-white/75 sm:text-lg">
                            Última actualización: septiembre de 2026
                        </p>
                    </header>
                </Container>
            </section>

            <section className="bg-white py-12 sm:py-16">
                <Container>
                    <div className="mx-auto max-w-3xl">
                        <div className="rounded-2xl border border-deep-blue/10 bg-background p-6 text-sm leading-6 text-deep-blue/80">
                            <p className="font-bold text-deep-blue">
                                ANIMAL COWORKING GROUP
                            </p>
                            <p>RUT 77.188.172-6</p>
                            <p>
                                Eulogia Sánchez N.º 065, Providencia, Santiago,
                                Chile
                            </p>
                            <p>
                                privacidaddedatos@animalcoworking.cl | +56 9
                                9055 6983
                            </p>
                        </div>

                        {sections.map((section) => (
                            <article key={section.title} className="mt-10">
                                <h2 className="text-xl font-extrabold tracking-[-0.02em] text-deep-blue sm:text-2xl">
                                    {section.title}
                                </h2>
                                {section.paragraphs.map((paragraph, index) => (
                                    <p
                                        key={index}
                                        className="mt-4 text-base leading-7 text-deep-blue/80"
                                    >
                                        {paragraph}
                                    </p>
                                ))}
                            </article>
                        ))}
                    </div>
                </Container>
            </section>

            <Footer />
        </PublicLayout>
    );
}

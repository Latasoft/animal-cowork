import { Head } from '@inertiajs/react';

import { Footer } from '@/components/layout/footer';
import { Container } from '@/components/ui/container';
import { PublicLayout } from '@/layouts/public-layout';

type Segment = string | { bold: string };

interface LegalSection {
    title: string;
    paragraphs: Segment[][];
}

const sections: LegalSection[] = [
    {
        title: '1. Identificación del proveedor',
        paragraphs: [
            [
                'Los presentes Términos y Condiciones regulan la contratación y utilización de los servicios ofrecidos por ANIMAL COWORKING GROUP, RUT 77.188.172-6, con domicilio en Eulogia Sánchez N.º 065, Providencia, Región Metropolitana, Chile, en adelante “Animal Coworking”, “la empresa” o “el proveedor”.',
            ],
            [
                'Correo: oficinavirtual@animalcoworking.cl | Teléfono/WhatsApp: +56 9 9055 6983 | Sitio web: animalcoworking.cl',
            ],
        ],
    },
    {
        title: '2. Objeto',
        paragraphs: [
            [
                'Estos Términos y Condiciones establecen las reglas aplicables a contratación, pago, prestación, renovación, suspensión y término de los servicios publicados por Animal Coworking. Entre ellos pueden encontrarse oficina virtual, domicilio tributario, dirección comercial, recepción de correspondencia, uso de salas de reuniones y gestión de patente, según el plan contratado.',
            ],
        ],
    },
    {
        title: '3. Contratación',
        paragraphs: [
            [
                'La contratación podrá realizarse mediante los mecanismos habilitados en el sitio web, incluyendo pagos online y otros medios de pago disponibles. El proceso puede contemplar selección del plan, entrega de antecedentes, pago, validación, revisión y firma electrónica del contrato. La contratación se perfeccionará conforme al mecanismo informado y una vez cumplidos los requisitos necesarios para activar el servicio.',
            ],
        ],
    },
    {
        title: '4. Información y documentación del cliente',
        paragraphs: [
            [
                'El cliente deberá proporcionar información verdadera, completa, vigente y verificable. Según el servicio, podrá solicitarse identificación del representante legal, RUT, domicilio, razón social, RUT de empresa, correo, celular, estatuto o escritura y otros antecedentes necesarios.',
            ],
        ],
    },
    {
        title: '5. Oficina virtual y domicilio tributario',
        paragraphs: [
            [
                'Cuando se contrate una Oficina Virtual, Animal Coworking prestará las prestaciones expresamente incluidas en el plan. La utilización de la dirección como domicilio tributario o comercial estará sujeta a la normativa aplicable y a la compatibilidad del giro. La aprobación final por parte del SII u otra autoridad corresponde exclusivamente a dicha autoridad.',
            ],
        ],
    },
    {
        title: '6. Compatibilidad del giro',
        paragraphs: [
            [
                'El cliente debe verificar previamente que su actividad y giro sean compatibles con oficina virtual y con la dirección contratada. La información de Animal Coworking no constituye asesoría tributaria, contable ni jurídica, salvo que un servicio específico indique expresamente lo contrario.',
            ],
        ],
    },
    {
        title: '7. Gestión de patente comercial',
        paragraphs: [
            [
                'Cuando el plan incluya gestión de patente, Animal Coworking realizará todas las gestiones comprendidas en el servicio. La contratación no garantiza aprobación, monto, plazo o resultado, pues esas decisiones corresponden a la Municipalidad y/o autoridad competente.',
            ],
        ],
    },
    {
        title: '8. Inicio de actividades y obligaciones tributarias',
        paragraphs: [
            [
                'Salvo indicación expresa, la oficina virtual no incluye asesoría de inicio de actividades, declaraciones tributarias ni cumplimiento contable. El cliente es responsable de sus obligaciones ante el SII y demás autoridades.',
            ],
        ],
    },
    {
        title: '9. Recepción de correspondencia y documentos',
        paragraphs: [
            [
                'La recepción de correspondencia y documentos es un servicio adicional y no forma parte del servicio principal de dirección tributaria, salvo que el contrato o plan contratado indique expresamente lo contrario.',
            ],
            [
                'Cuando este servicio se encuentre contratado, Animal Coworking contará con un protocolo de aviso de hasta 72 horas desde la recepción efectiva de documentos considerados prioritarios, tales como citaciones del Juzgado de Policía Local, Municipalidades, Servicio de Impuestos Internos (SII), Tesorería General de la República (TGR), Inspección del Trabajo u otras autoridades o entidades relevantes.',
            ],
            [
                'Este plazo se aplicará únicamente respecto de documentación efectivamente recibida por Animal Coworking. La empresa no será responsable por notificaciones que una autoridad o tercero declare haber intentado realizar y que no hayan sido efectivamente recibidas en sus dependencias.',
            ],
            [
                'La recepción y aviso de correspondencia no reemplaza la obligación del cliente de revisar directamente su situación ante el SII, TGR, Municipalidad, Inspección del Trabajo y demás organismos correspondientes, incluyendo sus obligaciones tributarias, municipales, laborales, pago de patentes, acreditación de domicilio y cualquier otro trámite o plazo aplicable.',
            ],
            [
                'El cliente será siempre responsable de mantenerse informado y cumplir oportunamente sus obligaciones como contribuyente. La contratación de una dirección tributaria o del servicio de recepción de correspondencia no transfiere dichas obligaciones a Animal Coworking.',
            ],
        ],
    },
    {
        title: '10. Salas de reuniones',
        paragraphs: [
            [
                'Las horas incluidas en cada plan estarán sujetas a disponibilidad y reglas de reserva. Las horas adicionales se cobrarán según las tarifas vigentes. El cliente responderá por daños ocasionados por él, sus trabajadores o invitados cuando corresponda.',
            ],
        ],
    },
    {
        title: '11. Precios',
        paragraphs: [
            [
                'Los precios serán los publicados al momento de la contratación. Las promociones tendrán la vigencia y condiciones informadas. Animal Coworking podrá modificar precios para futuras contrataciones sin afectar, por sí sola, las condiciones económicas de servicios ya contratados durante su vigencia.',
            ],
        ],
    },
    {
        title: '12. Medios de pago',
        paragraphs: [
            [
                'Podrán utilizarse transferencia, Webpay u otros medios habilitados. Los pagos efectuados mediante terceros estarán sujetos a sus procesos. La activación podrá quedar condicionada a la validación efectiva del pago.',
            ],
        ],
    },
    {
        title: '13. Activación',
        paragraphs: [
            [
                'El plazo de activación dependerá del servicio y de la recepción correcta de antecedentes. Cuando exista validación de identidad, firma o revisión documental, el plazo comenzará cuando se cuente con la información necesaria.',
            ],
        ],
    },
    {
        title: '14. Contratos y firma electrónica',
        paragraphs: [
            [
                'Cuando el servicio requiera contrato, este se suscribirá mediante firma electronica, para ello el cliente debe contar con clave unica y su cedula vigente, El contrato específico forma parte de la relación contractual. Si existiera contradicción con estos Términos, prevalecerán sus condiciones particulares respecto de la materia específica.',
            ],
        ],
    },
    {
        title: '15. Duración y renovación',
        paragraphs: [
            [
                'La duración será la informada en el plan contratado. Las renovaciones estarán sujetas a los precios y condiciones vigentes al momento de renovar.',
            ],
        ],
    },
    {
        title: '16. Suspensión y término',
        paragraphs: [
            [
                'Animal Coworking podrá suspender o terminar servicios en casos de incumplimiento, falta de pago cuando corresponda, información falsa, uso ilícito o conductas que afecten gravemente la seguridad o derechos de Tercero, así como también cualquier notificación de receptores judiciales por liquidaciones debido a deudas de la empresa . Se respetarán los derechos que correspondan conforme a la legislación vigente.',
            ],
        ],
    },
    {
        title: '17. Devoluciones, cancelaciones y formalización del contrato',
        paragraphs: [
            [
                'Las solicitudes de devolución de dinero podrán efectuarse únicamente antes de la formalización y firma del contrato correspondiente.',
            ],
            [
                'En caso de que el cliente solicite la devolución antes de la firma del contrato, Animal Coworking podrá efectuar una retención de entre un 10% y un 20% del monto pagado, dependiendo de las circunstancias particulares del caso, por concepto de costos administrativos, procesamiento del pago, revisión de antecedentes, preparación y gestión documental y demás gestiones efectuadas con motivo de la contratación.',
            ],
            [
                'Una vez que el contrato haya sido redactado, aceptado y firmado por ambas partes, se entenderá que la contratación ha sido formalmente perfeccionada y que el cliente ha aceptado las condiciones particulares del servicio contratado.',
            ],
            [
                'El contrato firmado por Animal Coworking y el cliente constituirá el respaldo documental de la contratación, estableciendo las condiciones, obligaciones, duración, prestaciones y demás elementos correspondientes al servicio contratado. El cliente recibirá una copia del contrato debidamente suscrito por ambas partes.',
            ],
            [
                'En consecuencia, ',
                {
                    bold: 'una vez firmado el contrato por ambas partes, no procederá la devolución del monto pagado por concepto del servicio contratado',
                },
                ', puesto que la contratación ya se encontrará formalizada y el servicio habrá quedado contratado conforme a las condiciones establecidas en el respectivo instrumento contractual.',
            ],
            [
                'Asimismo, en aquellos casos en que la contratación se realice por medios electrónicos o a distancia y la legislación permita al proveedor excluir el derecho de retracto, Animal Coworking declara expresamente su decisión de excluir dicho derecho, circunstancia que será informada al cliente de manera previa, clara, destacada y comprensible, antes de la celebración del contrato y/o del pago, conforme a la legislación vigente.',
            ],
            [
                'La firma del contrato implica que el cliente declara haber tenido la oportunidad de revisar sus condiciones, conocer las características y alcance del servicio contratado y aceptar voluntariamente las obligaciones derivadas de la contratación.',
            ],
            [
                'Lo anterior se establece sin perjuicio de aquellos derechos que la legislación vigente reconozca al consumidor y que tengan carácter irrenunciable, ni de las obligaciones legales que correspondan a Animal Coworking respecto de la correcta prestación del servicio contratado.',
            ],
        ],
    },
    {
        title: '18. Responsabilidad',
        paragraphs: [
            [
                'Animal Coworking responderá por la correcta prestación de los servicios contratados dentro de su alcance. No será responsable por decisiones de autoridades, antecedentes incorrectos del cliente o hechos atribuibles exclusivamente a terceros, sin perjuicio de las responsabilidades legales que correspondan.',
            ],
        ],
    },
    {
        title: '19. Usos prohibidos',
        paragraphs: [
            [
                'No podrán utilizarse los servicios para actividades ilícitas, fraudulentas, engañosas, contrarias a la normativa o que pongan en riesgo a trabajadores, clientes o terceros.',
            ],
        ],
    },
    {
        title: '20. Datos personales',
        paragraphs: [
            [
                'El tratamiento de datos personales se realizará conforme a la legislación aplicable y a la Política de Privacidad de Animal Coworking. Los datos podrán utilizarse para gestionar la contratación, prestación, seguridad, pagos, firma electrónica, cumplimiento legal y otros fines amparados por una base jurídica. La empresa adecuará sus procedimientos a la Ley N.º 21.719 cuando corresponda.',
            ],
        ],
    },
    {
        title: '21. Comunicaciones',
        paragraphs: [
            [
                'El cliente autoriza comunicaciones relacionadas con contratación, pagos, documentos, firma, activación, renovaciones, correspondencia y atención del servicio. Las comunicaciones comerciales se sujetarán a la legislación aplicable.',
            ],
        ],
    },
    {
        title: '22. Modificaciones',
        paragraphs: [
            [
                'Animal Coworking podrá actualizar estos Términos y Condiciones cuando sea necesario por cambios en sus servicios, procesos, tecnología, normativa o estructura operativa.',
            ],
            [
                'En caso de que se produzcan cambios que impliquen una modificación de las condiciones, dirección o forma de prestación de los servicios contratados, Animal Coworking informará oportunamente a los clientes afectados y comunicará las alternativas disponibles para la continuidad del servicio o, cuando corresponda, su término.',
            ],
            [
                'Cuando una modificación requiera la actualización o suscripción de nuevos contratos o antecedentes, el cliente podrá optar por continuar con Animal Coworking bajo las nuevas condiciones informadas o poner término al servicio conforme al procedimiento comunicado por la empresa.',
            ],
            [
                'Las modificaciones respetarán los derechos que legalmente correspondan y la versión vigente de estos Términos estará disponible en el sitio web.',
            ],
        ],
    },
    {
        title: '23. Propiedad intelectual',
        paragraphs: [
            [
                'Los contenidos, marcas, textos, imágenes, diseños y demás elementos del sitio pertenecen a Animal Coworking o sus respectivos titulares y no podrán utilizarse sin autorización cuando esta sea necesaria.',
            ],
        ],
    },
    {
        title: '24. Sitio web',
        paragraphs: [
            [
                'El sitio podrá presentar interrupciones por mantenimiento, actualizaciones, proveedores, conectividad, fuerza mayor u otras causas. Ello no implica necesariamente interrupción de servicios ya contratados.',
            ],
        ],
    },
    {
        title: '25. Servicios de terceros',
        paragraphs: [
            [
                'Procesos como pagos, firma electrónica u otros pueden involucrar proveedores externos y estar sujetos a sus condiciones. Animal Coworking responderá dentro del alcance que corresponda legalmente.',
            ],
        ],
    },
    {
        title: '26. Consultas y reclamos',
        paragraphs: [
            [
                'Las consultas o reclamos podrán dirigirse a oficinavirtual@animalcoworking.cl. El cliente conserva sus derechos para acudir directamente a las autoridades o tribunales competentes cuando la ley lo permita.',
            ],
        ],
    },
    {
        title: '27. Legislación aplicable',
        paragraphs: [
            [
                'Estos Términos se regirán por las leyes de la República de Chile, incluyendo la normativa de protección al consumidor, contratación electrónica, protección de datos y demás normas aplicables.',
            ],
        ],
    },
    {
        title: '28. Aceptación',
        paragraphs: [
            [
                'Al contratar, el cliente declara haber podido acceder y revisar estos Términos, comprender el servicio seleccionado y proporcionar información verdadera. La aceptación no implica renuncia a derechos legales.',
            ],
        ],
    },
    {
        title: '29. Vigencia',
        paragraphs: [
            [
                'Estos Términos rigen desde su publicación y reemplazan versiones anteriores sobre la misma materia, sin perjuicio de condiciones particulares de contratos vigentes.',
            ],
        ],
    },
];

export default function TerminosYCondiciones() {
    return (
        <PublicLayout>
            <Head title="Términos y Condiciones" />

            <section className="bg-deep-blue py-12 sm:py-16">
                <Container>
                    <header className="mx-auto max-w-3xl text-center">
                        <p className="text-sm font-extrabold tracking-[0.16em] text-instinct uppercase">
                            Documento institucional
                        </p>
                        <h1 className="mt-3 text-4xl leading-[1.05] font-extrabold tracking-[-0.04em] text-white sm:text-5xl">
                            Términos y Condiciones
                        </h1>
                        <p className="mt-5 text-base leading-7 text-white/75 sm:text-lg">
                            Contratación y utilización de los servicios de
                            Animal Coworking
                        </p>
                    </header>
                </Container>
            </section>

            <section className="bg-white py-12 sm:py-16">
                <Container>
                    <div className="mx-auto max-w-3xl">
                        <div className="rounded-2xl border border-deep-blue/10 bg-background p-6 text-sm leading-6 text-deep-blue/80">
                            <p className="font-bold text-deep-blue">
                                ANIMAL COWORKING GROUP SpA
                            </p>
                            <p>RUT 77.188.172-6</p>
                            <p>
                                Eulogia Sánchez N.º 065, Providencia, Región
                                Metropolitana, Chile
                            </p>
                            <p>
                                oficinavirtual@animalcoworking.cl | +56 9 9055
                                6983 | animalcoworking.cl
                            </p>
                        </div>

                        {sections.map((section) => (
                            <article key={section.title} className="mt-10">
                                <h2 className="text-xl font-extrabold tracking-[-0.02em] text-deep-blue sm:text-2xl">
                                    {section.title}
                                </h2>
                                {section.paragraphs.map((segments, index) => (
                                    <p
                                        key={index}
                                        className="mt-4 text-base leading-7 text-deep-blue/80"
                                    >
                                        {segments.map((segment, segmentIndex) =>
                                            typeof segment === 'string' ? (
                                                <span key={segmentIndex}>
                                                    {segment}
                                                </span>
                                            ) : (
                                                <strong
                                                    key={segmentIndex}
                                                    className="font-bold text-deep-blue"
                                                >
                                                    {segment.bold}
                                                </strong>
                                            ),
                                        )}
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

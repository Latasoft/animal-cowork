import { formatClp } from '@/data/plans';
import { formatContractDate } from '@/lib/contract-dates';

import type { ContractGenerationData } from '@/types/checkout';
import type { Plan } from '@/types/plan';
import type {
    ContractClause,
    ContractContent,
    ContractLogoSource,
} from './contract-pdf-layout';
import { ContractPdfLayout } from './contract-pdf-layout';

interface LegalEntityContractPdfProps {
    data: ContractGenerationData;
    plan: Plan;
    logoSource: ContractLogoSource;
}

function uppercase(value: string): string {
    return value.trim().toLocaleUpperCase('es-CL');
}

export function LegalEntityContractPdf({
    data,
    plan,
    logoSource,
}: LegalEntityContractPdfProps) {
    const content = getLegalEntityContractContent(data, plan);

    return <ContractPdfLayout {...content} logoSource={logoSource} />;
}

export function getLegalEntityContractContent(
    data: ContractGenerationData,
    plan: Plan,
): ContractContent {
    const introduction = `En Santiago de Chile, ${formatContractDate(data.contract_date)}, entre don CRISTÓBAL VICENTE FIORI-LEGGERO VISLYON, chileno, soltero, cédula nacional de identidad N°16.660.000-6, en representación de ANIMAL COWORKING GROUP SpA, persona jurídica del giro de su denominación, rol único tributario número 77.188.172-6, ambos domiciliados en calle EULOGIA SANCHEZ # 065, comuna de Providencia, ciudad de Santiago, por una parte y como el “Sub-Arrendador”; y por la otra y como el “Sub-Arrendatario”: ${uppercase(data.company_name)}, persona jurídica con rol único tributario número: ${uppercase(data.company_rut)}, representada según se acreditará por: ${uppercase(data.representative_name)}, cédula nacional de identidad N° ${uppercase(data.representative_rut)} con domicilio ${uppercase(data.representative_address)}, comuna de ${uppercase(data.representative_commune)}, Región ${uppercase(data.representative_region)}, ambos comparecientes mayores de edad, quienes acreditan su identidad con las cédulas antes indicadas, exponen que vienen libre y voluntariamente en celebrar el siguiente contrato de Sub-arrendamiento:`;

    const clauses: ContractClause[] = [
        {
            heading: 'PRIMERO.',
            paragraphs: [
                'ANIMAL COWORKING GROUP SpA es arrendatario del inmueble ubicado en calle EULOGIA SANCHEZ #065, ROL 00854-004, Rut Dueño usufructo 8.815.663-3, comuna de providencia, ciudad de Santiago y tiene la facultad de subarrendar el inmueble. En virtud del presente contrato el Sub-Arrendador entrega en sub-arrendamiento la propiedad ubicada en calle EULOGIA SANCHEZ #065, comuna de PROVIDENCIA, ciudad de Santiago, en las condiciones que expresan las cláusulas del presente contrato.',
            ],
        },
        {
            heading: 'SEGUNDO. Uso del Inmueble:',
            paragraphs: [
                'El inmueble individualizado en la cláusula anterior sólo podrá ser usado como OFICINA VIRTUAL, lo que implica el solo uso del domicilio con fines tributarios ante el SII, domicilio comercial ante la Ilustre Municipalidad de Providencia y domicilio válido para recepción de correspondencia. De esta manera la actividad comercial de la empresa no se desarrolla en el domicilio objeto del presente contrato.',
            ],
        },
        {
            heading: 'TERCERO. Plazo:',
            paragraphs: [
                `El presente contrato de sub-arrendamiento es de plazo fijo y regirá desde el día ${formatContractDate(data.contract_start_date)} y hasta el día ${formatContractDate(data.contract_end_date)}. Sin perjuicio de lo anterior, si las partes nada expresaren conforme a lo que se indica seguidamente, el contrato se renovará automáticamente por períodos ${plan.contractDurationMonths} meses de la fecha de expiración que corresponda. Por el contrario, no habrá lugar a la renovación automática anterior si cualquiera de las partes avisare a la otra de su voluntad de no renovar el contrato, con la documentación pertinente requerida, de modo que, en este evento, el contrato expirará a la fecha de vencimiento próximo.`,
                'El aviso deberá ser enviado por el sub-Arrendador al sub-Arrendatario, o por el sub-Arrendatario al sub-Arrendador, según corresponda, por el medio más expedito posible, con una anticipación mínima de 30 días de cualquiera de sus periodos de Pago, la fecha de vencimiento original o cualquiera de sus renovaciones si las hubiere. Verificado el aviso, el subarrendatario estará obligado a realizar el cambio de domicilio correspondiente en el servicio de impuestos internos y la patente comercial en la Ilustre Municipalidad de Providencia asociada a su razón social, hasta antes del día de término del arriendo.',
                'Si el sub-arrendatario no realiza el cambio de domicilio tributario y de patente comercial dentro del plazo señalado, ello dará derecho al sub-arrendador para continuar cobrando el monto de arriendo inicialmente pactado, hasta la regularización efectiva de dicha obligación.',
                'Asimismo, respecto de las sumas adeudadas, se aplicará lo dispuesto en la cláusula QUINTA del presente contrato en materia de mora, intereses y gastos asociados.',
            ],
        },
        {
            heading: 'CUARTO. Prohibiciones del Arrendatario:',
            paragraphs: [
                'Queda prohibido al sub-Arrendatario SUBARRENDAR, CEDER o TRANSFERIR, a cualquier título el presente contrato.',
            ],
        },
        {
            heading: 'QUINTO. Renta:',
            paragraphs: [
                `La renta de arrendamiento será de ${formatClp(plan.priceOffice)}.-, cantidad que se pagará cada ${plan.contractDurationMonths} meses. Esta renta se pagará por anticipado, antes de la fecha de cada periodo de vencimiento mediante un depósito en:`,
                'CUENTA CORRIENTE N° 0-000-8438383-0\nBANCO SANTANDER.\nNOMBRE: ANIMAL COWORKING GROUP\nRUT: 77.188.172-6',
                'En Su defecto el lugar de pago es calle EULOGIA SANCHEZ #065, comuna de Providencia. Si la renta de arrendamiento no se pagare dentro de los días indicados, se considerará como incumplimiento de contrato por parte del sub-Arrendatario y dará derecho al sub-Arrendador a poner término al mismo.',
                'En caso de mora o simple retardo en el pago de la renta, el Sub-Arrendatario deberá pagar, además de la suma adeudada, un interés por mora equivalente al 0,04% diario sobre el monto impago, calculado desde la fecha de vencimiento hasta el pago efectivo.',
                'Asimismo, se aplicará un cargo fijo único de $5.000 por concepto de gastos administrativos razonables derivados de la gestión de cobranza y regularización del pago.',
                'Las partes dejan constancia que los cobros señalados precedentemente se ajustan a la normativa vigente, en particular a la Ley N° 18.010, no constituyendo en caso alguno usura ni excediendo el interés máximo convencional.',
            ],
        },
        {
            heading: 'SEXTO. Causales de Término de Contrato de Arriendo.',
            paragraphs: [
                'El sub-arrendador, previa evaluación de las circunstancias, podrá poner término al contrato por las siguientes causales:',
                '1.- El no pago de la renta pactada.\n2.- La recepción de cualquier notificación judicial por acciones interpuestas en contra del sub-Arrendatario, ya sea de naturaleza civil, comercial, laboral, penal, tributaria, o de cualquier tipo. La sola recepción de la notificación dará derecho al sub-arrendador a poner término al contrato de arriendo de pleno derecho, sin perjuicio de que subsistirá la obligación de éste de avisar al arrendatario, por medio de correo electrónico, de la recepción de la notificación para su posterior retiro, no siendo responsable el sub-arrendador por las consecuencias lesivas que sufra el sub-arrendatario derivado del no retiro de la notificación recibida. La terminación del contrato se entiende sin perjuicio de que el sub-arrendador pueda perseguir las responsabilidades por los perjuicios que pueda sufrir.',
            ],
        },
        {
            heading: 'SEPTIMO. Cláusula sobre Morosidad del sub-Arrendatario:',
            paragraphs: [
                'Se autoriza expresamente al sub-arrendador, para que, en caso de incumplimiento, mora o simple retardo en el cumplimiento de las obligaciones a las que se sujeta el sub-arrendatario a través del presente contrato se publique en bases de datos la información comercial del sub-arrendatario. Lo anterior, es con el objeto de dar cumplimiento a la Ley Nº 19.628, Sobre Protección de Datos de Carácter Personal. Por tanto, el sub-Arrendatario faculta irrevocablemente al sub-Arrendador para que pueda dar a conocer la morosidad en el pago de las rentas de arrendamiento, proporcionando dicha información a cualquier registro o banco de datos personales con fines comerciales, relevando el sub-Arrendatario al sub-Arrendador de cualquier responsabilidad que se pueda derivar al efecto.',
            ],
        },
        {
            heading: 'OCTAVO. Moralidad:',
            paragraphs: [
                'El sub-Arrendatario garantiza que no ejercerá ninguno de los derechos otorgados conforme a este contrato para cualquier propósito obsceno, ilegal, inmoral o difamatorio. Así mismo, se compromete a no desacreditar al sub-Arrendador de manera alguna. El sub-Arrendatario no utilizará ni combinará de ninguna forma, total o parcialmente, el nombre ANIMAL COWORKING GROUP SpA para propósitos de actividades mercantiles. El sub-Arrendador se reserva el derecho de cooperar con las autoridades oficiales investigadoras, si así se le requiere, en relación con cualquier presunto acto deshonesto o que revista las características de delito del sub-Arrendatario.',
            ],
        },
        {
            heading: 'NOVENO. Jurisdicción:',
            paragraphs: [
                'Toda duda, dificultad, discrepancia o desavenencia que surja entre las Partes en relación con la interpretación, existencia, validez, aplicación, cumplimiento, incumplimiento, plazos o término del Contrato y de cualquiera de las estipulaciones del presente instrumento, o por cualquier otra causa que tuviere origen o vinculación con el mismo, será resuelta por los tribunales competentes.',
            ],
        },
        {
            heading: 'DÉCIMO. Dirección:',
            paragraphs: [
                'Para todos los efectos legales derivados del presente contrato, la partes fijan domicilio en la Región Metropolitana y se someten a la competencia de sus tribunales de justicia.',
                'En constancia de lo pactado, las Partes, suscriben el presente Contrato, mediante firma electrónica avanzada, según Ley 19.799 SOBRE DOCUMENTOS ELECTRONICOS, FIRMA ELECTRONICA Y SERVICIOS DE CERTIFICACION DE DICHA FIRMA, basados en su Artículo 3. Con E-cert Chile, entidad acreditada.',
            ],
        },
    ];

    return {
        introduction,
        clauses,
        subject: `Contrato persona jurídica - Plan ${plan.name}`,
    };
}

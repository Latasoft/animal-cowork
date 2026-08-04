import {
    CheckCircle2,
    FileText,
    Info,
} from 'lucide-react';


const signatureRequirements = [
    'Cédula de identidad chilena vigente.',
    'Residencia definitiva vigente, solo para personas extranjeras.',
    'ClaveÚnica activa para finalizar el proceso de firma.',
    'Un giro o actividad económica compatible con el servicio de oficina virtual.',
];


export function NoticeCard() {
    return (
        <aside className="mt-8 border-l-4 border-instinct bg-instinct/5 px-5 py-6 sm:px-7 sm:py-7">
            <div className="flex items-start gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-instinct text-white">
                    <Info
                        className="size-5"
                        strokeWidth={2.2}
                        aria-hidden
                    />
                </div>

                <div className="min-w-0">
                    <h2 className="text-xl font-extrabold tracking-[-0.025em] text-deep-blue">
                        Antes de continuar, ten presente lo siguiente
                    </h2>

                    <p className="mt-4 text-sm leading-7 text-deep-blue/75 sm:text-base">
                        Para completar el proceso de firma electrónica, el
                        representante legal debe contar con:
                    </p>

                    <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                        {signatureRequirements.map((requirement) => (
                            <li
                                key={requirement}
                                className="flex items-start gap-3 text-sm leading-6 text-deep-blue/75"
                            >
                                <CheckCircle2
                                    className="mt-0.5 size-5 shrink-0 text-instinct"
                                    strokeWidth={2.2}
                                    aria-hidden
                                />

                                <span>{requirement}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-6 border-t border-instinct/15 pt-5">
                        <p className="text-sm leading-7 text-deep-blue/75">
                            La firma electrónica avanzada será realizada por un
                            prestador de servicios de certificación conforme a
                            la Ley N.º 19.799 sobre Documentos Electrónicos,
                            Firma Electrónica y Servicios de Certificación.
                        </p>
                    </div>

                </div>
            </div>
        </aside>
    );
}

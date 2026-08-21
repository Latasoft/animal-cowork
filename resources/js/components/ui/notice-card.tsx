import {
    CheckCircle2,
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
        <aside className="mt-6 rounded-2xl border border-instinct/20 bg-instinct/5 p-5 sm:p-6">
            <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-instinct text-white">
                    <Info
                        className="size-4"
                        strokeWidth={2.2}
                        aria-hidden
                    />
                </div>

                <div className="min-w-0 flex-1">
                    <div>
                        <p className="text-xs font-extrabold tracking-[0.12em] text-instinct-dark uppercase">
                            Importante
                        </p>

                        <h2 className="mt-1 text-lg font-extrabold tracking-[-0.025em] text-deep-blue">
                            Antes de continuar
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-deep-blue/70">
                            Para completar la firma electrónica, el representante
                            legal debe contar con:
                        </p>
                    </div>

                    <ul className="mt-4 grid gap-x-5 gap-y-2 sm:grid-cols-2">
                        {signatureRequirements.map((requirement) => (
                            <li
                                key={requirement}
                                className="flex items-start gap-2 text-sm leading-5 text-deep-blue/75"
                            >
                                <CheckCircle2
                                    className="mt-0.5 size-4 shrink-0 text-instinct"
                                    strokeWidth={2.2}
                                    aria-hidden
                                />

                                <span>{requirement}</span>
                            </li>
                        ))}
                    </ul>

                    <p className="mt-4 border-t border-instinct/15 pt-4 text-xs leading-5 text-deep-blue/55">
                        La firma electrónica avanzada será realizada por un
                        prestador de servicios de certificación conforme a la
                        Ley N.º 19.799 sobre Documentos Electrónicos, Firma
                        Electrónica y Servicios de Certificación.
                    </p>
                </div>
            </div>
        </aside>
    );
}
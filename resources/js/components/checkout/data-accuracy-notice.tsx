import { TriangleAlert } from 'lucide-react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface DataAccuracyNoticeProps {
    open: boolean;
    onAccept: () => void;
}

/**
 * Aviso obligatorio antes de ingresar los datos del contrato:
 * los datos se usan tal cual en el contrato, así que deben coincidir
 * con la cédula de identidad y el estatuto de la empresa.
 */
export function DataAccuracyNotice({
    open,
    onAccept,
}: DataAccuracyNoticeProps) {
    useEffect(() => {
        if (!open) {
            return;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [open]);

    if (!open) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-deep-blue/60 px-4 py-6">
            <div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="data-accuracy-title"
                aria-describedby="data-accuracy-description"
                className="max-h-full w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-[0_24px_60px_rgba(13,27,61,0.35)] sm:p-8"
            >
                <div className="flex size-12 items-center justify-center rounded-full bg-instinct-light text-instinct-dark">
                    <TriangleAlert
                        className="size-6"
                        strokeWidth={2.2}
                        aria-hidden="true"
                    />
                </div>

                <h2
                    id="data-accuracy-title"
                    className="mt-5 text-2xl leading-tight font-extrabold tracking-[-0.03em] text-deep-blue"
                >
                    Antes de continuar, por favor lee con atención
                </h2>

                <div
                    id="data-accuracy-description"
                    className="mt-4 text-base leading-7 text-deep-blue/75"
                >
                    <p>
                        Los datos que ingreses se usarán exactamente igual en tu
                        contrato. Es por eso que te solicitamos:
                    </p>

                    <ul className="mt-3 list-disc space-y-2 pl-5">
                        <li>
                            Escribe tus{' '}
                            <strong className="text-deep-blue">
                                nombres y apellidos completos
                            </strong>
                            , exactamente como aparecen en tu{' '}
                            <strong className="text-deep-blue">
                                cédula de identidad
                            </strong>
                            .
                        </li>
                        <li>
                            Escribe la{' '}
                            <strong className="text-deep-blue">
                                razón social
                            </strong>{' '}
                            exactamente como aparece en el{' '}
                            <strong className="text-deep-blue">
                                estatuto de tu empresa
                            </strong>
                            .
                        </li>
                        <li>No abrevies ni omitas ningún dato.</li>
                    </ul>
                </div>

                <Button
                    autoFocus
                    onClick={onAccept}
                    className="mt-7 h-12 w-full justify-center px-7"
                >
                    Entendido
                </Button>
            </div>
        </div>
    );
}

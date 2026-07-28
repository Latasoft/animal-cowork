import {
    BadgePercent,
    FileSignature,
    Presentation,
    ShieldCheck,
} from 'lucide-react';

import type { ReactNode } from 'react';

function TrustBar() {
    return (
        <div className="mt-10 grid gap-0 overflow-hidden rounded-3xl border border-deep-blue/10 bg-white shadow-card sm:grid-cols-2 lg:grid-cols-4">
            <TrustItem
                icon={
                    <ShieldCheck
                        className="size-5"
                        strokeWidth={2}
                        aria-hidden="true"
                    />
                }
                title="DIRECCIÓN TRIBUTARIA"
                description="Aceptado por el SII"
                theme="blue"
            />

            <TrustItem
                icon={
                    <FileSignature
                        className="size-5"
                        strokeWidth={2}
                        aria-hidden="true"
                    />
                }
                title="CONTRATO 100% ONLINE"
                description="Firma electrónica"
                theme="green"
            />

            <TrustItem
                icon={
                    <Presentation
                        className="size-5"
                        strokeWidth={2}
                        aria-hidden="true"
                    />
                }
                title="ACCESO A SALAS DE REUNIÓN"
                description="Incluido en todos los planes"
                theme="blue"
            />

            <TrustItem
                icon={
                    <BadgePercent
                        className="size-5"
                        strokeWidth={2}
                        aria-hidden="true"
                    />
                }
                title="DESCUENTOS EXCLUSIVOS"
                description="En horas adicionales"
                theme="green"
            />
        </div>
    );
}

interface TrustItemProps {
    icon: ReactNode;
    title: string;
    description: string;
    theme: 'blue' | 'green';
}

function TrustItem({
    icon,
    title,
    description,
    theme,
}: TrustItemProps) {
    const iconClass =
        theme === 'blue'
            ? 'bg-deep-blue text-white'
            : 'bg-instinct text-white';

    return (
        <div className="flex items-center gap-4 border-b border-deep-blue/10 px-4 py-5 last:border-b-0 sm:border-r sm:last:border-r-0 lg:border-b-0 lg:px-5">
            <div
                className={[
                    'flex size-12 shrink-0 items-center justify-center rounded-2xl',
                    iconClass,
                ].join(' ')}
            >
                {icon}
            </div>

            <div>
                <p className="text-xs font-extrabold tracking-[0.03em] text-deep-blue sm:text-[0.8rem]">
                    {title}
                </p>

                <p className="mt-1 text-[0.72rem] leading-4 text-energy-blue sm:text-xs">
                    {description}
                </p>
            </div>
        </div>
    );
}

export default TrustBar;
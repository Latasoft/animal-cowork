import { CheckCircle2, Maximize2 } from 'lucide-react';

import { ButtonArrow } from '@/components/ui/button';
import type { PrivateOffice } from '@/data/private-offices';
import { createWhatsappUrl } from '@/lib/whatsapp';

interface PrivateOfficeCardProps {
    office: PrivateOffice;
    whatsappPhone: string;
    actionLabel: string;
}

function formatOfficePrice(office: PrivateOffice): string {
    if (office.price === null) {
        return 'CONSULTAR VALOR';
    }

    if (office.currency === 'UF') {
        return `UF ${new Intl.NumberFormat('es-CL', {
            maximumFractionDigits: 2,
        }).format(office.price)}`;
    }

    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        maximumFractionDigits: 0,
    }).format(office.price);
}

export function PrivateOfficeCard({
    office,
    whatsappPhone,
    actionLabel,
}: PrivateOfficeCardProps) {
    const availabilityLabel = office.isAvailable ? 'DISPONIBLE' : 'ARRENDADA';
    const whatsappMessage = `Hola, quisiera consultar por disponibilidad o futuras vacantes de la ${office.name} en Animal Co-work.`;

    return (
        <article className="flex h-full flex-col overflow-hidden rounded-card border border-deep-blue/10 bg-white shadow-card">
            <div className="relative h-52 overflow-hidden bg-deep-blue/5 sm:h-56">
                <img
                    src={office.image}
                    alt={office.imageAlt}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                    loading="lazy"
                />

                <span
                    className={[
                        'absolute top-4 left-4 rounded-full px-3 py-1.5 text-[11px] font-extrabold tracking-[0.12em] text-white uppercase shadow-sm',
                        office.isAvailable ? 'bg-instinct' : 'bg-deep-blue',
                    ].join(' ')}
                >
                    {availabilityLabel}
                </span>
            </div>

            <div className="flex flex-1 flex-col p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                    <h3 className="text-xl font-extrabold tracking-[-0.035em] text-deep-blue uppercase sm:text-2xl">
                        {office.name}
                    </h3>

                    <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-deep-blue/5 px-3 py-1.5 text-xs font-bold text-deep-blue/70">
                        <Maximize2
                            className="size-3.5 text-instinct-dark"
                            strokeWidth={2.2}
                            aria-hidden
                        />
                        {office.areaM2} m²
                    </span>
                </div>

                <ul className="mt-5 grid grid-cols-2 gap-x-3 gap-y-2.5">
                    {office.features.map((feature) => (
                        <li
                            key={feature}
                            className="flex min-w-0 items-start gap-2 text-xs leading-5 text-deep-blue/65"
                        >
                            <CheckCircle2
                                className="mt-0.5 size-3.5 shrink-0 text-instinct"
                                strokeWidth={2.4}
                                aria-hidden
                            />
                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>

                <div className="mt-auto pt-6">
                    <div className="border-t border-deep-blue/10 pt-5">
                        <p className="text-2xl font-extrabold tracking-[-0.04em] text-deep-blue">
                            {formatOfficePrice(office)}
                        </p>

                        {office.expensesIncluded && (
                            <p className="mt-1 text-xs font-semibold text-deep-blue/50">
                                Todos los gastos incluidos.
                            </p>
                        )}

                        <ButtonArrow
                            href={createWhatsappUrl(
                                whatsappPhone,
                                whatsappMessage,
                            )}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-5 w-full"
                            aria-label={`${actionLabel} para ${office.name} por WhatsApp`}
                        >
                            {actionLabel}
                        </ButtonArrow>
                    </div>
                </div>
            </div>
        </article>
    );
}

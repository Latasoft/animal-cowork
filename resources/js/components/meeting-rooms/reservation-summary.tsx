import {
    Building2,
    CalendarDays,
    CheckCircle2,
    Clock3,
    CreditCard,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import type {
    CompanyLookupResult,
    ConfirmedReservation,
    MeetingRoom,
} from '@/types/meeting-room';

interface ReservationSummaryProps {
    room: MeetingRoom | null;
    dateLabel: string;
    scheduleLabel: string;
    durationMinutes: number;
    lookup: CompanyLookupResult | null;
    canSubmit: boolean;
    processing: boolean;
    confirmedReservation: ConfirmedReservation | null;
}

export function ReservationSummary({
    room,
    dateLabel,
    scheduleLabel,
    durationMinutes,
    lookup,
    canSubmit,
    processing,
    confirmedReservation,
}: ReservationSummaryProps) {
    const quote = lookup?.quote ?? null;

    return (
        <aside className="rounded-card border border-deep-blue/10 bg-white p-6 shadow-card sm:p-7 lg:sticky lg:top-28">
            <p className="text-xs font-extrabold tracking-[0.14em] text-instinct-dark uppercase">
                Paso 5 · Resumen
            </p>
            <h3 className="mt-2 text-2xl font-extrabold tracking-[-0.035em] text-deep-blue">
                Revisa tu reserva
            </h3>

            <dl className="mt-6 divide-y divide-deep-blue/8">
                <SummaryItem
                    icon={Building2}
                    label="Sala"
                    value={room?.name ?? 'Por seleccionar'}
                />
                <SummaryItem
                    icon={CalendarDays}
                    label="Fecha"
                    value={dateLabel || 'Por seleccionar'}
                />
                <SummaryItem
                    icon={Clock3}
                    label="Horario comercial"
                    value={scheduleLabel || 'Por seleccionar'}
                />
                <SummaryItem
                    icon={Clock3}
                    label="Duración"
                    value={
                        durationMinutes > 0
                            ? `${durationMinutes / 60} ${durationMinutes === 60 ? 'hora' : 'horas'}`
                            : 'Por seleccionar'
                    }
                />
            </dl>

            {quote ? (
                <div className="mt-6 border-t border-deep-blue/10 pt-6">
                    <div className="mb-4 rounded-2xl border border-instinct/25 bg-instinct-light p-4">
                        <p className="font-extrabold text-instinct-dark">
                            {quote.rate_type === 'client'
                                ? 'Tarifa cliente Animal Co-work'
                                : 'Tarifa general'}
                        </p>
                        <p className="mt-2 text-sm text-deep-blue/65">
                            {quote.included_minutes_used / 60} h incluidas ·{' '}
                            {quote.billable_minutes / 60} h cobrables
                        </p>
                    </div>

                    <div className="space-y-3 text-sm">
                        <PriceLine
                            label="Tarifa neta por hora"
                            value={formatClp(quote.rate_per_hour_net)}
                        />
                        <PriceLine
                            label="Subtotal neto"
                            value={formatClp(quote.subtotal_net)}
                        />
                        <PriceLine
                            label="IVA"
                            value={formatClp(quote.tax_amount)}
                        />
                        <div className="flex items-end justify-between gap-4 border-t border-deep-blue/10 pt-4">
                            <span className="font-extrabold text-deep-blue">
                                Total a pagar
                            </span>
                            <strong className="text-2xl font-extrabold text-instinct-dark">
                                {formatClp(quote.total_amount)}
                            </strong>
                        </div>
                    </div>
                </div>
            ) : (
                <p className="mt-6 rounded-xl bg-deep-blue/4 p-4 text-sm text-deep-blue/60">
                    Indica si tienes un plan Animal Co-work para calcular el
                    total.
                </p>
            )}

            <div className="mt-6 flex items-start gap-3 rounded-xl bg-deep-blue/4 p-4 text-xs leading-5 text-deep-blue/60">
                <CreditCard
                    className="mt-0.5 size-4 shrink-0 text-energy-blue"
                    aria-hidden
                />
                El pago es simulado. El backend volverá a validar el horario y
                el precio antes de confirmar.
            </div>

            <Button
                type="submit"
                form="meeting-room-reservation-form"
                disabled={
                    processing || !canSubmit || Boolean(confirmedReservation)
                }
                className="mt-6 h-14 w-full justify-center text-sm font-extrabold"
            >
                {processing
                    ? 'CONFIRMANDO...'
                    : quote?.total_amount === 0
                      ? 'CONFIRMAR CON BENEFICIO'
                      : 'PAGAR Y CONFIRMAR'}
            </Button>

            {confirmedReservation && (
                <div
                    role="status"
                    className="mt-5 rounded-2xl border border-instinct/30 bg-instinct-light p-4"
                >
                    <div className="flex items-center gap-2 font-extrabold text-instinct-dark">
                        <CheckCircle2 className="size-5" aria-hidden />
                        Reserva #{confirmedReservation.id} confirmada
                    </div>
                    <p className="mt-2 text-sm leading-6 text-deep-blue/65">
                        Enviamos el resumen al correo indicado. Total:{' '}
                        {formatClp(confirmedReservation.total_amount)}.
                    </p>
                </div>
            )}
        </aside>
    );
}

function SummaryItem({
    icon: Icon,
    label,
    value,
}: {
    icon: typeof Building2;
    label: string;
    value: string;
}) {
    return (
        <div className="flex gap-3 py-3 first:pt-0">
            <Icon
                className="mt-0.5 size-4 shrink-0 text-instinct-dark"
                aria-hidden
            />
            <div className="min-w-0">
                <dt className="text-xs font-bold text-deep-blue/45">{label}</dt>
                <dd className="mt-0.5 text-sm font-extrabold break-words text-deep-blue">
                    {value}
                </dd>
            </div>
        </div>
    );
}

function PriceLine({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between gap-4 text-deep-blue/60">
            <span>{label}</span>
            <strong className="text-deep-blue">{value}</strong>
        </div>
    );
}

function formatClp(value: number): string {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        maximumFractionDigits: 0,
    }).format(value);
}

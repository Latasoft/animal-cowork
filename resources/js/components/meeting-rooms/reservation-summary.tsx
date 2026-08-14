import {
    Building2,
    CalendarDays,
    CheckCircle2,
    Clock3,
    CreditCard,
    ShieldCheck,
    UserRound,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { formatClp, meetingRoomSettings } from '@/data/meeting-rooms';
import type {
    MeetingRoom,
    ReservationFormData,
    ReservationPayload,
} from '@/types/meeting-room';

interface ReservationSummaryProps {
    room: MeetingRoom | null;
    dateLabel: string;
    scheduleLabel: string;
    durationHours: number;
    formData: ReservationFormData;
    processing: boolean;
    preparedReservation: ReservationPayload | null;
}

export function ReservationSummary({
    room,
    dateLabel,
    scheduleLabel,
    durationHours,
    formData,
    processing,
    preparedReservation,
}: ReservationSummaryProps) {
    const isVirtualOfficeClient = formData.isVirtualOfficeClient === 'yes';
    const hourlyRate = isVirtualOfficeClient
        ? meetingRoomSettings.clientAdditionalHourlyRate
        : meetingRoomSettings.normalHourlyRate;
    const netSubtotal = durationHours * hourlyRate;
    const tax = Math.round(netSubtotal * meetingRoomSettings.taxRate);
    const total = netSubtotal + tax;

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
                    label="Horario"
                    value={scheduleLabel || 'Por seleccionar'}
                />
                <SummaryItem
                    icon={Clock3}
                    label="Duración"
                    value={
                        durationHours > 0
                            ? `${durationHours} ${durationHours === 1 ? 'hora' : 'horas'}`
                            : 'Por seleccionar'
                    }
                />
                <SummaryItem
                    icon={UserRound}
                    label="Empresa"
                    value={formData.companyName || 'Por completar'}
                />
                <SummaryItem
                    icon={UserRound}
                    label="Representante"
                    value={formData.representativeName || 'Por completar'}
                />
                <SummaryItem
                    icon={UserRound}
                    label="Correo"
                    value={formData.email || 'Por completar'}
                />
                <SummaryItem
                    icon={UserRound}
                    label="Contacto"
                    value={formData.phone || 'Por completar'}
                />
                <SummaryItem
                    icon={ShieldCheck}
                    label="Cliente vigente"
                    value={
                        formData.isVirtualOfficeClient === 'yes'
                            ? 'Sí'
                            : formData.isVirtualOfficeClient === 'no'
                              ? 'No'
                              : 'Por indicar'
                    }
                />
            </dl>

            <div className="mt-6 border-t border-deep-blue/10 pt-6">
                {isVirtualOfficeClient && (
                    <div className="mb-4 rounded-2xl border border-instinct/25 bg-instinct-light p-4">
                        <p className="font-extrabold text-instinct-dark">
                            Tarifa de cliente vigente
                        </p>
                        <p className="mt-2 text-sm leading-6 text-deep-blue/65">
                            Este cálculo asume que ya utilizaste tus horas
                            gratuitas del mes. Cada hora reservada se valoriza a
                            $7.000 + IVA.
                        </p>
                    </div>
                )}

                <div className="space-y-3 text-sm">
                    <div className="flex justify-between gap-4 text-deep-blue/60">
                        <span>Tarifa aplicada</span>
                        <strong className="text-right text-deep-blue">
                            {formatClp(hourlyRate)} × {durationHours}{' '}
                            {durationHours === 1 ? 'hora' : 'horas'}
                        </strong>
                    </div>
                    <div className="flex justify-between gap-4 text-deep-blue/60">
                        <span>Subtotal neto</span>
                        <strong className="text-deep-blue">
                            {formatClp(netSubtotal)}
                        </strong>
                    </div>
                    <div className="flex justify-between gap-4 text-deep-blue/60">
                        <span>IVA (19%)</span>
                        <strong className="text-deep-blue">
                            {formatClp(tax)}
                        </strong>
                    </div>
                    <div className="flex items-end justify-between gap-4 border-t border-deep-blue/10 pt-4">
                        <span className="font-extrabold text-deep-blue">
                            Total a pagar
                        </span>
                        <strong className="text-2xl font-extrabold tracking-[-0.04em] text-instinct-dark">
                            {formatClp(total)}
                        </strong>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-xl bg-deep-blue/4 p-4 text-xs leading-5 text-deep-blue/60">
                <CreditCard
                    className="mt-0.5 size-4 shrink-0 text-energy-blue"
                    aria-hidden
                />
                El pago debe realizarse al menos 24 horas antes de la reserva.
                El backend validará el horario y generará el link de pago.
            </div>

            <Button
                type="submit"
                form="meeting-room-reservation-form"
                disabled={processing}
                className="mt-6 h-14 w-full justify-center text-sm font-extrabold shadow-[0_12px_28px_rgba(106,174,59,0.28)]"
            >
                {processing ? 'PREPARANDO RESERVA...' : 'CONTINUAR AL PAGO'}
            </Button>

            {preparedReservation && (
                <div
                    role="status"
                    className="mt-5 rounded-2xl border border-instinct/30 bg-instinct-light p-4"
                >
                    <div className="flex items-center gap-2 font-extrabold text-instinct-dark">
                        <CheckCircle2 className="size-5" aria-hidden />
                        Reserva preparada
                    </div>
                    <p className="mt-2 text-sm leading-6 text-deep-blue/65">
                        La integración final generará el link de pago
                        correspondiente. La reserva aún no está confirmada.
                    </p>
                </div>
            )}
        </aside>
    );
}

interface SummaryItemProps {
    icon: typeof Building2;
    label: string;
    value: string;
}

function SummaryItem({ icon: Icon, label, value }: SummaryItemProps) {
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

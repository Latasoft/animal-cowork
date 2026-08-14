import { Head } from '@inertiajs/react';
import {
    CalendarDays,
    Check,
    Clock3,
    CreditCard,
    Info,
    MousePointerClick,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';

import { Footer } from '@/components/layout/footer';
import { ReservationCalendar } from '@/components/meeting-rooms/reservation-calendar';
import { ReservationForm } from '@/components/meeting-rooms/reservation-form';
import { ReservationSummary } from '@/components/meeting-rooms/reservation-summary';
import { RoomCard } from '@/components/meeting-rooms/room-card';
import { TimeSlotSelector } from '@/components/meeting-rooms/time-slot-selector';
import { ButtonArrow } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { getMockAvailability, meetingRooms } from '@/data/meeting-rooms';
import { PublicLayout } from '@/layouts/public-layout';
import type {
    MeetingRoomId,
    ReservationFormData,
    ReservationFormErrors,
    ReservationPayload,
    TimeSlot,
} from '@/types/meeting-room';

const initialFormData: ReservationFormData = {
    companyName: '',
    representativeName: '',
    email: '',
    phone: '',
    isVirtualOfficeClient: '',
    acceptsTerms: false,
};

const processSteps = ['Sala', 'Fecha', 'Horario', 'Datos', 'Resumen'];

function parseLocalDate(date: string): Date {
    const [year, month, day] = date.split('-').map(Number);

    return new Date(year, month - 1, day);
}

function formatReservationDate(date: string | null): string {
    if (!date) {
        return '';
    }

    return new Intl.DateTimeFormat('es-CL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(parseLocalDate(date));
}

export default function MeetingRoomBooking() {
    const [selectedRoomId, setSelectedRoomId] = useState<MeetingRoomId | null>(
        null,
    );
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedSlotIds, setSelectedSlotIds] = useState<string[]>([]);
    const [formData, setFormData] =
        useState<ReservationFormData>(initialFormData);
    const [errors, setErrors] = useState<ReservationFormErrors>({});
    const [isAvailabilityLoading, setIsAvailabilityLoading] = useState(false);
    const [isPreparing, setIsPreparing] = useState(false);
    const [preparedReservation, setPreparedReservation] =
        useState<ReservationPayload | null>(null);
    const [submissionError, setSubmissionError] = useState<string | null>(null);
    const availabilityTimer = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (availabilityTimer.current !== null) {
                window.clearTimeout(availabilityTimer.current);
            }
        };
    }, []);

    const selectedRoom =
        meetingRooms.find((room) => room.id === selectedRoomId) ?? null;
    const availability =
        selectedRoomId && selectedDate
            ? getMockAvailability(selectedRoomId, selectedDate)
            : null;
    const selectedSlots = getSelectedSlots(
        availability?.slots ?? [],
        selectedSlotIds,
    );
    const durationHours = selectedSlots.length;
    const scheduleLabel =
        selectedSlots.length > 0
            ? `${selectedSlots[0].start} – ${selectedSlots.at(-1)?.end ?? ''}`
            : '';
    const dateLabel = formatReservationDate(selectedDate);
    const canCompleteData = durationHours > 0;

    function clearErrors(...keys: Array<keyof ReservationFormErrors>) {
        setErrors((current) => {
            const next = { ...current };

            keys.forEach((key) => {
                delete next[key];
            });

            return next;
        });
    }

    function selectRoom(roomId: MeetingRoomId) {
        if (availabilityTimer.current !== null) {
            window.clearTimeout(availabilityTimer.current);
        }

        setSelectedRoomId(roomId);
        setSelectedDate(null);
        setSelectedSlotIds([]);
        setIsAvailabilityLoading(false);
        setPreparedReservation(null);
        setSubmissionError(null);
        clearErrors('room', 'date', 'slots');

        requestAnimationFrame(() => {
            document.getElementById('reservar-sala')?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        });
    }

    function selectDate(date: string) {
        if (availabilityTimer.current !== null) {
            window.clearTimeout(availabilityTimer.current);
        }

        setSelectedDate(date);
        setSelectedSlotIds([]);
        setPreparedReservation(null);
        setSubmissionError(null);
        setIsAvailabilityLoading(true);
        clearErrors('date', 'slots');

        availabilityTimer.current = window.setTimeout(() => {
            setIsAvailabilityLoading(false);
            availabilityTimer.current = null;
        }, 350);
    }

    function toggleSlot(slotId: string) {
        const slots = availability?.slots ?? [];
        const clickedIndex = slots.findIndex((slot) => slot.id === slotId);

        if (clickedIndex < 0 || !slots[clickedIndex].available) {
            return;
        }

        setSelectedSlotIds((current) => {
            const selectedIndices = current
                .map((id) => slots.findIndex((slot) => slot.id === id))
                .filter((index) => index >= 0)
                .sort((left, right) => left - right);
            const isAlreadySelected = current.includes(slotId);

            if (isAlreadySelected) {
                if (current.length === 1) {
                    return [];
                }

                const firstIndex = selectedIndices[0];
                const lastIndex = selectedIndices.at(-1);

                if (clickedIndex === firstIndex || clickedIndex === lastIndex) {
                    return current.filter((id) => id !== slotId);
                }

                return [slotId];
            }

            if (selectedIndices.length === 0) {
                return [slotId];
            }

            const firstIndex = selectedIndices[0];
            const lastIndex = selectedIndices.at(-1) ?? firstIndex;
            const isConsecutive =
                clickedIndex === firstIndex - 1 ||
                clickedIndex === lastIndex + 1;

            if (!isConsecutive) {
                return [slotId];
            }

            return [...current, slotId].sort(
                (left, right) =>
                    slots.findIndex((slot) => slot.id === left) -
                    slots.findIndex((slot) => slot.id === right),
            );
        });

        setPreparedReservation(null);
        setSubmissionError(null);
        clearErrors('slots');
    }

    function updateFormData<Key extends keyof ReservationFormData>(
        key: Key,
        value: ReservationFormData[Key],
    ) {
        setFormData((current) => ({ ...current, [key]: value }));
        setPreparedReservation(null);
        setSubmissionError(null);
        clearErrors(key);
    }

    function validateReservation(): ReservationFormErrors {
        const validationErrors: ReservationFormErrors = {};

        if (!selectedRoomId) {
            validationErrors.room = 'Selecciona una sala.';
        }

        if (!selectedDate) {
            validationErrors.date = 'Selecciona una fecha.';
        }

        if (selectedSlots.length === 0) {
            validationErrors.slots = 'Selecciona al menos una hora.';
        }

        if (!formData.companyName.trim()) {
            validationErrors.companyName = 'Ingresa el nombre de la empresa.';
        }

        if (!formData.representativeName.trim()) {
            validationErrors.representativeName =
                'Ingresa el nombre del representante.';
        }

        if (!formData.email.trim()) {
            validationErrors.email = 'Ingresa un correo electrónico.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            validationErrors.email = 'Ingresa un correo electrónico válido.';
        }

        if (formData.phone.replace(/\D/g, '').length < 8) {
            validationErrors.phone = 'Ingresa un número de contacto válido.';
        }

        if (!formData.isVirtualOfficeClient) {
            validationErrors.isVirtualOfficeClient =
                'Indica si eres cliente vigente.';
        }

        if (!formData.acceptsTerms) {
            validationErrors.acceptsTerms =
                'Debes aceptar los términos y condiciones.';
        }

        return validationErrors;
    }

    function submitReservation(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const validationErrors = validateReservation();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            focusFirstError(validationErrors);

            return;
        }

        if (
            !selectedRoomId ||
            !selectedDate ||
            selectedSlots.length === 0 ||
            !formData.acceptsTerms
        ) {
            setSubmissionError(
                'No pudimos preparar la reserva. Revisa la selección e inténtalo nuevamente.',
            );

            return;
        }

        setIsPreparing(true);
        setSubmissionError(null);
        setPreparedReservation(null);

        window.setTimeout(() => {
            const payload: ReservationPayload = {
                room_id: selectedRoomId,
                date: selectedDate,
                start_time: selectedSlots[0].start,
                end_time: selectedSlots.at(-1)?.end ?? selectedSlots[0].end,
                duration_hours: selectedSlots.length,
                company_name: formData.companyName.trim(),
                representative_name: formData.representativeName.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                is_virtual_office_client:
                    formData.isVirtualOfficeClient === 'yes',
                accepts_terms: true,
            };

            setPreparedReservation(payload);
            setIsPreparing(false);

            requestAnimationFrame(() => {
                document
                    .getElementById('prepared-reservation-status')
                    ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
        }, 700);
    }

    return (
        <>
            <Head title="Agendamiento de salas de reuniones">
                <meta
                    head-key="description"
                    name="description"
                    content="Selecciona una sala de reuniones, fecha y bloque horario en Animal Coworking."
                />
            </Head>

            <PublicLayout>
                <BookingHero />

                <section className="bg-white py-16 sm:py-20">
                    <Container>
                        <div className="mx-auto max-w-3xl text-center">
                            <p className="text-xs font-extrabold tracking-[0.16em] text-instinct-dark uppercase">
                                Nuestras salas
                            </p>
                            <h2
                                id="rooms-heading"
                                tabIndex={-1}
                                className="mt-3 text-3xl font-extrabold tracking-[-0.045em] text-deep-blue outline-none sm:text-4xl"
                            >
                                Encuentra el espacio para tu próxima reunión
                            </h2>
                            <p className="mt-4 text-base leading-7 text-deep-blue/65">
                                Compara los espacios y selecciona la sala que
                                mejor se adapte a tu equipo.
                            </p>
                        </div>

                        <div className="mt-10 grid items-start gap-7 lg:grid-cols-2">
                            {meetingRooms.map((room) => (
                                <RoomCard
                                    key={room.id}
                                    room={room}
                                    isSelected={selectedRoomId === room.id}
                                    onSelect={() => selectRoom(room.id)}
                                />
                            ))}
                        </div>

                        {errors.room && (
                            <p
                                role="alert"
                                className="mt-5 text-center text-sm font-semibold text-red-600"
                            >
                                {errors.room}
                            </p>
                        )}
                    </Container>
                </section>

                <section
                    id="reservar-sala"
                    className="scroll-mt-24 border-y border-deep-blue/8 bg-background py-16 sm:py-20 lg:py-24"
                >
                    <Container>
                        <BookingProgress
                            selectedRoom={Boolean(selectedRoomId)}
                            selectedDate={Boolean(selectedDate)}
                            selectedSchedule={durationHours > 0}
                            completedData={
                                Boolean(formData.companyName) &&
                                Boolean(formData.representativeName) &&
                                Boolean(formData.email) &&
                                Boolean(formData.phone) &&
                                Boolean(formData.isVirtualOfficeClient)
                            }
                        />

                        {!selectedRoomId ? (
                            <EmptySelection />
                        ) : (
                            <form
                                id="meeting-room-reservation-form"
                                className="mt-10"
                                onSubmit={submitReservation}
                                noValidate
                            >
                                {Object.keys(errors).length > 0 && (
                                    <div
                                        role="alert"
                                        className="mb-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-4"
                                    >
                                        <p className="font-extrabold text-red-700">
                                            Revisa los datos de tu reserva
                                        </p>
                                        <p className="mt-1 text-sm text-red-600">
                                            Completa los campos indicados antes
                                            de continuar.
                                        </p>
                                    </div>
                                )}

                                <div className="grid gap-8 lg:grid-cols-2">
                                    <ReservationCalendar
                                        roomId={selectedRoomId}
                                        selectedDate={selectedDate}
                                        onSelectDate={selectDate}
                                    />

                                    {selectedDate ? (
                                        <TimeSlotSelector
                                            slots={availability?.slots ?? []}
                                            selectedSlotIds={selectedSlotIds}
                                            isLoading={isAvailabilityLoading}
                                            onToggleSlot={toggleSlot}
                                        />
                                    ) : (
                                        <WaitingForDate />
                                    )}
                                </div>

                                {(errors.date || errors.slots) && (
                                    <div
                                        className="mt-5 space-y-1"
                                        role="alert"
                                    >
                                        {errors.date && (
                                            <p className="text-sm font-semibold text-red-600">
                                                {errors.date}
                                            </p>
                                        )}
                                        {errors.slots && (
                                            <p className="text-sm font-semibold text-red-600">
                                                {errors.slots}
                                            </p>
                                        )}
                                    </div>
                                )}

                                <div className="mt-10 grid items-start gap-8 border-t border-deep-blue/10 pt-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10">
                                    {canCompleteData ? (
                                        <ReservationForm
                                            data={formData}
                                            errors={errors}
                                            processing={isPreparing}
                                            onChange={updateFormData}
                                        />
                                    ) : (
                                        <WaitingForSchedule />
                                    )}

                                    <div id="prepared-reservation-status">
                                        <ReservationSummary
                                            room={selectedRoom}
                                            dateLabel={dateLabel}
                                            scheduleLabel={scheduleLabel}
                                            durationHours={durationHours}
                                            formData={formData}
                                            processing={isPreparing}
                                            preparedReservation={
                                                preparedReservation
                                            }
                                        />

                                        {submissionError && (
                                            <p
                                                role="alert"
                                                className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700"
                                            >
                                                {submissionError}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </form>
                        )}
                    </Container>
                </section>

                <Footer />
            </PublicLayout>
        </>
    );
}

function getSelectedSlots(
    slots: TimeSlot[],
    selectedSlotIds: string[],
): TimeSlot[] {
    return slots.filter((slot) => selectedSlotIds.includes(slot.id));
}

function focusFirstError(errors: ReservationFormErrors) {
    const fieldOrder: Array<keyof ReservationFormErrors> = [
        'room',
        'date',
        'slots',
        'companyName',
        'representativeName',
        'email',
        'phone',
        'isVirtualOfficeClient',
        'acceptsTerms',
    ];
    const fieldTargets: Record<keyof ReservationFormErrors, string> = {
        room: 'rooms-heading',
        date: 'calendar-heading',
        slots: 'time-slots-heading',
        companyName: 'companyName',
        representativeName: 'representativeName',
        email: 'email',
        phone: 'phone',
        isVirtualOfficeClient: 'client-status-yes',
        acceptsTerms: 'acceptsTerms',
    };
    const firstError = fieldOrder.find((field) => errors[field]);

    if (!firstError) {
        return;
    }

    requestAnimationFrame(() => {
        const target = document.getElementById(fieldTargets[firstError]);

        target?.focus();
        target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
}

function BookingHero() {
    return (
        <section className="relative overflow-hidden bg-deep-blue text-white">
            <div
                className="absolute inset-0 opacity-25"
                aria-hidden
                style={{
                    backgroundImage:
                        'linear-gradient(90deg, #0D1B3D 20%, rgba(13,27,61,.7) 60%, rgba(13,27,61,.3)), url(/images/rooms/sala1.1.webp)',
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                }}
            />

            <Container className="relative py-16 sm:py-20 lg:py-24">
                <div className="max-w-4xl">
                    <p className="text-xs font-extrabold tracking-[0.18em] text-instinct uppercase">
                        Reserva de espacios
                    </p>

                    <h1 className="mt-4 max-w-3xl text-4xl leading-[0.98] font-extrabold tracking-[-0.055em] text-balance sm:text-5xl lg:text-6xl">
                        Reserva tu Sala de Reuniones
                    </h1>

                    <p className="mt-6 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
                        Selecciona tu sala, elige el día y horario que necesitas
                        y realiza tu reserva de forma rápida y online.
                    </p>

                    {/* Precios */}
                    <div className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-2">
                        {/* Tarifa general */}
                        <div className="rounded-2xl border border-white/15 bg-white/8 p-5 backdrop-blur-sm">
                            <p className="text-xs font-extrabold tracking-[0.14em] text-white/55 uppercase">
                                Tarifa general
                            </p>

                            <div className="mt-2 flex flex-wrap items-end gap-x-2">
                                <p className="text-3xl font-extrabold tracking-[-0.04em] text-white sm:text-4xl">
                                    $12.000
                                </p>

                                <span className="pb-1 text-sm font-bold text-white/60">
                                    + IVA / hora
                                </span>
                            </div>

                            <p className="mt-2 text-sm leading-5 text-white/60">
                                Para reservas de público general.
                            </p>
                        </div>

                        {/* Tarifa clientes */}
                        <div className="rounded-2xl border border-instinct/40 bg-instinct/10 p-5 backdrop-blur-sm">
                            <p className="text-xs font-extrabold tracking-[0.14em] text-instinct uppercase">
                                Clientes Animal Co-work
                            </p>

                            <div className="mt-2 flex flex-wrap items-end gap-x-2">
                                <p className="text-3xl font-extrabold tracking-[-0.04em] text-instinct sm:text-4xl">
                                    $7.000
                                </p>

                                <span className="pb-1 text-sm font-bold text-white/70">
                                    + IVA / hora adicional
                                </span>
                            </div>

                            <p className="mt-2 text-sm leading-5 text-white/65">
                                Tarifa preferencial para clientes vigentes de
                                Oficina Virtual.
                            </p>
                        </div>
                    </div>

                    {/* Beneficio clientes */}
                    <div className="mt-4 flex max-w-3xl flex-col gap-3 border-l-4 border-instinct bg-white/5 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm leading-6 text-white/75">
                            Los clientes vigentes de Oficina Virtual cuentan con{' '}
                            <strong className="font-extrabold text-white">
                                2 horas mensuales gratis
                            </strong>
                            . Las horas no son acumulables.
                        </p>

                        <p className="flex shrink-0 items-center gap-2 text-sm font-bold text-white/70">
                            <Clock3
                                className="size-4 text-instinct"
                                aria-hidden
                            />
                            Bloques de 1 hora
                        </p>
                    </div>

                    <ButtonArrow
                        href="#reservar-sala"
                        className="mt-8 w-full max-w-xs sm:w-auto"
                    >
                        VER DISPONIBILIDAD
                    </ButtonArrow>

                    <div className="mt-9 grid gap-3 sm:grid-cols-3">
                        <HeroDetail
                            icon={MousePointerClick}
                            text="Elige sala, fecha y horario"
                        />

                        <HeroDetail
                            icon={CalendarDays}
                            text="Un calendario para ambas salas"
                        />

                        <HeroDetail
                            icon={CreditCard}
                            text="Pago con link"
                        />
                    </div>
                </div>
            </Container>
        </section>
    );
}

interface HeroDetailProps {
    icon: typeof CalendarDays;
    text: string;
}

function HeroDetail({ icon: Icon, text }: HeroDetailProps) {
    return (
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
            <Icon className="size-5 shrink-0 text-instinct" aria-hidden />
            <span className="text-xs leading-5 font-bold text-white/80">
                {text}
            </span>
        </div>
    );
}

interface BookingProgressProps {
    selectedRoom: boolean;
    selectedDate: boolean;
    selectedSchedule: boolean;
    completedData: boolean;
}

function BookingProgress({
    selectedRoom,
    selectedDate,
    selectedSchedule,
    completedData,
}: BookingProgressProps) {
    const completed = [
        selectedRoom,
        selectedDate,
        selectedSchedule,
        completedData,
        false,
    ];

    return (
        <div>
            <div className="flex items-end justify-between gap-5">
                <div>
                    <p className="text-xs font-extrabold tracking-[0.16em] text-instinct-dark uppercase">
                        Reserva tu sala
                    </p>
                    <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.045em] text-deep-blue sm:text-4xl">
                        Agenda en cinco pasos simples
                    </h2>
                </div>
                <p className="hidden max-w-md text-right text-sm leading-6 text-deep-blue/55 md:block">
                    La disponibilidad es demostrativa y será validada nuevamente
                    por el backend antes de crear la orden de pago.
                </p>
            </div>

            <ol className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-5">
                {processSteps.map((step, index) => {
                    const isComplete = completed[index];
                    const isCurrent =
                        !isComplete &&
                        (index === 0 || completed[index - 1] === true);

                    return (
                        <li
                            key={step}
                            className={[
                                'flex items-center gap-2 rounded-xl border px-3 py-3 text-xs font-extrabold transition',
                                isComplete
                                    ? 'border-instinct bg-instinct text-white'
                                    : isCurrent
                                      ? 'border-instinct/40 bg-instinct-light text-instinct-dark'
                                      : 'border-deep-blue/8 bg-white text-deep-blue/40',
                            ].join(' ')}
                        >
                            <span
                                className={[
                                    'flex size-6 shrink-0 items-center justify-center rounded-full text-[11px]',
                                    isComplete
                                        ? 'bg-white/20 text-white'
                                        : 'bg-deep-blue/6',
                                ].join(' ')}
                            >
                                {isComplete ? (
                                    <Check className="size-4" aria-hidden />
                                ) : (
                                    index + 1
                                )}
                            </span>
                            {step}
                        </li>
                    );
                })}
            </ol>
        </div>
    );
}

function EmptySelection() {
    return (
        <div className="mt-10 rounded-card border border-dashed border-instinct/45 bg-white px-6 py-14 text-center shadow-card sm:px-10">
            <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-instinct-light text-instinct-dark">
                <MousePointerClick className="size-6" aria-hidden />
            </span>
            <h3 className="mt-5 text-2xl font-extrabold tracking-[-0.035em] text-deep-blue">
                Selecciona una sala para comenzar
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-deep-blue/60">
                El mismo calendario se adapta a la sala que elijas y mostrará su
                disponibilidad.
            </p>
        </div>
    );
}

function WaitingForDate() {
    return (
        <div className="flex min-h-80 items-center justify-center rounded-2xl border border-dashed border-deep-blue/15 bg-white p-8 text-center">
            <div>
                <CalendarDays
                    className="mx-auto size-9 text-instinct"
                    aria-hidden
                />
                <h3 className="mt-4 text-xl font-extrabold text-deep-blue">
                    Elige una fecha
                </h3>
                <p className="mt-2 text-sm leading-6 text-deep-blue/55">
                    Aquí aparecerán los horarios disponibles para la sala y el
                    día seleccionados.
                </p>
            </div>
        </div>
    );
}

function WaitingForSchedule() {
    return (
        <div className="flex min-h-64 items-center justify-center rounded-card border border-dashed border-deep-blue/15 bg-white p-8 text-center">
            <div>
                <Info className="mx-auto size-8 text-energy-blue" aria-hidden />
                <h3 className="mt-4 text-xl font-extrabold text-deep-blue">
                    Selecciona tu bloque horario
                </h3>
                <p className="mt-2 text-sm leading-6 text-deep-blue/55">
                    Cuando elijas una o más horas consecutivas podrás completar
                    los datos de la reserva.
                </p>
            </div>
        </div>
    );
}

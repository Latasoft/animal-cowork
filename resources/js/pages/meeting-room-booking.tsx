import { Head, useHttp } from '@inertiajs/react';
import {
    CalendarDays,
    Check,
    Clock3,
    CreditCard,
    Gift,
    MousePointerClick,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';

import { Footer } from '@/components/layout/footer';
import { ReservationCalendar } from '@/components/meeting-rooms/reservation-calendar';
import { ReservationForm } from '@/components/meeting-rooms/reservation-form';
import { ReservationSummary } from '@/components/meeting-rooms/reservation-summary';
import { RoomCard } from '@/components/meeting-rooms/room-card';
import { TimeSlotSelector } from '@/components/meeting-rooms/time-slot-selector';
import { ButtonArrow } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { PublicLayout } from '@/layouts/public-layout';
import { availability, company_lookup } from '@/routes/meeting_rooms';
import { store } from '@/routes/meeting_rooms/reservations';
import type {
    CompanyLookupResult,
    CustomerType,
    MeetingRoom,
    MeetingRoomId,
    ReservationFormData,
    ReservationFormErrors,
    ReservationRequestData,
    ReservationResponse,
    RoomAvailability,
    TimeSlot,
} from '@/types/meeting-room';
import { normalizeRut } from '@/utils/rut';

interface MeetingRoomBookingProps {
    rooms: MeetingRoom[];
}

const initialFormData: ReservationFormData = {
    companyRut: '',
    companyName: '',
    representativeName: '',
    email: '',
    phone: '',
    contractType: '',
    representativeRut: '',
    address: '',
    commune: '',
    region: '',
    acceptsTerms: false,
    acceptsPrivacy: false,
};

export default function MeetingRoomBooking({ rooms }: MeetingRoomBookingProps) {
    const [selectedRoomId, setSelectedRoomId] = useState<MeetingRoomId | null>(
        null,
    );
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedSlotIds, setSelectedSlotIds] = useState<string[]>([]);
    const [roomAvailability, setRoomAvailability] =
        useState<RoomAvailability | null>(null);
    const [formData, setFormData] = useState(initialFormData);
    const [customerType, setCustomerType] = useState<CustomerType | null>(null);
    const [lookup, setLookup] = useState<CompanyLookupResult | null>(null);
    const [localErrors, setLocalErrors] = useState<ReservationFormErrors>({});
    const [generalError, setGeneralError] = useState<string | null>(null);

    const availabilityRequest = useHttp<
        { room: string; date: string },
        RoomAvailability
    >({ room: '', date: '' });
    const lookupRequest = useHttp<
        {
            customer_type: CustomerType;
            company_rut?: string;
            room: string;
            date: string;
            slot_ids: string[];
        },
        CompanyLookupResult
    >({
        customer_type: 'external',
        room: '',
        date: '',
        slot_ids: [],
    });
    const reservationRequest = useHttp<
        ReservationRequestData,
        ReservationResponse
    >(buildReservationData('', '', [], 'external', initialFormData));

    const selectedRoom =
        rooms.find((room) => room.id === selectedRoomId) ?? null;
    const selectedSlots = getSelectedSlots(
        roomAvailability?.slots ?? [],
        selectedSlotIds,
    );
    const durationMinutes = selectedSlots.reduce(
        (total, slot) => total + slot.billable_minutes,
        0,
    );
    const scheduleLabel =
        selectedSlots.length > 0
            ? `${selectedSlots[0].start} – ${selectedSlots.at(-1)?.end ?? ''}`
            : '';
    const dateLabel = formatReservationDate(selectedDate);
    const formErrors = {
        ...lookupRequest.errors,
        ...reservationRequest.errors,
        ...localErrors,
    } as ReservationFormErrors;

    useEffect(() => {
        if (
            customerType !== 'external' ||
            !selectedRoomId ||
            !selectedDate ||
            selectedSlotIds.length === 0
        ) {
            return;
        }

        lookupRequest.transform(() => ({
            customer_type: 'external',
            room: selectedRoomId,
            date: selectedDate,
            slot_ids: selectedSlotIds,
        }));
        void lookupRequest
            .submit(company_lookup(), {
                onSuccess: (response) => setLookup(response),
                onError: () => setLookup(null),
                onNetworkError: () =>
                    setGeneralError('No pudimos conectar con el servidor.'),
            })
            .catch(() => undefined);
        // La cotización externa solo cambia con la selección de la reserva.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customerType, selectedRoomId, selectedDate, selectedSlotIds]);

    function invalidateQuote(): void {
        setLookup(null);
        setGeneralError(null);
        setLocalErrors({});
        lookupRequest.clearErrors();
        reservationRequest.clearErrors();
    }

    function selectRoom(roomId: MeetingRoomId): void {
        setSelectedRoomId(roomId);
        setSelectedDate(null);
        setSelectedSlotIds([]);
        setRoomAvailability(null);
        invalidateQuote();

        requestAnimationFrame(() =>
            document
                .getElementById('reservar-sala')
                ?.scrollIntoView({ behavior: 'smooth' }),
        );
    }

    function selectDate(date: string): void {
        if (!selectedRoomId) {
            return;
        }

        setSelectedDate(date);
        setSelectedSlotIds([]);
        setRoomAvailability(null);
        invalidateQuote();
        availabilityRequest.transform(() => ({ room: selectedRoomId, date }));
        void availabilityRequest
            .submit(availability(), {
                onSuccess: (response) => setRoomAvailability(response),
                onError: () =>
                    setGeneralError(
                        'No pudimos consultar la disponibilidad. Inténtalo nuevamente.',
                    ),
                onNetworkError: () =>
                    setGeneralError('No pudimos conectar con el servidor.'),
            })
            .catch(() => undefined);
    }

    function toggleSlot(slotId: string): void {
        const slots = roomAvailability?.slots ?? [];
        const clickedIndex = slots.findIndex((slot) => slot.id === slotId);

        if (clickedIndex < 0 || !slots[clickedIndex].available) {
            return;
        }

        setSelectedSlotIds((current) => {
            if (slots.length === 1) {
                return current.includes(slotId) ? [] : [slotId];
            }

            const selectedIndexes = current
                .map((id) => slots.findIndex((slot) => slot.id === id))
                .filter((index) => index >= 0)
                .sort((left, right) => left - right);

            if (current.includes(slotId)) {
                if (current.length === 1) {
                    return [];
                }

                const first = selectedIndexes[0];
                const last = selectedIndexes.at(-1);

                return clickedIndex === first || clickedIndex === last
                    ? current.filter((id) => id !== slotId)
                    : [slotId];
            }

            if (selectedIndexes.length === 0) {
                return [slotId];
            }

            const first = selectedIndexes[0];
            const last = selectedIndexes.at(-1) ?? first;

            if (clickedIndex !== first - 1 && clickedIndex !== last + 1) {
                return [slotId];
            }

            return [...current, slotId].sort(
                (left, right) =>
                    slots.findIndex((slot) => slot.id === left) -
                    slots.findIndex((slot) => slot.id === right),
            );
        });
        invalidateQuote();
    }

    function updateFormData<Key extends keyof ReservationFormData>(
        key: Key,
        value: ReservationFormData[Key],
    ): void {
        setFormData((current) => ({ ...current, [key]: value }));
        setLocalErrors((current) => {
            const next = { ...current };
            delete next[toRequestKey(key)];

            return next;
        });

        if (key === 'companyRut' && customerType === 'plan') {
            setLookup(null);
            lookupRequest.clearErrors();
        }
    }

    function changeCustomerType(nextCustomerType: CustomerType): void {
        setCustomerType(nextCustomerType);
        setFormData(initialFormData);
        invalidateQuote();
    }

    function continueWithoutPlan(): void {
        setCustomerType('external');
        setLookup(null);
        setGeneralError(null);
        setLocalErrors({});
        lookupRequest.clearErrors();
        reservationRequest.clearErrors();
    }

    function consultCompany(): void {
        if (
            customerType !== 'plan' ||
            !selectedRoomId ||
            !selectedDate ||
            selectedSlotIds.length === 0
        ) {
            setGeneralError(
                'Selecciona sala, fecha y horario antes de consultar el RUT.',
            );

            return;
        }

        setGeneralError(null);
        lookupRequest.transform(() => ({
            customer_type: 'plan',
            company_rut: formData.companyRut,
            room: selectedRoomId,
            date: selectedDate,
            slot_ids: selectedSlotIds,
        }));
        void lookupRequest
            .submit(company_lookup(), {
                onSuccess: (response) => {
                    setLookup(response);

                    if (response.company.company_name) {
                        setFormData((current) => ({
                            ...current,
                            companyName:
                                response.company.company_name ??
                                current.companyName,
                        }));
                    }
                },
                onError: () => setLookup(null),
                onNetworkError: () =>
                    setGeneralError('No pudimos conectar con el servidor.'),
            })
            .catch(() => undefined);
    }

    function submitReservation(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault();

        if (
            !selectedRoomId ||
            !selectedDate ||
            selectedSlotIds.length === 0 ||
            !customerType ||
            !lookup
        ) {
            setGeneralError(
                'Completa la selección y consulta el RUT antes de confirmar.',
            );

            return;
        }

        const errors = validateForm(formData, customerType);

        if (Object.keys(errors).length > 0) {
            setLocalErrors(errors);

            return;
        }

        setGeneralError(null);
        reservationRequest.transform(() =>
            buildReservationData(
                selectedRoomId,
                selectedDate,
                selectedSlotIds,
                customerType,
                formData,
            ),
        );
        void reservationRequest
            .submit(store(), {
                onSuccess: () => setLocalErrors({}),
                onError: (errors) => {
                    if (errors.slot_ids) {
                        setLookup(null);
                        void selectDate(selectedDate);
                    }
                },
                onHttpException: () =>
                    setGeneralError(
                        'No pudimos confirmar la reserva. Inténtalo nuevamente.',
                    ),
                onNetworkError: () =>
                    setGeneralError('No pudimos conectar con el servidor.'),
            })
            .catch(() => undefined);
    }

    return (
        <>
            <Head title="Agendamiento de salas de reuniones" />
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
                                className="mt-3 text-3xl font-extrabold tracking-[-0.045em] text-deep-blue sm:text-4xl"
                            >
                                Encuentra el espacio para tu próxima reunión
                            </h2>
                            <p className="mt-4 text-base leading-7 text-deep-blue/65">
                                Selecciona una sala y reserva usando
                                disponibilidad real.
                            </p>
                        </div>

                        <div className="mt-10 grid items-start gap-7 lg:grid-cols-2">
                            {rooms.map((room) => (
                                <RoomCard
                                    key={room.id}
                                    room={room}
                                    isSelected={selectedRoomId === room.id}
                                    onSelect={() => selectRoom(room.id)}
                                />
                            ))}
                        </div>
                    </Container>
                </section>

                <section
                    id="reservar-sala"
                    className="scroll-mt-24 border-y border-deep-blue/8 bg-background py-16 sm:py-20 lg:py-24"
                >
                    <Container>
                        {!selectedRoomId ? (
                            <EmptySelection />
                        ) : (
                            <form
                                id="meeting-room-reservation-form"
                                onSubmit={submitReservation}
                                noValidate
                            >
                                <div className="grid gap-8 lg:grid-cols-2">
                                    <ReservationCalendar
                                        roomId={selectedRoomId}
                                        selectedDate={selectedDate}
                                        onSelectDate={selectDate}
                                    />
                                    {selectedDate ? (
                                        <TimeSlotSelector
                                            slots={
                                                roomAvailability?.slots ?? []
                                            }
                                            selectedSlotIds={selectedSlotIds}
                                            isLoading={
                                                availabilityRequest.processing
                                            }
                                            onToggleSlot={toggleSlot}
                                        />
                                    ) : (
                                        <WaitingCard
                                            icon={CalendarDays}
                                            text="Selecciona una fecha para consultar los horarios disponibles."
                                        />
                                    )}
                                </div>

                                <div className="mt-10 grid items-start gap-8 border-t border-deep-blue/10 pt-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10">
                                    {durationMinutes > 0 ? (
                                        <ReservationForm
                                            customerType={customerType}
                                            data={formData}
                                            errors={formErrors}
                                            disabled={
                                                reservationRequest.processing ||
                                                Boolean(
                                                    reservationRequest.response,
                                                )
                                            }
                                            lookup={lookup}
                                            lookupProcessing={
                                                lookupRequest.processing
                                            }
                                            onCustomerTypeChange={
                                                changeCustomerType
                                            }
                                            onContinueWithoutPlan={
                                                continueWithoutPlan
                                            }
                                            onChange={updateFormData}
                                            onLookup={consultCompany}
                                        />
                                    ) : (
                                        <WaitingCard
                                            icon={Clock3}
                                            text="Selecciona un bloque horario para completar tus datos."
                                        />
                                    )}

                                    <ReservationSummary
                                        room={selectedRoom}
                                        dateLabel={dateLabel}
                                        scheduleLabel={scheduleLabel}
                                        durationMinutes={durationMinutes}
                                        lookup={lookup}
                                        canSubmit={
                                            Boolean(customerType && lookup) &&
                                            !(
                                                customerType === 'plan' &&
                                                !lookup?.company.has_active_plan
                                            )
                                        }
                                        processing={
                                            reservationRequest.processing
                                        }
                                        confirmedReservation={
                                            reservationRequest.response
                                                ?.reservation ?? null
                                        }
                                    />
                                </div>

                                {generalError && (
                                    <p
                                        role="alert"
                                        className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700"
                                    >
                                        {generalError}
                                    </p>
                                )}
                            </form>
                        )}
                    </Container>
                </section>

                <Footer />
            </PublicLayout>
        </>
    );
}

function BookingHero() {
    return (
        <section className="relative overflow-hidden bg-deep-blue py-16 text-white sm:py-20 lg:py-24">
            <Container className="relative grid items-center gap-10 lg:grid-cols-[1fr_0.8fr]">
                <div>
                    <p className="text-xs font-extrabold tracking-[0.16em] text-instinct uppercase">
                        Salas de reuniones
                    </p>
                    <h1 className="mt-4 max-w-3xl text-4xl leading-tight font-extrabold tracking-[-0.05em] sm:text-5xl">
                        Tu próxima gran reunión comienza aquí.
                    </h1>
                    <p className="mt-5 max-w-2xl text-base leading-7 text-white/70">
                        Reserva espacios equipados, consulta tus horas de plan y
                        confirma en línea.
                    </p>
                    <ButtonArrow href="#rooms-heading" className="mt-8">
                        VER SALAS
                    </ButtonArrow>
                </div>
                <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                    <HeroBenefit
                        icon={CalendarDays}
                        text="Disponibilidad en tiempo real"
                    />
                    <HeroBenefit icon={Check} text="Confirmación inmediata" />
                    <HeroBenefit icon={Gift} text="Si eres cliente vigente de Oficina Virtual tienes derecho a 2 horas mensuales gratis." />
                </div>
            </Container>
        </section>
    );
}

function HeroBenefit({
    icon: Icon,
    text,
}: {
    icon: typeof CalendarDays;
    text: string;
}) {
    return (
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <Icon className="size-5 text-instinct" aria-hidden />
            <span className="text-sm font-bold">{text}</span>
        </div>
    );
}

function EmptySelection() {
    return (
        <div className="mx-auto flex max-w-2xl flex-col items-center rounded-card border border-deep-blue/10 bg-white p-10 text-center shadow-card">
            <MousePointerClick
                className="size-10 text-instinct-dark"
                aria-hidden
            />
            <h2 className="mt-4 text-2xl font-extrabold text-deep-blue">
                Primero selecciona una sala
            </h2>
            <p className="mt-3 text-sm leading-6 text-deep-blue/60">
                El calendario y los horarios aparecerán aquí.
            </p>
        </div>
    );
}

function WaitingCard({
    icon: Icon,
    text,
}: {
    icon: typeof CalendarDays;
    text: string;
}) {
    return (
        <div className="flex min-h-52 flex-col items-center justify-center rounded-2xl border border-dashed border-deep-blue/15 bg-white p-8 text-center">
            <Icon className="size-8 text-deep-blue/30" aria-hidden />
            <p className="mt-4 max-w-sm text-sm leading-6 text-deep-blue/55">
                {text}
            </p>
        </div>
    );
}

function getSelectedSlots(slots: TimeSlot[], ids: string[]): TimeSlot[] {
    return slots.filter((slot) => ids.includes(slot.id));
}

function formatReservationDate(date: string | null): string {
    if (!date) {
        return '';
    }

    const [year, month, day] = date.split('-').map(Number);

    return new Intl.DateTimeFormat('es-CL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date(year, month - 1, day));
}

function buildReservationData(
    room: string,
    date: string,
    slotIds: string[],
    customerType: CustomerType,
    data: ReservationFormData,
): ReservationRequestData {
    return {
        customer_type: customerType,
        room,
        date,
        slot_ids: slotIds,
        company_rut: normalizeRut(data.companyRut),
        company_name: data.companyName.trim(),
        representative_name: data.representativeName.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        contract_type: data.contractType,
        representative_rut: normalizeRut(data.representativeRut),
        address: data.address.trim(),
        commune: data.commune.trim(),
        region: data.region.trim(),
        accepts_terms: data.acceptsTerms,
        accepts_privacy: data.acceptsPrivacy,
    };
}

function validateForm(
    data: ReservationFormData,
    customerType: CustomerType,
): ReservationFormErrors {
    const errors: ReservationFormErrors = {};

    if (!data.companyRut) {
        errors.company_rut = 'Ingresa el RUT de la empresa.';
    }

    if (!data.companyName.trim()) {
        errors.company_name = 'Ingresa el nombre de la empresa.';
    }

    if (!data.representativeName.trim()) {
        errors.representative_name = 'Ingresa el nombre de contacto.';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.email = 'Ingresa un correo válido.';
    }

    if (data.phone.replace(/\D/g, '').length < 8) {
        errors.phone = 'Ingresa un teléfono válido.';
    }

    if (customerType === 'external') {
        if (!data.contractType) {
            errors.contract_type = 'Selecciona el tipo de empresa.';
        }

        if (!data.representativeRut) {
            errors.representative_rut = 'Ingresa el RUT del representante.';
        }

        if (!data.address.trim()) {
            errors.address = 'Ingresa la dirección.';
        }

        if (!data.commune.trim()) {
            errors.commune = 'Ingresa la comuna.';
        }

        if (!data.region.trim()) {
            errors.region = 'Ingresa la región.';
        }
    }

    if (customerType === 'external') {
        if (!data.acceptsTerms) {
            errors.accepts_terms = 'Debes aceptar los Términos y Condiciones.';
        }

        if (!data.acceptsPrivacy) {
            errors.accepts_privacy = 'Debes aceptar la Política de Privacidad.';
        }
    }

    return errors;
}

function toRequestKey(key: keyof ReservationFormData): string {
    const keys: Record<keyof ReservationFormData, string> = {
        companyRut: 'company_rut',
        companyName: 'company_name',
        representativeName: 'representative_name',
        email: 'email',
        phone: 'phone',
        contractType: 'contract_type',
        representativeRut: 'representative_rut',
        address: 'address',
        commune: 'commune',
        region: 'region',
        acceptsTerms: 'accepts_terms',
        acceptsPrivacy: 'accepts_privacy',
    };

    return keys[key];
}

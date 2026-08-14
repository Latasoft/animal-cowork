import {
    BadgeCheck,
    Building2,
    Info,
    Mail,
    Phone,
    UserRound,
} from 'lucide-react';

import { meetingRoomSettings, reservationTerms } from '@/data/meeting-rooms';
import type {
    ReservationFormData,
    ReservationFormErrors,
} from '@/types/meeting-room';

interface ReservationFormProps {
    data: ReservationFormData;
    errors: ReservationFormErrors;
    processing: boolean;
    onChange: <Key extends keyof ReservationFormData>(
        key: Key,
        value: ReservationFormData[Key],
    ) => void;
}

interface TextFieldProps {
    name: keyof Pick<
        ReservationFormData,
        'companyName' | 'representativeName' | 'email' | 'phone'
    >;
    label: string;
    value: string;
    placeholder: string;
    type?: 'text' | 'email' | 'tel';
    autoComplete?: string;
    inputMode?: 'text' | 'email' | 'tel';
    error?: string;
    disabled: boolean;
    icon: typeof Building2;
    onChange: (value: string) => void;
}

export function ReservationForm({
    data,
    errors,
    processing,
    onChange,
}: ReservationFormProps) {
    return (
        <section aria-labelledby="reservation-data-heading">
            <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-deep-blue text-white">
                    <UserRound className="size-5" aria-hidden />
                </span>
                <div>
                    <p className="text-xs font-extrabold tracking-[0.14em] text-instinct-dark uppercase">
                        Paso 4 · Datos
                    </p>
                    <h3
                        id="reservation-data-heading"
                        className="mt-1 text-2xl font-extrabold tracking-[-0.035em] text-deep-blue"
                    >
                        Completa tus datos
                    </h3>
                </div>
            </div>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <TextField
                    name="companyName"
                    label="Nombre de empresa"
                    value={data.companyName}
                    onChange={(value) => onChange('companyName', value)}
                    placeholder="Empresa SpA"
                    autoComplete="organization"
                    error={errors.companyName}
                    disabled={processing}
                    icon={Building2}
                />
                <TextField
                    name="representativeName"
                    label="Nombre de representante legal"
                    value={data.representativeName}
                    onChange={(value) => onChange('representativeName', value)}
                    placeholder="Nombre y apellido"
                    autoComplete="name"
                    error={errors.representativeName}
                    disabled={processing}
                    icon={UserRound}
                />
                <TextField
                    name="email"
                    label="Correo electrónico"
                    type="email"
                    inputMode="email"
                    value={data.email}
                    onChange={(value) => onChange('email', value)}
                    placeholder="contacto@empresa.cl"
                    autoComplete="email"
                    error={errors.email}
                    disabled={processing}
                    icon={Mail}
                />
                <TextField
                    name="phone"
                    label="Número de contacto"
                    type="tel"
                    inputMode="tel"
                    value={data.phone}
                    onChange={(value) => onChange('phone', value)}
                    placeholder="+56 9 1234 5678"
                    autoComplete="tel"
                    error={errors.phone}
                    disabled={processing}
                    icon={Phone}
                />
            </div>

            <fieldset className="mt-7">
                <legend className="text-sm font-extrabold text-deep-blue">
                    ¿Eres cliente vigente de Oficina Virtual de Animal
                    Coworking? <span className="text-instinct">*</span>
                </legend>

                <div className="mt-3 grid grid-cols-2 gap-3">
                    {[
                        { value: 'yes' as const, label: 'Sí' },
                        { value: 'no' as const, label: 'No' },
                    ].map((option) => (
                        <label
                            key={option.value}
                            className={[
                                'flex min-h-12 cursor-pointer items-center justify-center gap-3 rounded-xl border px-4 font-extrabold transition',
                                data.isVirtualOfficeClient === option.value
                                    ? 'border-instinct bg-instinct-light text-instinct-dark ring-2 ring-instinct/10'
                                    : 'border-deep-blue/12 bg-white text-deep-blue hover:border-instinct/45',
                            ].join(' ')}
                        >
                            <input
                                id={`client-status-${option.value}`}
                                type="radio"
                                name="isVirtualOfficeClient"
                                value={option.value}
                                checked={
                                    data.isVirtualOfficeClient === option.value
                                }
                                onChange={() =>
                                    onChange(
                                        'isVirtualOfficeClient',
                                        option.value,
                                    )
                                }
                                disabled={processing}
                                aria-invalid={
                                    errors.isVirtualOfficeClient
                                        ? true
                                        : undefined
                                }
                                aria-describedby={
                                    errors.isVirtualOfficeClient
                                        ? 'isVirtualOfficeClient-error'
                                        : undefined
                                }
                                className="size-4 accent-instinct"
                            />
                            {option.label}
                        </label>
                    ))}
                </div>

                {errors.isVirtualOfficeClient && (
                    <p
                        id="isVirtualOfficeClient-error"
                        role="alert"
                        className="mt-2 text-sm font-semibold text-red-600"
                    >
                        {errors.isVirtualOfficeClient}
                    </p>
                )}
            </fieldset>

            <aside className="mt-7 rounded-2xl border border-instinct/25 bg-instinct-light p-5 sm:p-6">
                <div className="flex items-start gap-4">
                    <BadgeCheck
                        className="mt-0.5 size-6 shrink-0 text-instinct-dark"
                        aria-hidden
                    />
                    <div>
                        <h4 className="font-extrabold text-deep-blue">
                            Beneficio para clientes vigentes
                        </h4>
                        <p className="mt-2 text-sm leading-6 text-deep-blue/70">
                            Tienes derecho a{' '}
                            <strong>
                                {meetingRoomSettings.includedClientHours} horas
                                mensuales gratis
                            </strong>
                            . Las horas no son acumulables. Hora adicional:{' '}
                            <strong>$7.000 + IVA</strong>.
                        </p>
                        <p className="mt-3 text-xs leading-5 font-bold text-deep-blue/60">
                            Beneficio sujeto a validación de vigencia y
                            disponibilidad mensual.
                        </p>
                    </div>
                </div>
            </aside>

            <div className="mt-7 rounded-2xl border border-deep-blue/10 bg-deep-blue/3 p-5 sm:p-6">
                <div className="flex items-start gap-3">
                    <Info
                        className="mt-0.5 size-5 shrink-0 text-energy-blue"
                        aria-hidden
                    />
                    <div>
                        <h4 className="font-extrabold text-deep-blue">
                            Términos de la reserva
                        </h4>
                        <div className="mt-3 space-y-3 text-sm leading-6 text-deep-blue/65">
                            {reservationTerms.map((term) => (
                                <p key={term}>{term}</p>
                            ))}
                        </div>
                    </div>
                </div>

                <label className="mt-5 flex cursor-pointer items-start gap-3 border-t border-deep-blue/10 pt-5">
                    <input
                        id="acceptsTerms"
                        type="checkbox"
                        checked={data.acceptsTerms}
                        onChange={(event) =>
                            onChange('acceptsTerms', event.target.checked)
                        }
                        disabled={processing}
                        aria-invalid={errors.acceptsTerms ? true : undefined}
                        aria-describedby={
                            errors.acceptsTerms
                                ? 'acceptsTerms-error'
                                : undefined
                        }
                        className="mt-0.5 size-5 shrink-0 cursor-pointer rounded accent-instinct focus:ring-instinct disabled:cursor-not-allowed"
                    />
                    <span className="text-sm leading-6 font-bold text-deep-blue">
                        Acepto los términos y condiciones.
                    </span>
                </label>

                {errors.acceptsTerms && (
                    <p
                        id="acceptsTerms-error"
                        role="alert"
                        className="mt-2 pl-8 text-sm font-semibold text-red-600"
                    >
                        {errors.acceptsTerms}
                    </p>
                )}
            </div>
        </section>
    );
}

function TextField({
    name,
    label,
    value,
    placeholder,
    type = 'text',
    autoComplete,
    inputMode,
    error,
    disabled,
    icon: Icon,
    onChange,
}: TextFieldProps) {
    const errorId = `${name}-error`;

    return (
        <div>
            <label
                htmlFor={name}
                className="mb-2 block text-sm font-extrabold text-deep-blue"
            >
                {label} <span className="text-instinct">*</span>
            </label>

            <div className="relative">
                <Icon
                    className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-deep-blue/35"
                    aria-hidden
                />
                <input
                    id={name}
                    name={name}
                    type={type}
                    inputMode={inputMode}
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    disabled={disabled}
                    required
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? errorId : undefined}
                    className={[
                        'h-12 w-full rounded-xl border bg-white pr-4 pl-11 text-sm font-medium text-deep-blue transition outline-none',
                        'placeholder:text-deep-blue/35 hover:border-deep-blue/30 focus:ring-4',
                        'disabled:cursor-not-allowed disabled:bg-deep-blue/3 disabled:opacity-60',
                        error
                            ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                            : 'border-deep-blue/15 focus:border-instinct focus:ring-instinct/10',
                    ].join(' ')}
                />
            </div>

            {error && (
                <p
                    id={errorId}
                    role="alert"
                    className="mt-2 text-sm font-semibold text-red-600"
                >
                    {error}
                </p>
            )}
        </div>
    );
}

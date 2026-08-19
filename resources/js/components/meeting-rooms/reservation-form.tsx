import {
    Building2,
    Check,
    Mail,
    MapPin,
    Phone,
    Search,
    UserRound,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import type {
    CompanyLookupResult,
    CustomerType,
    ReservationFormData,
    ReservationFormErrors,
} from '@/types/meeting-room';
import { formatRut } from '@/utils/rut';

interface ReservationFormProps {
    customerType: CustomerType | null;
    data: ReservationFormData;
    errors: ReservationFormErrors;
    disabled: boolean;
    lookup: CompanyLookupResult | null;
    lookupProcessing: boolean;
    onCustomerTypeChange: (customerType: CustomerType) => void;
    onContinueWithoutPlan: () => void;
    onChange: <Key extends keyof ReservationFormData>(
        key: Key,
        value: ReservationFormData[Key],
    ) => void;
    onLookup: () => void;
}

export function ReservationForm({
    customerType,
    data,
    errors,
    disabled,
    lookup,
    lookupProcessing,
    onCustomerTypeChange,
    onContinueWithoutPlan,
    onChange,
    onLookup,
}: ReservationFormProps) {
    const isExternal = customerType === 'external';
    const hasRecognizedPlan =
        customerType === 'plan' && lookup?.company.has_active_plan === true;

    return (
        <section aria-labelledby="reservation-data-heading">
            <p className="text-xs font-extrabold tracking-[0.14em] text-instinct-dark uppercase">
                Paso 4 · Datos
            </p>
            <h3
                id="reservation-data-heading"
                className="mt-2 text-2xl font-extrabold tracking-[-0.035em] text-deep-blue"
            >
                Identifica tu reserva
            </h3>

            <fieldset className="mt-6">
                <legend className="text-sm font-extrabold text-deep-blue">
                    ¿Eres cliente con plan Animal Co-work?
                </legend>
                <div className="mt-3 grid grid-cols-2 gap-3">
                    <CustomerTypeOption
                        value="plan"
                        label="Sí"
                        selected={customerType === 'plan'}
                        disabled={disabled}
                        onChange={onCustomerTypeChange}
                    />
                    <CustomerTypeOption
                        value="external"
                        label="No"
                        selected={customerType === 'external'}
                        disabled={disabled}
                        onChange={onCustomerTypeChange}
                    />
                </div>
            </fieldset>

            {customerType === 'plan' && (
                <div className="mt-6">
                    <CompanyRutField
                        value={data.companyRut}
                        error={errors.company_rut}
                        disabled={disabled || lookupProcessing}
                        onChange={(value) => onChange('companyRut', value)}
                        action={
                            <Button
                                type="button"
                                onClick={onLookup}
                                disabled={
                                    disabled ||
                                    lookupProcessing ||
                                    !data.companyRut
                                }
                                className="h-12 justify-center px-6"
                            >
                                <Search className="size-4" aria-hidden />
                                {lookupProcessing
                                    ? 'Consultando...'
                                    : 'Consultar'}
                            </Button>
                        }
                    />
                </div>
            )}

            {customerType === 'plan' && lookup && (
                <LookupNotice
                    lookup={lookup}
                    onContinueWithoutPlan={onContinueWithoutPlan}
                />
            )}

            {isExternal && (
                <div className="mt-6">
                    <CompanyRutField
                        value={data.companyRut}
                        error={errors.company_rut}
                        disabled={disabled}
                        onChange={(value) => onChange('companyRut', value)}
                    />
                    <p className="mt-2 text-sm text-deep-blue/60">
                        No realizaremos una consulta previa de beneficios. Se
                        aplicará la tarifa general de la sala.
                    </p>
                </div>
            )}

            {(isExternal || hasRecognizedPlan) && (
                <div className="mt-7 grid gap-5 sm:grid-cols-2">
                    <TextField
                        id="company-name"
                        label="Empresa"
                        icon={Building2}
                        value={data.companyName}
                        error={errors.company_name}
                        disabled={disabled}
                        onChange={(value) => onChange('companyName', value)}
                    />
                    <TextField
                        id="representative-name"
                        label="Nombre de contacto"
                        icon={UserRound}
                        value={data.representativeName}
                        error={errors.representative_name}
                        disabled={disabled}
                        onChange={(value) =>
                            onChange('representativeName', value)
                        }
                    />
                    <TextField
                        id="email"
                        label="Correo"
                        icon={Mail}
                        type="email"
                        value={data.email}
                        error={errors.email}
                        disabled={disabled}
                        onChange={(value) => onChange('email', value)}
                    />
                    <TextField
                        id="phone"
                        label="Teléfono / WhatsApp"
                        icon={Phone}
                        value={data.phone}
                        error={errors.phone}
                        disabled={disabled}
                        onChange={(value) => onChange('phone', value)}
                    />
                </div>
            )}

            {isExternal && (
                <div className="mt-7 rounded-2xl border border-deep-blue/10 bg-deep-blue/3 p-5">
                    <p className="font-extrabold text-deep-blue">
                        Datos para tu reserva sin plan
                    </p>
                    <div className="mt-5 grid gap-5 sm:grid-cols-2">
                        <div>
                            <label
                                htmlFor="contract-type"
                                className="text-sm font-extrabold text-deep-blue"
                            >
                                Tipo de empresa
                            </label>
                            <select
                                id="contract-type"
                                value={data.contractType}
                                disabled={disabled}
                                onChange={(event) =>
                                    onChange(
                                        'contractType',
                                        event.target
                                            .value as ReservationFormData['contractType'],
                                    )
                                }
                                className={inputClasses(
                                    Boolean(errors.contract_type),
                                )}
                            >
                                <option value="">Seleccionar</option>
                                <option value="legal">Persona jurídica</option>
                                <option value="natural">
                                    Persona natural con giro
                                </option>
                            </select>
                            <FieldError message={errors.contract_type} />
                        </div>
                        <TextField
                            id="representative-rut"
                            label="RUT representante"
                            icon={UserRound}
                            value={data.representativeRut}
                            error={errors.representative_rut}
                            disabled={disabled}
                            onChange={(value) =>
                                onChange('representativeRut', formatRut(value))
                            }
                        />
                        <TextField
                            id="address"
                            label="Dirección"
                            icon={MapPin}
                            value={data.address}
                            error={errors.address}
                            disabled={disabled}
                            onChange={(value) => onChange('address', value)}
                        />
                        <TextField
                            id="commune"
                            label="Comuna"
                            icon={MapPin}
                            value={data.commune}
                            error={errors.commune}
                            disabled={disabled}
                            onChange={(value) => onChange('commune', value)}
                        />
                        <TextField
                            id="region"
                            label="Región"
                            icon={MapPin}
                            value={data.region}
                            error={errors.region}
                            disabled={disabled}
                            onChange={(value) => onChange('region', value)}
                        />
                    </div>
                </div>
            )}

            {isExternal && (
                <div className="mt-7 space-y-4 rounded-2xl border border-instinct/25 bg-instinct-light p-5">
                    <LegalCheckbox
                        checked={data.acceptsTerms}
                        error={errors.accepts_terms}
                        disabled={disabled}
                        onChange={(checked) =>
                            onChange('acceptsTerms', checked)
                        }
                    >
                        He leído y acepto los{' '}
                        <a
                            href="/terminos-y-condiciones"
                            target="_blank"
                            rel="noreferrer"
                            className="font-extrabold underline"
                        >
                            Términos y Condiciones
                        </a>{' '}
                        del servicio.
                    </LegalCheckbox>
                    <LegalCheckbox
                        checked={data.acceptsPrivacy}
                        error={errors.accepts_privacy}
                        disabled={disabled}
                        onChange={(checked) =>
                            onChange('acceptsPrivacy', checked)
                        }
                    >
                        He leído y acepto la{' '}
                        <a
                            href="/politica-de-privacidad"
                            target="_blank"
                            rel="noreferrer"
                            className="font-extrabold underline"
                        >
                            Política de Privacidad
                        </a>{' '}
                        y autorizo el tratamiento de mis datos conforme a la Ley
                        N.º 21.719.
                    </LegalCheckbox>
                </div>
            )}
        </section>
    );
}

function CustomerTypeOption({
    value,
    label,
    selected,
    disabled,
    onChange,
}: {
    value: CustomerType;
    label: string;
    selected: boolean;
    disabled: boolean;
    onChange: (value: CustomerType) => void;
}) {
    return (
        <label
            className={`flex min-h-14 cursor-pointer items-center justify-center gap-3 rounded-xl border px-4 text-sm font-extrabold transition ${
                selected
                    ? 'border-instinct bg-instinct-light text-instinct-dark ring-2 ring-instinct/15'
                    : 'border-deep-blue/15 bg-white text-deep-blue hover:border-instinct/50'
            } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
        >
            <input
                type="radio"
                name="customer_type"
                value={value}
                checked={selected}
                disabled={disabled}
                onChange={() => onChange(value)}
                className="sr-only"
            />
            <span
                className={`flex size-5 items-center justify-center rounded border ${
                    selected
                        ? 'border-instinct bg-instinct text-white'
                        : 'border-deep-blue/25 bg-white'
                }`}
                aria-hidden
            >
                {selected && <Check className="size-3.5" />}
            </span>
            {label}
        </label>
    );
}

function CompanyRutField({
    value,
    error,
    disabled,
    onChange,
    action,
}: {
    value: string;
    error?: string;
    disabled: boolean;
    onChange: (value: string) => void;
    action?: React.ReactNode;
}) {
    return (
        <div>
            <label
                htmlFor="company-rut"
                className="text-sm font-extrabold text-deep-blue"
            >
                RUT empresa
            </label>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                <input
                    id="company-rut"
                    value={value}
                    onChange={(event) =>
                        onChange(formatRut(event.target.value))
                    }
                    placeholder="12.345.678-5"
                    disabled={disabled}
                    className={inputClasses(Boolean(error))}
                />
                {action}
            </div>
            <FieldError message={error} />
        </div>
    );
}

function LookupNotice({
    lookup,
    onContinueWithoutPlan,
}: {
    lookup: CompanyLookupResult;
    onContinueWithoutPlan: () => void;
}) {
    return (
        <div className="mt-5 rounded-2xl border border-instinct/25 bg-instinct-light p-5">
            {lookup.company.has_active_plan ? (
                <>
                    <p className="font-extrabold text-instinct-dark">
                        Cliente Animal Co-work encontrado
                    </p>
                    <p className="mt-2 text-sm text-deep-blue/70">
                        Plan {lookup.company.plan?.name}. Dispones de{' '}
                        {lookup.company.available_included_minutes / 60} horas
                        para salas este mes.
                    </p>
                </>
            ) : (
                <>
                    <p className="font-extrabold text-deep-blue">
                        No encontramos un plan activo de Animal Co-work asociado
                        a este RUT.
                    </p>
                    <p className="mt-2 text-sm leading-6 text-deep-blue/70">
                        Puedes revisar el RUT ingresado o continuar como cliente
                        sin plan utilizando la tarifa general.
                    </p>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onContinueWithoutPlan}
                        className="mt-4 h-11 justify-center px-5"
                    >
                        Continuar sin plan
                    </Button>
                </>
            )}
        </div>
    );
}

interface TextFieldProps {
    id: string;
    label: string;
    icon: typeof Building2;
    value: string;
    error?: string;
    type?: 'text' | 'email';
    disabled?: boolean;
    onChange: (value: string) => void;
}

function TextField({
    id,
    label,
    icon: Icon,
    value,
    error,
    type = 'text',
    disabled,
    onChange,
}: TextFieldProps) {
    return (
        <div>
            <label
                htmlFor={id}
                className="text-sm font-extrabold text-deep-blue"
            >
                {label}
            </label>
            <div className="relative mt-2">
                <Icon
                    className="absolute top-1/2 left-4 size-4 -translate-y-1/2 text-deep-blue/40"
                    aria-hidden
                />
                <input
                    id={id}
                    type={type}
                    value={value}
                    disabled={disabled}
                    onChange={(event) => onChange(event.target.value)}
                    className={`${inputClasses(Boolean(error))} pl-11`}
                />
            </div>
            <FieldError message={error} />
        </div>
    );
}

function LegalCheckbox({
    checked,
    error,
    disabled,
    onChange,
    children,
}: {
    checked: boolean;
    error?: string;
    disabled: boolean;
    onChange: (checked: boolean) => void;
    children: React.ReactNode;
}) {
    return (
        <label className="flex items-start gap-3 text-sm leading-6 text-deep-blue/75">
            <input
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={(event) => onChange(event.target.checked)}
                className="mt-1 size-4 accent-instinct"
            />
            <span>
                {children}
                <FieldError message={error} />
            </span>
        </label>
    );
}

function FieldError({ message }: { message?: string }) {
    return message ? (
        <p className="mt-2 text-sm font-semibold text-red-600">{message}</p>
    ) : null;
}

function inputClasses(hasError: boolean): string {
    return [
        'h-12 w-full rounded-xl border bg-white px-4 text-sm font-medium text-deep-blue outline-none transition',
        'disabled:cursor-not-allowed disabled:opacity-60',
        hasError
            ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100'
            : 'border-deep-blue/15 focus:border-instinct focus:ring-4 focus:ring-instinct/10',
    ].join(' ');
}

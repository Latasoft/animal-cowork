import { Building2, FileText, MapPin, UserRound } from 'lucide-react';
import type { ComponentType, FormEvent, ReactNode } from 'react';

import { Button } from '@/components/ui/button';

import type {
    ContractDataFormData,
    ContractDataFormErrors,
    SetContractDataFormData,
} from '@/types/checkout';

import { formatRut } from '@/utils/rut';

interface ContractDataFormProps {
    data: ContractDataFormData;
    setData: SetContractDataFormData;
    errors: ContractDataFormErrors;
    processing: boolean;
    showCompanyInProgress: boolean;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    onBack: () => void;
}

export function ContractDataForm({
    data,
    setData,
    errors,
    processing,
    showCompanyInProgress,
    onSubmit,
    onBack,
}: ContractDataFormProps) {
    function handleNaturalPersonChange(checked: boolean) {
        setData('is_natural_person', checked);

        setData('company_name', '');

        setData(
            'company_rut',
            checked ? formatRut(data.representative_rut) : '',
        );

        if (checked) {
            setData('company_in_progress', false);
        }
    }

    function handleRepresentativeRutChange(value: string) {
        const formattedRut = formatRut(value);

        setData('representative_rut', formattedRut);

        /**
         * Para persona natural el RUT del
         * contrato corresponde al mismo RUT
         * de la persona.
         */
        if (data.is_natural_person) {
            setData('company_rut', formattedRut);
        }
    }

    function handleCompanyRutChange(value: string) {
        setData('company_rut', formatRut(value));
    }

    function handleCompanyInProgressChange(checked: boolean) {
        setData('company_in_progress', checked);

        if (checked) {
            setData('company_rut', '');
        }
    }

    return (
        <form
            id="contract-data-form"
            onSubmit={onSubmit}
            className="mt-10"
            aria-busy={processing}
            noValidate
        >
            <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-full bg-deep-blue text-white">
                    <FileText
                        className="size-5"
                        strokeWidth={2.2}
                        aria-hidden
                    />
                </div>

                <div>
                    <p className="text-xs font-extrabold tracking-[0.14em] text-instinct-dark uppercase">
                        Paso 2
                    </p>

                    <h2 className="mt-1 text-3xl font-extrabold tracking-[-0.04em] text-deep-blue">
                        Datos para elaborar el contrato
                    </h2>
                </div>
            </div>

            <div className="mt-8 border border-deep-blue/10 bg-deep-blue/[0.025] p-5 sm:p-6">
                <label className="flex cursor-pointer items-start gap-4">
                    <input
                        type="checkbox"
                        name="is_natural_person"
                        checked={data.is_natural_person}
                        onChange={(event) =>
                            handleNaturalPersonChange(event.target.checked)
                        }
                        disabled={processing}
                        className="mt-1 size-5 shrink-0 cursor-pointer rounded border-deep-blue/25 accent-instinct focus:ring-instinct disabled:cursor-not-allowed"
                    />

                    <span>
                        <span className="block text-sm font-extrabold text-deep-blue">
                            Contratar como persona natural
                        </span>

                        <span className="mt-1 block text-sm leading-6 text-deep-blue/60">
                            Selecciona esta opción si realizarás el contrato
                            como persona natural con giro.
                        </span>
                    </span>
                </label>
            </div>

            {data.is_natural_person && (
                <div className="mt-5 border-l-4 border-instinct bg-instinct/7 px-5 py-4">
                    <p className="text-sm leading-6 text-deep-blue/70">
                        El contrato identificará directamente a la persona
                        natural mediante su nombre y RUT personal.
                    </p>
                </div>
            )}

            <div className="mt-8 space-y-10">
                <FormSection
                    icon={UserRound}
                    title={
                        data.is_natural_person
                            ? 'Datos personales'
                            : 'Representante legal'
                    }
                    description={
                        data.is_natural_person
                            ? 'Ingresa los datos de la persona que contratará el servicio.'
                            : 'Ingresa los datos personales del representante legal de la empresa.'
                    }
                >
                    <div className="grid gap-x-6 gap-y-6 md:grid-cols-2">
                        <FormField
                            label="Nombre completo"
                            name="representative_name"
                            value={data.representative_name}
                            onChange={(value) =>
                                setData('representative_name', value)
                            }
                            placeholder="Nombre y apellidos"
                            autoComplete="name"
                            error={errors.representative_name}
                            disabled={processing}
                        />

                        <FormField
                            label={
                                data.is_natural_person
                                    ? 'RUT persona natural'
                                    : 'RUT representante legal'
                            }
                            name="representative_rut"
                            value={data.representative_rut}
                            onChange={handleRepresentativeRutChange}
                            placeholder="12.345.678-9"
                            autoComplete="off"
                            inputMode="text"
                            maxLength={12}
                            error={errors.representative_rut}
                            disabled={processing}
                        />
                    </div>
                </FormSection>

                <FormSection
                    icon={MapPin}
                    title="Domicilio"
                    description="Estos datos se incorporan literalmente en la comparecencia del contrato."
                >
                    <div className="grid gap-x-6 gap-y-6 md:grid-cols-2">
                        <FormField
                            label="Dirección particular"
                            name="representative_address"
                            value={data.representative_address}
                            onChange={(value) =>
                                setData('representative_address', value)
                            }
                            placeholder="Calle, número y departamento si corresponde"
                            autoComplete="street-address"
                            error={errors.representative_address}
                            disabled={processing}
                            className="md:col-span-2"
                        />

                        <FormField
                            label="Comuna"
                            name="representative_commune"
                            value={data.representative_commune}
                            onChange={(value) =>
                                setData('representative_commune', value)
                            }
                            placeholder="Providencia"
                            autoComplete="address-level2"
                            error={errors.representative_commune}
                            disabled={processing}
                        />

                        <FormField
                            label="Región"
                            name="representative_region"
                            value={data.representative_region}
                            onChange={(value) =>
                                setData('representative_region', value)
                            }
                            placeholder="Metropolitana"
                            autoComplete="address-level1"
                            error={errors.representative_region}
                            disabled={processing}
                        />
                    </div>
                </FormSection>

                {!data.is_natural_person && (
                    <FormSection
                        icon={Building2}
                        title="Información de la empresa"
                        description="La razón social y el RUT aparecerán en el contrato de persona jurídica."
                    >
                        <div className="grid gap-x-6 gap-y-6 md:grid-cols-2">
                            <FormField
                                label="Razón social o nombre de la empresa"
                                name="company_name"
                                value={data.company_name}
                                onChange={(value) =>
                                    setData('company_name', value)
                                }
                                placeholder="Nombre de la empresa"
                                autoComplete="organization"
                                error={errors.company_name}
                                disabled={processing}
                            />

                            <FormField
                                label="RUT de la empresa"
                                name="company_rut"
                                value={data.company_rut}
                                onChange={handleCompanyRutChange}
                                placeholder="76.123.456-7"
                                autoComplete="off"
                                inputMode="text"
                                maxLength={12}
                                error={errors.company_rut}
                                disabled={
                                    processing || data.company_in_progress
                                }
                                required={!data.company_in_progress}
                            />
                        </div>

                        {showCompanyInProgress && (
                            <div className="mt-6 border border-instinct/20 bg-instinct/5 p-5">
                                <label className="flex cursor-pointer items-start gap-3">
                                    <input
                                        type="checkbox"
                                        name="company_in_progress"
                                        checked={data.company_in_progress}
                                        onChange={(event) =>
                                            handleCompanyInProgressChange(
                                                event.target.checked,
                                            )
                                        }
                                        disabled={processing}
                                        className="mt-1 size-5 shrink-0 cursor-pointer rounded border-deep-blue/25 accent-instinct focus:ring-instinct disabled:cursor-not-allowed"
                                    />

                                    <span>
                                        <span className="block text-sm font-extrabold text-deep-blue">
                                            Aún no tengo RUT de mi empresa
                                        </span>

                                        <span className="mt-1 block text-sm leading-6 text-deep-blue/60">
                                            Mi empresa se encuentra actualmente
                                            en proceso de constitución.
                                        </span>
                                    </span>
                                </label>
                            </div>
                        )}
                    </FormSection>
                )}
            </div>

            {data.company_in_progress && !data.is_natural_person && (
                <div className="mt-8 border-l-4 border-instinct bg-instinct/7 px-5 py-5">
                    <p className="text-sm leading-6 text-deep-blue/70">
                        Como tu empresa aún no cuenta con RUT, no avanzarás a la
                        previsualización del contrato. Un ejecutivo deberá
                        revisar estos antecedentes para continuar el proceso.
                    </p>
                </div>
            )}

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-deep-blue/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onBack}
                    disabled={processing}
                    className="h-12 justify-center px-7"
                >
                    Volver al pago
                </Button>

                <Button
                    type="submit"
                    disabled={processing}
                    className="h-12 justify-center px-7"
                >
                    {processing
                        ? 'Procesando...'
                        : data.company_in_progress && !data.is_natural_person
                          ? 'Enviar información'
                          : 'Continuar a previsualización'}
                </Button>
            </div>
        </form>
    );
}

interface FormSectionProps {
    icon: ComponentType<{
        className?: string;
        strokeWidth?: number;
        'aria-hidden'?: boolean;
    }>;
    title: string;
    description: string;
    children: ReactNode;
}

function FormSection({
    icon: Icon,
    title,
    description,
    children,
}: FormSectionProps) {
    return (
        <section>
            <div className="mb-6 flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-instinct/10 text-instinct-dark">
                    <Icon className="size-4" strokeWidth={2.2} aria-hidden />
                </div>

                <div>
                    <h3 className="text-xl font-extrabold text-deep-blue">
                        {title}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-deep-blue/55">
                        {description}
                    </p>
                </div>
            </div>

            {children}
        </section>
    );
}

interface FormFieldProps {
    label: string;
    name: string;
    value: string;
    onChange: (value: string) => void;
    type?: 'text';
    placeholder?: string;
    autoComplete?: string;
    inputMode?: 'text' | 'numeric';
    maxLength?: number;
    error?: string;
    disabled?: boolean;
    required?: boolean;
    helperText?: string;
    className?: string;
}

function FormField({
    label,
    name,
    value,
    onChange,
    type = 'text',
    placeholder,
    autoComplete,
    inputMode,
    maxLength,
    error,
    disabled = false,
    required = true,
    helperText,
    className = '',
}: FormFieldProps) {
    const errorId = `${name}-error`;
    const helperTextId = `${name}-helper`;

    const describedBy = [
        error ? errorId : null,
        helperText ? helperTextId : null,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={className}>
            <label
                htmlFor={name}
                className="mb-2 block text-sm font-extrabold text-deep-blue"
            >
                {label}

                {required && <span className="ml-1 text-instinct">*</span>}
            </label>

            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onInput={(event) => onChange(event.currentTarget.value)}
                placeholder={placeholder}
                autoComplete={autoComplete}
                inputMode={inputMode}
                maxLength={maxLength}
                disabled={disabled}
                required={required}
                aria-invalid={Boolean(error)}
                aria-describedby={describedBy || undefined}
                className={[
                    'h-12 w-full rounded-xl border px-4 text-sm font-medium text-deep-blue transition duration-200 outline-none',
                    'border-deep-blue/15 bg-white placeholder:text-deep-blue/35',
                    'hover:border-deep-blue/30',
                    'focus:border-instinct focus:ring-4 focus:ring-instinct/10',
                    disabled
                        ? 'cursor-not-allowed bg-deep-blue/5 text-deep-blue/40'
                        : '',
                    error
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                        : '',
                ].join(' ')}
            />

            {helperText && (
                <p
                    id={helperTextId}
                    className="mt-2 text-sm leading-5 text-deep-blue/55"
                >
                    {helperText}
                </p>
            )}

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

import { FileCheck2, } from 'lucide-react';
import { FormEvent } from 'react';
import type {
    CheckoutFormData,
} from '@/types/checkout';


export function CheckoutForm({
    data,
    setData,
    errors,
    processing,
    onSubmit,
}: CheckoutFormProps) {
    return (
        <form
            id="checkout-form"
            onSubmit={onSubmit}
            className="mt-10"
        >
            <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-full bg-deep-blue text-white">
                    <FileCheck2
                        className="size-5"
                        strokeWidth={2.2}
                        aria-hidden
                    />
                </div>

                <div>
                    <p className="text-xs font-extrabold tracking-[0.14em] text-instinct-dark uppercase">
                        Datos del contrato
                    </p>

                    <h2 className="mt-1 text-3xl font-extrabold tracking-[-0.04em] text-deep-blue">
                        Información del representante y la empresa
                    </h2>
                </div>
            </div>

            <div className="mt-8 grid gap-x-6 gap-y-6 md:grid-cols-2">
                <FormField
                    label="Nombre completo del representante legal"
                    name="representative_name"
                    value={data.representative_name}
                    onChange={(value) =>
                        setData('representative_name', value)
                    }
                    placeholder="Juan Pérez González"
                    autoComplete="name"
                    error={errors.representative_name}
                    disabled={processing}
                />

                <FormField
                    label="RUT del representante legal"
                    name="representative_rut"
                    value={data.representative_rut}
                    onChange={(value) =>
                        setData('representative_rut', value)
                    }
                    placeholder="12.345.678-9"
                    error={errors.representative_rut}
                    disabled={processing}
                />

                <FormField
                    label="Razón social o nombre de la empresa"
                    name="company_name"
                    value={data.company_name}
                    onChange={(value) => setData('company_name', value)}
                    placeholder="Empresa Ejemplo SpA"
                    autoComplete="organization"
                    error={errors.company_name}
                    disabled={processing}
                />

                <FormField
                    label="RUT de la empresa"
                    name="company_rut"
                    value={data.company_rut}
                    onChange={(value) => setData('company_rut', value)}
                    placeholder="77.123.456-7"
                    error={errors.company_rut}
                    disabled={processing}
                />

                <FormField
                    label="Correo electrónico"
                    name="representative_email"
                    type="email"
                    value={data.representative_email}
                    onChange={(value) =>
                        setData('representative_email', value)
                    }
                    placeholder="contacto@empresa.cl"
                    autoComplete="email"
                    error={errors.representative_email}
                    disabled={processing}
                />

                <FormField
                    label="Número de WhatsApp"
                    name="representative_whatsapp"
                    type="tel"
                    value={data.representative_whatsapp}
                    onChange={(value) =>
                        setData('representative_whatsapp', value)
                    }
                    placeholder="+56 9 9999 9999"
                    autoComplete="tel"
                    error={errors.representative_whatsapp}
                    disabled={processing}
                />

                <FormField
                    label="Dirección particular del representante legal"
                    name="representative_address"
                    value={data.representative_address}
                    onChange={(value) =>
                        setData('representative_address', value)
                    }
                    placeholder="Calle, número, comuna y región"
                    autoComplete="street-address"
                    error={errors.representative_address}
                    disabled={processing}
                    className="md:col-span-2"
                />
            </div>
        </form>
    );
}

interface CheckoutFormProps {
    data: CheckoutFormData;
    setData: <K extends keyof CheckoutFormData>(
        key: K,
        value: CheckoutFormData[K],
    ) => void;
    errors: Partial<Record<keyof CheckoutFormData, string>>;
    processing: boolean;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

function FormField({
    label,
    name,
    value,
    onChange,
    placeholder,
    type = 'text',
    autoComplete,
    error,
    disabled = false,
    className = '',
}: FormFieldProps) {
    const errorId = `${name}-error`;

    return (
        <div className={className}>
            <label
                htmlFor={name}
                className="mb-2 block text-sm font-extrabold text-deep-blue"
            >
                {label}

                <span className="ml-1 text-instinct">*</span>
            </label>

            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                autoComplete={autoComplete}
                disabled={disabled}
                required
                aria-invalid={Boolean(error)}
                aria-describedby={error ? errorId : undefined}
                className={[
                    'h-12 w-full rounded-xl border bg-white px-4 text-sm font-medium text-deep-blue outline-none transition duration-200',
                    'border-deep-blue/15 placeholder:text-deep-blue/35',
                    'hover:border-deep-blue/30',
                    'focus:border-instinct focus:ring-4 focus:ring-instinct/10',
                    'disabled:cursor-not-allowed disabled:bg-deep-blue/3 disabled:opacity-60',
                    error
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                        : '',
                ].join(' ')}
            />

            {error && (
                <p
                    id={errorId}
                    className="mt-2 text-sm font-semibold text-red-600"
                >
                    {error}
                </p>
            )}
        </div>
    );
}

interface FormFieldProps {
    label: string;
    name: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: 'text' | 'email' | 'tel';
    autoComplete?: string;
    error?: string;
    disabled?: boolean;
    className?: string;
}
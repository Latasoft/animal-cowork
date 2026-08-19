import { FileCheck2 } from 'lucide-react';
import type { ComponentProps } from 'react';

import type { CheckoutFormData } from '@/types/checkout';

type CheckoutContactField =
    | 'representative_email'
    | 'representative_whatsapp';

type FormSubmitHandler = NonNullable<
    ComponentProps<'form'>['onSubmit']
>;

interface CheckoutFormProps {
    data: CheckoutFormData;
    setData: (
        key: CheckoutContactField,
        value: string,
    ) => void;
    errors: Partial<
        Record<keyof CheckoutFormData, string>
    >;
    processing: boolean;
    onSubmit: FormSubmitHandler;
}

interface FormFieldProps {
    label: string;
    name: CheckoutContactField;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: 'text' | 'email' | 'tel';
    autoComplete?: string;
    inputMode?: 'text' | 'email' | 'tel';
    error?: string;
    disabled?: boolean;
    className?: string;
}

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
            noValidate
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
                        Datos
                    </p>

                    <h2 className="mt-1 text-3xl font-extrabold tracking-[-0.04em] text-deep-blue">
                        Completa los datos
                    </h2>
                </div>
            </div>

            <div className="mt-8 grid gap-x-6 gap-y-6 md:grid-cols-2">
                <FormField
                    label="Correo electrónico"
                    name="representative_email"
                    type="email"
                    inputMode="email"
                    value={data.representative_email}
                    onChange={(value) =>
                        setData(
                            'representative_email',
                            value,
                        )
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
                    inputMode="tel"
                    value={data.representative_whatsapp}
                    onChange={(value) =>
                        setData(
                            'representative_whatsapp',
                            value,
                        )
                    }
                    placeholder="+56 9 1234 5678"
                    autoComplete="tel"
                    error={errors.representative_whatsapp}
                    disabled={processing}
                />
            </div>
        </form>
    );
}

function FormField({
    label,
    name,
    value,
    onChange,
    placeholder,
    type = 'text',
    autoComplete,
    inputMode,
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

                <span className="ml-1 text-instinct">
                    *
                </span>
            </label>

            <input
                id={name}
                name={name}
                type={type}
                inputMode={inputMode}
                value={value}
                onChange={(event) =>
                    onChange(event.target.value)
                }
                placeholder={placeholder}
                autoComplete={autoComplete}
                disabled={disabled}
                required
                aria-invalid={error ? true : undefined}
                aria-describedby={
                    error ? errorId : undefined
                }
                className={[
                    'h-12 w-full rounded-xl border bg-white px-4 text-sm font-medium text-deep-blue outline-none transition duration-200',
                    'placeholder:text-deep-blue/35',
                    'hover:border-deep-blue/30',
                    'focus:ring-4',
                    'disabled:cursor-not-allowed disabled:bg-deep-blue/3 disabled:opacity-60',
                    error
                        ? 'border-red-400 focus:border-red-500 focus:ring-red-100'
                        : 'border-deep-blue/15 focus:border-instinct focus:ring-instinct/10',
                ].join(' ')}
            />

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

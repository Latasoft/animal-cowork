import { useForm } from '@inertiajs/react';
import { useId, useState } from 'react';
import { Button } from '@/components/ui/button';
import { service as payForService } from '@/routes/payments';

export function ServicePaymentForm({
    type,
    slug,
    amount,
}: {
    type: 'patent' | 'formation';
    slug: string;
    amount: number;
}) {
    const [open, setOpen] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [acceptDataPolicy, setAcceptDataPolicy] = useState(false);
    const id = useId();
    const form = useForm({ email: '', phone: '' });
    const errors = form.errors as Record<string, string>;
    const canContinue = acceptTerms && acceptDataPolicy;

    if (!open) {
        return (
            <Button onClick={() => setOpen(true)}>
                Pagar{' '}
                {new Intl.NumberFormat('es-CL', {
                    style: 'currency',
                    currency: 'CLP',
                }).format(amount)}
            </Button>
        );
    }

    return (
        <form
            className="grid max-w-md gap-4 rounded-xl border border-deep-blue/10 bg-white p-5 text-deep-blue"
            onSubmit={(event) => {
                event.preventDefault();
                if (!canContinue) {
                    return;
                }
                form.submit(payForService({ type, slug }));
            }}
        >
            <p className="font-bold">Datos de contacto</p>
            <label htmlFor={id + '-email'}>Correo electrónico</label>
            <input
                id={id + '-email'}
                className="rounded-md border border-deep-blue/20 px-3 py-2"
                type="email"
                autoComplete="email"
                required
                maxLength={150}
                value={form.data.email}
                onChange={(event) => form.setData('email', event.target.value)}
                aria-invalid={Boolean(errors.email)}
            />
            {errors.email && (
                <p role="alert" className="text-sm text-red-700">
                    {errors.email}
                </p>
            )}
            <label htmlFor={id + '-phone'}>Teléfono / WhatsApp</label>
            <input
                id={id + '-phone'}
                className="rounded-md border border-deep-blue/20 px-3 py-2"
                type="tel"
                autoComplete="tel"
                required
                placeholder="+56 9 1234 5678"
                value={form.data.phone}
                onChange={(event) => form.setData('phone', event.target.value)}
                aria-invalid={Boolean(errors.phone)}
            />
            {errors.phone && (
                <p role="alert" className="text-sm text-red-700">
                    {errors.phone}
                </p>
            )}

            <label
                htmlFor={id + '-terms'}
                className="flex items-start gap-3 text-sm leading-6 text-deep-blue/80"
            >
                <input
                    id={id + '-terms'}
                    type="checkbox"
                    className="mt-1 size-4 shrink-0 accent-instinct"
                    checked={acceptTerms}
                    onChange={(event) => setAcceptTerms(event.target.checked)}
                />
                <span>
                    He leído y acepto los{' '}
                    
                        href="/terminos-y-condiciones"
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-instinct-dark underline"
                    >
                        Términos y Condiciones
                    </a>{' '}
                    del servicio.
                </span>
            </label>

            <label
                htmlFor={id + '-privacy'}
                className="flex items-start gap-3 text-sm leading-6 text-deep-blue/80"
            >
                <input
                    id={id + '-privacy'}
                    type="checkbox"
                    className="mt-1 size-4 shrink-0 accent-instinct"
                    checked={acceptDataPolicy}
                    onChange={(event) =>
                        setAcceptDataPolicy(event.target.checked)
                    }
                />
                <span>
                    He leído y acepto la{' '}
                    
                        href="/politica-de-privacidad"
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-instinct-dark underline"
                    >
                        Política de Privacidad
                    </a>{' '}
                    y autorizo el tratamiento de mis datos personales conforme a
                    la Ley N.° 21.719.
                </span>
            </label>

            {errors.payment && (
                <p role="alert" className="text-sm text-red-700">
                    {errors.payment}
                </p>
            )}
            <p className="text-sm text-muted">
                Después del pago, nuestro equipo te contactará para gestionar tu
                solicitud.
            </p>
            {!canContinue && (
                <p className="text-xs text-deep-blue/60">
                    Debes aceptar los Términos y Condiciones y la Política de
                    Privacidad para continuar.
                </p>
            )}
            <Button type="submit" disabled={form.processing || !canContinue}>
                {form.processing ? 'Preparando pago…' : 'Continuar a Webpay'}
            </Button>
        </form>
    );
}

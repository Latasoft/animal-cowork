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
    const id = useId();
    const form = useForm({ email: '', phone: '' });
    const errors = form.errors as Record<string, string>;

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
            {errors.payment && (
                <p role="alert" className="text-sm text-red-700">
                    {errors.payment}
                </p>
            )}
            <p className="text-sm text-muted">
                Después del pago, nuestro equipo te contactará para gestionar tu
                solicitud.
            </p>
            <Button type="submit" disabled={form.processing}>
                {form.processing ? 'Preparando pago…' : 'Continuar a Webpay'}
            </Button>
        </form>
    );
}

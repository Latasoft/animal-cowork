import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { PublicLayout } from '@/layouts/public-layout';
import { home } from '@/routes';
import { retry, status } from '@/routes/payments';

interface Props {
    payment: {
        id: string;
        status: string;
        amount: number;
        reference: string;
        requiresReview: boolean;
    };
    continuationUrl: string | null;
}

export default function PaymentResult({ payment, continuationUrl }: Props) {
    const form = useForm({});
    const pending = ['pending', 'verifying'].includes(payment.status);
    const messages: Record<string, string> = {
        paid: 'Pago realizado correctamente.',
        failed: 'No fue posible completar el pago.',
        cancelled: 'El pago fue cancelado.',
        expired: 'El tiempo para completar el pago terminó.',
    };

    return (
        <PublicLayout>
            <Head title="Resultado de tu pago">
                <meta name="referrer" content="no-referrer" />
            </Head>
            <Container>
                <section
                    className="mx-auto my-16 grid max-w-xl gap-6 rounded-xl border border-deep-blue/10 bg-white p-8 text-deep-blue"
                    aria-live="polite"
                >
                    <h1 className="text-3xl font-bold">
                        {messages[payment.status] ??
                            'Estamos verificando el estado de tu pago.'}
                    </h1>
                    <p>
                        {new Intl.NumberFormat('es-CL', {
                            style: 'currency',
                            currency: 'CLP',
                        }).format(payment.amount)}
                    </p>
                    <p className="text-sm text-muted">
                        Referencia: {payment.reference}
                    </p>
                    {payment.requiresReview && (
                        <p>
                            Recibimos tu pago. Nuestro equipo debe revisar tu
                            solicitud y se contactará contigo para confirmar los
                            siguientes pasos.
                        </p>
                    )}
                    {pending && (
                        <>
                            <p>
                                Evita iniciar otro pago mientras verificamos
                                esta operación.
                            </p>
                            <Button
                                disabled={form.processing}
                                onClick={() => form.submit(status(payment.id))}
                            >
                                Consultar estado
                            </Button>
                        </>
                    )}
                    {continuationUrl && (
                        <Link
                            className="font-semibold text-instinct underline"
                            href={continuationUrl}
                        >
                            Continuar con los datos del contrato
                        </Link>
                    )}
                    {['failed', 'cancelled', 'expired'].includes(
                        payment.status,
                    ) && (
                        <Button
                            disabled={form.processing}
                            onClick={() => form.submit(retry(payment.id))}
                        >
                            Volver a intentar
                        </Button>
                    )}
                    <Link href={home()} className="text-sm underline">
                        Volver al inicio
                    </Link>
                </section>
            </Container>
        </PublicLayout>
    );
}

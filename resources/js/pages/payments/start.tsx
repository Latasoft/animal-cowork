import { Head, router, useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { PublicLayout } from '@/layouts/public-layout';
import { retry } from '@/routes/payments';

export default function PaymentStart({ paymentId, canRetry }: { paymentId: string; canRetry: boolean }) {
    const form = useForm({});
    useEffect(() => {
        if (canRetry) return;
        const timer = window.setInterval(() => router.reload(), 3000);
        return () => window.clearInterval(timer);
    }, [canRetry]);
    return (
        <PublicLayout>
            <Head title="Continuar a Webpay" />
            <Container>
                <section className="mx-auto my-16 grid max-w-xl gap-6 rounded-xl border border-deep-blue/10 bg-white p-8 text-deep-blue">
                    <h1 className="text-3xl font-bold">{canRetry ? 'No pudimos iniciar Webpay' : 'Estamos preparando tu acceso a Webpay'}</h1>
                    {canRetry ? <>
                        <p>No recibimos los datos necesarios para abrir el sitio de pago. Vuelve a revisar tu solicitud e inicia un nuevo intento.</p>
                        <Button disabled={form.processing} onClick={() => form.submit(retry(paymentId))}>Volver a mi solicitud</Button>
                    </> : <p>Serás dirigido automáticamente al sitio de pago cuando esté listo.</p>}
                </section>
            </Container>
        </PublicLayout>
    );
}

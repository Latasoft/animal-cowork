import { Head } from '@inertiajs/react';
import { AlertTriangle } from 'lucide-react';

import { Footer } from '@/components/layout/footer';
import { ButtonArrow } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { PublicLayout } from '@/layouts/public-layout';
import { home } from '@/routes';

interface ErrorPageProps {
    status: number;
}

const messages: Record<number, { title: string; description: string }> = {
    403: {
        title: 'No tienes acceso a esta sección',
        description: 'Revisa tu sesión o vuelve al inicio para continuar.',
    },
    404: {
        title: 'No encontramos esta página',
        description:
            'Es posible que el enlace haya cambiado o ya no esté disponible.',
    },
    500: {
        title: 'Tuvimos un problema inesperado',
        description:
            'Nuestro equipo ya puede revisar el error. Intenta nuevamente más tarde.',
    },
    503: {
        title: 'El servicio no está disponible temporalmente',
        description:
            'Estamos trabajando para restablecerlo. Intenta nuevamente en unos minutos.',
    },
};

export default function ErrorPage({ status }: ErrorPageProps) {
    const message = messages[status] ?? messages[500];

    return (
        <PublicLayout>
            <Head title={message.title} />

            <section className="flex min-h-[70vh] items-center bg-background py-16">
                <Container>
                    <div className="mx-auto max-w-2xl rounded-card border border-deep-blue/10 bg-white p-8 text-center shadow-card sm:p-12">
                        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                            <AlertTriangle className="size-7" aria-hidden />
                        </span>

                        <p className="mt-6 text-sm font-extrabold tracking-[0.16em] text-instinct-dark uppercase">
                            Error {status}
                        </p>
                        <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-deep-blue sm:text-4xl">
                            {message.title}
                        </h1>
                        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-deep-blue/65">
                            {message.description}
                        </p>

                        <ButtonArrow href={home.url()} className="mt-8">
                            VOLVER AL INICIO
                        </ButtonArrow>
                    </div>
                </Container>
            </section>

            <Footer />
        </PublicLayout>
    );
}

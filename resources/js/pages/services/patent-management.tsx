import { Head } from '@inertiajs/react';
import {
    FileCheck2,
    Scale,
    ShieldCheck,
} from 'lucide-react';

import { Footer } from '@/components/layout/footer';
import { ButtonArrow } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { patentManagementContent } from '@/data/patent-management';
import { PublicLayout } from '@/layouts/public-layout';

const content = patentManagementContent;

export default function PatentManagement() {
    return (
        <>
            <Head title="Gestión de Patente Comercial">
                <meta
                    name="description"
                    content="Gestión de patente comercial de oficina virtual ante la Municipalidad de Providencia para clientes de Animal Co-work."
                />
            </Head>

            <PublicLayout>
                {/* Hero */}
                <section className="relative overflow-hidden bg-white">
                    <Container>
                        <div className="grid items-center gap-10 py-12 lg:grid-cols-2 lg:gap-16 lg:py-20">
                            <div>
                                <p className="text-sm font-extrabold tracking-[0.16em] text-instinct uppercase">
                                    {content.eyebrow}
                                </p>

                                <h1 className="mt-4 max-w-3xl text-[clamp(2.5rem,7vw,2.75rem)] leading-[0.95] font-extrabold tracking-[-0.055em] text-balance text-deep-blue uppercase">
                                    {content.title}
                                </h1>

                                <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
                                    {content.description}
                                </p>

                                <p className="mt-6 text-5xl font-extrabold tracking-[-0.05em] text-instinct sm:text-5xl">
                                    {content.servicePrice}
                                </p>

                                <p className="mt-4 text-sm leading-6 text-deep-blue/70">
                                    {content.exclusiveNotice}
                                </p>

                                <div className="mt-8">
                                    <ButtonArrow
                                        href={content.primaryAction.href}
                                        className="w-full sm:w-auto"
                                    >
                                        {content.primaryAction.label}
                                    </ButtonArrow>
                                </div>
                            </div>

                            <ServiceImage />
                        </div>
                    </Container>
                </section>

{/* Información del servicio */}
<section className="bg-background py-12 sm:py-16 lg:py-20">
    <Container>
        <div className="mx-auto max-w-6xl">
            <div className="overflow-hidden rounded-card border border-deep-blue/10 bg-white shadow-card">

                {/* Qué gestionamos */}
                <article className="grid gap-6 p-7 sm:p-9 lg:grid-cols-[auto_1fr] lg:items-start lg:gap-8">
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-instinct-light text-instinct-dark">
                        <FileCheck2
                            className="size-7"
                            strokeWidth={2}
                            aria-hidden="true"
                        />
                    </div>

                    <div>
                        <p className="text-xs font-extrabold tracking-[0.16em] text-instinct-dark uppercase">
                            Servicio
                        </p>

                        <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.04em] text-deep-blue sm:text-3xl">
                            {content.serviceSectionTitle}
                        </h2>

                        <p className="mt-4 max-w-4xl text-base leading-7 text-muted sm:text-lg">
                            {content.serviceSectionDescription}
                        </p>
                    </div>
                </article>

                {/* Separador */}
                <div className="mx-7 border-t border-deep-blue/10 sm:mx-9" />

                {/* Importancia legal */}
                <article className="grid gap-6 bg-white p-7 sm:p-9 lg:grid-cols-[auto_1fr] lg:items-start lg:gap-8">
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white text-instinct-dark shadow-sm">
                        <Scale
                            className="size-7"
                            strokeWidth={2}
                            aria-hidden="true"
                        />
                    </div>

                    <div>
                        <p className="text-xs font-extrabold tracking-[0.16em] text-instinct-dark uppercase">
                            Importancia legal
                        </p>

                        <p className="mt-3 max-w-4xl text-lg leading-8 font-bold text-deep-blue sm:text-xl sm:leading-9">
                            {content.legalNotice}
                        </p>
                    </div>
                </article>

                {/* Separador */}
                <div className="mx-7 border-t border-deep-blue/10 sm:mx-9" />

                {/* Derecho de aseo */}
                <article className="grid gap-6 p-7 sm:p-9 lg:grid-cols-[auto_1fr] lg:items-start lg:gap-8">
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-deep-blue/5 text-deep-blue">
                        <ShieldCheck
                            className="size-7"
                            strokeWidth={2}
                            aria-hidden="true"
                        />
                    </div>

                    <div>
                        <p className="text-xs font-extrabold tracking-[0.16em] text-energy-blue uppercase">
                            Beneficio
                        </p>

                        <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.04em] text-deep-blue sm:text-3xl">
                            Libre de cobro por derecho de aseo
                        </h2>

                        <p className="mt-4 max-w-4xl text-base leading-7 text-muted sm:text-lg">
                            {content.municipalPaymentDetail}
                        </p>
                    </div>
                </article>

            </div>
        </div>
    </Container>
</section>

                <Footer />
            </PublicLayout>
        </>
    );
}

function ServiceImage() {
    return (
        <img
            src="/images/plans/service.jpg"
            alt="Gestión de patente comercial de oficina virtual"
            className="aspect-[4/3] w-full rounded-card object-cover shadow-card"
            loading="lazy"
        />
    );
}

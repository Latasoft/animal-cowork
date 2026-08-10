import { Head } from '@inertiajs/react';
import {
    FileCheck2,
    ImageIcon,
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
                            <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr]">
                                {/* Qué gestionamos */}
                                <article className="rounded-card border border-deep-blue/10 bg-white p-7 shadow-card sm:p-9">
                                    <div className="flex size-14 items-center justify-center rounded-2xl bg-instinct-light text-instinct-dark">
                                        <FileCheck2
                                            className="size-7"
                                            strokeWidth={2}
                                            aria-hidden="true"
                                        />
                                    </div>

                                    <h2 className="mt-6 text-3xl font-extrabold tracking-[-0.04em] text-deep-blue sm:text-4xl">
                                        {content.serviceSectionTitle}
                                    </h2>

                                    <p className="mt-4 text-base leading-7 text-muted sm:text-lg">
                                        {content.serviceSectionDescription}
                                    </p>
                                </article>

                                {/* Importancia legal */}
                                <article className="rounded-card border border-instinct/40 bg-instinct-light p-7 sm:p-9">
                                    <div className="flex items-center gap-3">
                                        <Scale
                                            className="size-8 shrink-0 text-instinct-dark"
                                            strokeWidth={2}
                                            aria-hidden="true"
                                        />

                                        <h2 className="text-sm font-extrabold tracking-[0.16em] text-instinct-dark uppercase">
                                            Importancia legal
                                        </h2>
                                    </div>

                                    <p className="mt-6 text-xl leading-8 font-bold text-deep-blue sm:text-2xl sm:leading-9">
                                        {content.legalNotice}
                                    </p>
                                </article>

                                {/* Información municipal secundaria */}
                                <article className="rounded-card border border-deep-blue/10 bg-white p-7 shadow-card sm:p-9 lg:col-span-2">
                                    <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
                                        {/* Valor */}
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-energy-blue/10 text-energy-blue">
                                                    <ShieldCheck
                                                        className="size-6"
                                                        strokeWidth={2}
                                                        aria-hidden="true"
                                                    />
                                                </div>

                                                <div>
                                                    <p className="text-xs font-extrabold tracking-[0.14em] text-energy-blue uppercase">
                                                         Libre de cobro
                                                    </p>

                                                    <h3 className="mt-1 text-xl font-extrabold text-deep-blue">
                                                        {
                                                            content.municipalPaymentTitle
                                                        }
                                                    </h3>
                                                </div>
                                            </div>

                                            <p className="mt-6 text-4xl font-extrabold tracking-[-0.05em] text-deep-blue sm:text-5xl">
                                                {
                                                    content.municipalPaymentAmount
                                                }
                                            </p>

                                            <p className="mt-2 text-lg font-bold text-energy-blue">
                                                {
                                                    content.municipalPaymentFrequency
                                                }
                                            </p>
                                        </div>

                                        {/* Detalle */}
                                        <div className="border-t border-deep-blue/10 pt-7 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
                                            <p className="text-base leading-7 text-muted">
                                                {
                                                    content.municipalPaymentDetail
                                                }
                                            </p>
                                        </div>
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
    if (content.image.src) {
        return (
            <img
                src={content.image.src}
                alt={content.image.alt}
                className="aspect-[4/3] w-full rounded-card object-cover shadow-card"
            />
        );
    }

    return (
        <div className="flex aspect-[4/3] min-h-72 items-center justify-center rounded-card border border-dashed border-deep-blue/25 bg-deep-blue/5 p-8 text-center">
            <div>
                <span className="mx-auto flex size-20 items-center justify-center rounded-full bg-white text-instinct shadow-card">
                    <ImageIcon
                        className="size-9"
                        strokeWidth={1.8}
                        aria-hidden="true"
                    />
                </span>

                <p className="mt-5 text-sm font-extrabold tracking-[0.12em] text-deep-blue uppercase">
                    Imagen del servicio
                </p>
            </div>
        </div>
    );
}
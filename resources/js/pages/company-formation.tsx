import { Head } from '@inertiajs/react';
import {
    BadgeCheck,
    CheckCircle2,
    FileCheck2,
    IdCard,
    ImageIcon,
    Mail,
    MessageCircle,
    ReceiptText,
    ShieldCheck,
} from 'lucide-react';

import { Footer } from '@/components/layout/footer';
import { ButtonArrow } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { companyFormationContent } from '@/data/company-formation';
import { PublicLayout } from '@/layouts/public-layout';

const content = companyFormationContent;

/**
 * Temporal mientras no exista la integración real
 * con la pasarela de pagos.
 *
 * Posteriormente este valor debería provenir
 * desde Laravel / CMS / backend.
 */
const paymentHref = '#';

function formatClp(value: number): string {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        maximumFractionDigits: 0,
    }).format(value);
}

export default function CompanyFormation() {
    return (
        <>
            <Head title="Constitución de Empresa + Oficina Virtual">
                <meta
                    name="description"
                    content="Constitución de empresa, inicio de actividades ante el SII y Oficina Virtual Animal Co-work por 2 años."
                />
            </Head>

            <PublicLayout>
                {/* =========================================================
                 * HERO
                 * ======================================================= */}
                <section className="relative overflow-hidden bg-white">
                    <Container>
                        <div className="grid items-center gap-10 py-12 lg:grid-cols-2 lg:gap-16 lg:py-16">
                            <div>
                                <p className="text-sm font-extrabold tracking-[0.16em] text-instinct uppercase">
                                    {content.eyebrow}
                                </p>

                                <h1 className="mt-4 max-w-3xl text-[clamp(2.4rem,6vw,2.5rem)] leading-[0.95] font-extrabold tracking-[-0.055em] text-balance text-deep-blue uppercase">
                                    {content.title}
                                </h1>

                                <p className="mt-6 max-w-2xl text-base leading-7 text-muted sm:text-lg">
                                    {content.description}
                                </p>

                                <div className="mt-7 flex flex-wrap items-end gap-x-3 gap-y-1">
                                    <span className="text-sm font-extrabold tracking-[0.12em] text-deep-blue/50 uppercase">
                                        Paquete completo
                                    </span>

                                    <div className="w-full" />

                                    <span className="text-4xl font-extrabold tracking-[-0.05em] text-instinct sm:text-5xl">
                                        {formatClp(content.totalPrice)}
                                    </span>

                                    <span className="pb-1 text-sm font-bold text-deep-blue/55">
                                        total
                                    </span>
                                </div>

                                <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
                                    Constitución e inicio de actividades +
                                    Oficina Virtual Animal Co-work por 2 años.
                                </p>

                                <div className="mt-8">
                                    <ButtonArrow
                                        href="#contratar"
                                        className="w-full sm:w-auto"
                                    >
                                        CONTRATAR AHORA
                                    </ButtonArrow>
                                </div>
                            </div>

                            <ServiceImage />
                        </div>
                    </Container>
                </section>

                {/* =========================================================
                 * RESUMEN DEL SERVICIO
                 * ======================================================= */}
                <section className="bg-background py-10 sm:py-12 lg:py-14">
                    <Container>
                        <div className="mx-auto max-w-6xl">
                            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                                {/* Información principal */}
                                <article className="rounded-card border border-deep-blue/10 bg-white p-6 shadow-card sm:p-8">
                                    <div className="flex items-start gap-4">
                                        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-instinct-light text-instinct-dark">
                                            <FileCheck2
                                                className="size-5"
                                                strokeWidth={2}
                                                aria-hidden
                                            />
                                        </span>

                                        <div>
                                            <p className="text-xs font-extrabold tracking-[0.14em] text-instinct-dark uppercase">
                                                Servicio completo
                                            </p>

                                            <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.035em] text-deep-blue sm:text-3xl">
                                                Todo lo que necesitas para
                                                comenzar tu empresa
                                            </h2>

                                            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">
                                                Constituye tu empresa, realiza
                                                el inicio de actividades ante el
                                                SII y obtén tu Oficina Virtual
                                                Animal Co-work por 2 años.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Qué incluye */}
                                    <div className="mt-6 border-t border-deep-blue/8 pt-6">
                                        <p className="text-sm font-extrabold text-deep-blue">
                                            ¿Qué incluye?
                                        </p>

                                        <div className="mt-4 grid gap-x-5 gap-y-3 sm:grid-cols-2">
                                            {content.includedServices.items.map(
                                                (item) => (
                                                    <div
                                                        key={item}
                                                        className="flex items-start gap-2 text-sm leading-5 text-deep-blue/70"
                                                    >
                                                        <CheckCircle2
                                                            className="mt-0.5 size-4 shrink-0 text-instinct"
                                                            strokeWidth={2.3}
                                                            aria-hidden
                                                        />

                                                        <span>{item}</span>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>

                                    {/* Servicio externo */}
                                    <div className="mt-6 flex items-start gap-3 rounded-xl bg-energy-blue/5 p-4">
                                        <ShieldCheck
                                            className="mt-0.5 size-5 shrink-0 text-energy-blue"
                                            strokeWidth={2}
                                            aria-hidden
                                        />

                                        <p className="text-sm leading-6 text-deep-blue/65">
                                            La constitución, inicio de
                                            actividades, verificación de
                                            actividades y activación del proceso
                                            de facturación corresponden a un{' '}
                                            <strong className="font-extrabold text-deep-blue">
                                                servicio externo
                                            </strong>{' '}
                                            con precio convenio para clientes
                                            Animal Co-work.
                                        </p>
                                    </div>
                                </article>

                                {/* Requisitos + precio */}
                                <article className="rounded-card bg-deep-blue p-6 text-white shadow-card sm:p-8">
                                    <div className="flex items-center gap-3">
                                        <IdCard
                                            className="size-6 text-instinct"
                                            strokeWidth={2}
                                            aria-hidden
                                        />

                                        <p className="text-xs font-extrabold tracking-[0.14em] text-instinct uppercase">
                                            Requisitos
                                        </p>
                                    </div>

                                    <h3 className="mt-4 text-xl font-extrabold tracking-[-0.025em] sm:text-2xl">
                                        Para comenzar necesitas
                                    </h3>

                                    <div className="mt-5 space-y-3">
                                        {content.serviceSection.requirements.map(
                                            (requirement) => (
                                                <div
                                                    key={requirement}
                                                    className="flex items-start gap-2"
                                                >
                                                    <CheckCircle2
                                                        className="mt-0.5 size-4 shrink-0 text-instinct"
                                                        strokeWidth={2.3}
                                                        aria-hidden
                                                    />

                                                    <p className="text-sm leading-5 text-white/70">
                                                        {requirement}
                                                    </p>
                                                </div>
                                            ),
                                        )}
                                    </div>

                                    <div className="mt-5 border-t border-white/10 pt-5">
                                        <p className="text-xs font-extrabold tracking-[0.12em] text-white/45 uppercase">
                                            Personas extranjeras
                                        </p>

                                        <p className="mt-2 text-xs leading-5 text-white/55">
                                            {
                                                content.serviceSection
                                                    .foreignerNotice
                                            }
                                        </p>
                                    </div>

                                    {/* Precio compacto */}
                                    <div className="mt-6 border-t border-white/10 pt-5">
                                        <div className="flex items-center justify-between gap-4">
                                            <div>
                                                <p className="text-xs font-bold text-white/45">
                                                    Constitución + Inicio SII
                                                </p>

                                                <p className="mt-1 font-extrabold">
                                                    {formatClp(
                                                        content.externalService
                                                            .price,
                                                    )}
                                                </p>
                                            </div>

                                            <span className="text-xl font-extrabold text-white/30">
                                                +
                                            </span>

                                            <div className="text-right">
                                                <p className="text-xs font-bold text-white/45">
                                                    Oficina Virtual · 2 años
                                                </p>

                                                <p className="mt-1 font-extrabold">
                                                    {formatClp(
                                                        content.virtualOffice
                                                            .price,
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-5 flex items-end justify-between gap-4 border-t border-white/10 pt-5">
                                            <span className="text-sm font-extrabold">
                                                Total
                                            </span>

                                            <span className="text-3xl font-extrabold tracking-[-0.045em] text-instinct">
                                                {formatClp(content.totalPrice)}
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            </div>
                        </div>
                    </Container>
                </section>

                {/* =========================================================
                 * CTA / PAGO
                 * ======================================================= */}
                <section
                    id="contratar"
                    className="scroll-mt-28 bg-white py-10 sm:py-12 lg:py-14"
                >
                    <Container>
                        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-card bg-deep-blue shadow-card lg:grid-cols-[1fr_0.8fr]">
                            {/* CTA principal */}
                            <div className="p-7 text-white sm:p-9 lg:p-10">
                                <div className="flex items-center gap-3">
                                    <BadgeCheck
                                        className="size-7 text-instinct"
                                        strokeWidth={2}
                                        aria-hidden
                                    />

                                    <p className="text-xs font-extrabold tracking-[0.14em] text-instinct uppercase">
                                        Precio exclusivo Animal Co-work
                                    </p>
                                </div>

                                <h2 className="mt-5 max-w-2xl text-3xl font-extrabold tracking-[-0.045em] sm:text-4xl">
                                    Comienza hoy la constitución de tu empresa
                                </h2>

                                <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">
                                    Contrata Constitución de Empresa + Inicio de
                                    Actividades junto con tu Oficina Virtual
                                    Animal Co-work por 2 años.
                                </p>

                                <div className="mt-7 flex flex-wrap items-end gap-x-3">
                                    <span className="text-5xl font-extrabold tracking-[-0.055em] text-instinct sm:text-6xl">
                                        {formatClp(content.totalPrice)}
                                    </span>

                                    <span className="pb-2 text-sm font-bold text-white/55">
                                        total paquete
                                    </span>
                                </div>

                                <div className="mt-7 max-w-md">
                                    <ButtonArrow
                                        href={paymentHref}
                                        className="w-full justify-center sm:w-auto"
                                    >
                                        PAGAR {formatClp(content.totalPrice)}
                                    </ButtonArrow>
                                </div>
                            </div>

                            {/* Resumen */}
                            <div className="border-t border-white/10 bg-white/[0.06] p-7 sm:p-9 lg:border-t-0 lg:border-l lg:p-10">
                                <p className="text-xs font-extrabold tracking-[0.14em] text-white/55 uppercase">
                                    Resumen
                                </p>

                                <div className="mt-6 space-y-5">
                                    <CheckoutSummaryItem
                                        label="Constitución + Inicio SII"
                                        value={formatClp(
                                            content.externalService.price,
                                        )}
                                    />

                                    <CheckoutSummaryItem
                                        label={`Oficina Virtual · ${content.virtualOffice.duration}`}
                                        value={formatClp(
                                            content.virtualOffice.price,
                                        )}
                                    />

                                    <div className="border-t border-white/15 pt-5">
                                        <CheckoutSummaryItem
                                            label="Total"
                                            value={formatClp(content.totalPrice)}
                                            highlighted
                                        />
                                    </div>
                                </div>

                                <div className="mt-7 flex items-start gap-3 rounded-2xl bg-white/8 p-4">
                                    <ReceiptText
                                        className="mt-0.5 size-5 shrink-0 text-instinct"
                                        aria-hidden
                                    />

                                    <p className="text-sm leading-6 text-white/60">
                                        El valor de $35.000 corresponde al
                                        servicio externo de constitución e
                                        inicio de actividades bajo convenio para
                                        clientes Animal Co-work.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Container>
                </section>

                {/* =========================================================
                 * CONTACTO
                 * ======================================================= */}
                <section className="bg-background py-10 sm:py-12">
                    <Container>
                        <div className="mx-auto max-w-5xl rounded-card border border-deep-blue/10 bg-white p-6 shadow-card sm:p-8">
                            <div className="grid gap-7 md:grid-cols-[1fr_auto] md:items-center">
                                <div>
                                    <p className="text-xs font-extrabold tracking-[0.14em] text-instinct-dark uppercase">
                                        ¿Tienes dudas?
                                    </p>

                                    <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.035em] text-deep-blue sm:text-3xl">
                                        {content.contact.title}
                                    </h2>

                                    <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
                                        {content.contact.description}
                                    </p>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <a
                                        href={`mailto:${content.contact.email}`}
                                        className="flex items-center gap-3 rounded-xl border border-deep-blue/10 px-5 py-3 text-sm font-bold text-deep-blue transition hover:border-instinct hover:text-instinct-dark"
                                    >
                                        <Mail
                                            className="size-5 text-instinct"
                                            aria-hidden
                                        />

                                        {content.contact.email}
                                    </a>

                                    <a
                                        href={`https://wa.me/${content.contact.whatsapp.replace(/\D/g, '')}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-3 rounded-xl bg-instinct px-5 py-3 text-sm font-extrabold text-white transition hover:bg-instinct-dark"
                                    >
                                        <MessageCircle
                                            className="size-5"
                                            aria-hidden
                                        />

                                        WhatsApp{' '}
                                        {formatPhone(
                                            content.contact.whatsapp,
                                        )}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </Container>
                </section>

                <Footer />
            </PublicLayout>
        </>
    );
}

/* =========================================================
 * COMPONENTES AUXILIARES
 * ======================================================= */

interface CheckoutSummaryItemProps {
    label: string;
    value: string;
    highlighted?: boolean;
}

function CheckoutSummaryItem({
    label,
    value,
    highlighted = false,
}: CheckoutSummaryItemProps) {
    return (
        <div className="flex items-start justify-between gap-5">
            <span
                className={
                    highlighted
                        ? 'font-extrabold text-white'
                        : 'text-sm font-semibold text-white/60'
                }
            >
                {label}
            </span>

            <span
                className={
                    highlighted
                        ? 'text-xl font-extrabold text-instinct'
                        : 'shrink-0 font-extrabold text-white'
                }
            >
                {value}
            </span>
        </div>
    );
}

function ServiceImage() {
    if (content.image.src) {
        return (
            <div className="relative">
                <div
                    className="absolute -top-4 -left-4 size-28 rounded-full bg-instinct/10 blur-2xl"
                    aria-hidden
                />

                <img
                    src={content.image.src}
                    alt={content.image.alt}
                    className="relative aspect-[4/3] w-full rounded-card object-cover shadow-card"
                />
            </div>
        );
    }

}

function formatPhone(value: string): string {
    if (value === '+56990556983') {
        return '+56 9 9055 6983';
    }

    return value;
}
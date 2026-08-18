import { Head } from '@inertiajs/react';
import {
    BadgeCheck,
    Building2,
    Check,
    CircleDollarSign,
    FileCheck2,
    FileText,
    IdCard,
    ImageIcon,
    KeyRound,
    Mail,
    MessageCircle,
    ReceiptText,
    ShieldCheck,
    UserRound,
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
                        <div className="grid items-center gap-10 py-12 lg:grid-cols-2 lg:gap-16 lg:py-20">
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

                                {/* Precio principal */}
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
                                    Constitución e inicio de actividades + Oficina Virtual Animal
                                    Co-work por 2 años.
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
                 * DESGLOSE DE PRECIOS
                 * ======================================================= */}
                <section className="bg-background py-12 sm:py-16">
                    <Container>
                        <div className="mx-auto max-w-6xl">
                            <div className="max-w-3xl">
                                <p className="text-xs font-extrabold tracking-[0.16em] text-instinct-dark uppercase">
                                    Precio convenio
                                </p>

                                <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.045em] text-deep-blue sm:text-4xl">
                                    Todo lo que necesitas para comenzar tu
                                    empresa
                                </h2>

                                <p className="mt-4 text-base leading-7 text-muted sm:text-lg">
                                    Accede a un valor exclusivo combinando el
                                    servicio de constitución e inicio de
                                    actividades con tu Oficina Virtual Animal
                                    Co-work.
                                </p>
                            </div>

                            <div className="mt-9 grid gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1.1fr] lg:items-stretch">
                                {/* Servicio externo */}
                                <PriceCard
                                    eyebrow="Servicio externo"
                                    title={
                                        content.externalService.title
                                    }
                                    price={
                                        content.externalService.price
                                    }
                                    description={
                                        content.externalService
                                            .description
                                    }
                                    icon={FileText}
                                />

                                <div
                                    className="hidden items-center justify-center text-3xl font-extrabold text-deep-blue/25 lg:flex"
                                    aria-hidden
                                >
                                    +
                                </div>

                                {/* Oficina virtual */}
                                <PriceCard
                                    eyebrow={
                                        content.virtualOffice.label
                                    }
                                    title={`${content.virtualOffice.title} · ${content.virtualOffice.duration}`}
                                    price={
                                        content.virtualOffice.price
                                    }
                                    description="Dirección tributaria y comercial de Animal Co-work por 2 años."
                                    icon={Building2}
                                />

                                <div
                                    className="hidden items-center justify-center text-3xl font-extrabold text-deep-blue/25 lg:flex"
                                    aria-hidden
                                >
                                    =
                                </div>

                                {/* Total */}
                                <article className="relative overflow-hidden rounded-card bg-deep-blue p-7 text-white shadow-card sm:p-8">
                                    <div
                                        className="absolute -top-16 -right-16 size-40 rounded-full bg-instinct/15"
                                        aria-hidden
                                    />

                                    <div
                                        className="absolute -bottom-20 -left-16 size-44 rounded-full bg-energy-blue/10"
                                        aria-hidden
                                    />

                                    <div className="relative">
                                        <CircleDollarSign
                                            className="size-8 text-instinct"
                                            strokeWidth={2}
                                            aria-hidden
                                        />

                                        <p className="mt-5 text-xs font-extrabold tracking-[0.14em] text-instinct uppercase">
                                            Total ambos servicios
                                        </p>

                                        <p className="mt-3 text-4xl font-extrabold tracking-[-0.05em] sm:text-5xl">
                                            {formatClp(
                                                content.totalPrice,
                                            )}
                                        </p>

                                        <p className="mt-4 text-sm leading-6 text-white/65">
                                            Valor final del paquete Constitución
                                            de Empresa + Inicio de Actividades +
                                            Oficina Virtual por 2 años.
                                        </p>
                                    </div>
                                </article>
                            </div>
                        </div>
                    </Container>
                </section>

                {/* =========================================================
                 * INFORMACIÓN DEL SERVICIO
                 * ======================================================= */}
                <section className="bg-white py-12 sm:py-16 lg:py-20">
                    <Container>
                        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                            <article className="rounded-card border border-deep-blue/10 bg-white p-7 shadow-card sm:p-9">
                                <div className="flex size-14 items-center justify-center rounded-2xl bg-instinct-light text-instinct-dark">
                                    <FileCheck2
                                        className="size-7"
                                        strokeWidth={2}
                                        aria-hidden
                                    />
                                </div>

                                <p className="mt-6 text-xs font-extrabold tracking-[0.14em] text-instinct-dark uppercase">
                                    {
                                        content.serviceSection
                                            .eyebrow
                                    }
                                </p>

                                <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] text-deep-blue sm:text-4xl">
                                    {
                                        content.serviceSection
                                            .title
                                    }
                                </h2>

                                <p className="mt-5 text-base leading-7 text-muted sm:text-lg">
                                    {
                                        content.serviceSection
                                            .description
                                    }
                                </p>

                                <div className="mt-7 rounded-2xl border border-energy-blue/15 bg-energy-blue/5 p-5">
                                    <div className="flex items-start gap-3">
                                        <ShieldCheck
                                            className="mt-0.5 size-6 shrink-0 text-energy-blue"
                                            strokeWidth={2}
                                            aria-hidden
                                        />

                                        <div>
                                            <p className="font-extrabold text-deep-blue">
                                                Servicio adicional externo
                                            </p>

                                            <p className="mt-2 text-sm leading-6 text-muted">
                                                La constitución de empresa,
                                                inicio de actividades,
                                                verificación de actividades y
                                                activación del proceso de
                                                facturación corresponden a un
                                                servicio externo con precio
                                                convenio para clientes de
                                                Animal Co-work.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </article>

                            {/* Requisitos */}
                            <article className="rounded-card bg-deep-blue p-7 text-white shadow-card sm:p-9">
                                <div className="flex items-center gap-3">
                                    <IdCard
                                        className="size-7 text-instinct"
                                        strokeWidth={2}
                                        aria-hidden
                                    />

                                    <p className="text-sm font-extrabold tracking-[0.14em] text-white/65 uppercase">
                                        Requisitos
                                    </p>
                                </div>

                                <h2 className="mt-6 text-2xl font-extrabold tracking-[-0.035em] sm:text-3xl">
                                    ¿Qué necesitas para comenzar?
                                </h2>

                                <div className="mt-7 space-y-4">
                                    {content.serviceSection.requirements.map(
                                        (requirement, index) => (
                                            <RequirementItem
                                                key={requirement}
                                                index={index}
                                                text={
                                                    requirement
                                                }
                                            />
                                        ),
                                    )}
                                </div>
                            </article>
                        </div>

                        {/* Extranjeros */}
                        <div className="mt-6 rounded-card border border-instinct/35 bg-instinct-light p-6 sm:p-8">
                            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white text-instinct-dark shadow-sm">
                                    <UserRound
                                        className="size-6"
                                        strokeWidth={2}
                                        aria-hidden
                                    />
                                </div>

                                <div>
                                    <p className="text-xs font-extrabold tracking-[0.14em] text-instinct-dark uppercase">
                                        Información para extranjeros
                                    </p>

                                    <p className="mt-3 max-w-4xl text-base leading-7 font-semibold text-deep-blue">
                                        {
                                            content.serviceSection
                                                .foreignerNotice
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Container>
                </section>

                {/* =========================================================
                 * QUÉ INCLUYE
                 * ======================================================= */}
                <section className="bg-background py-12 sm:py-16 lg:py-20">
                    <Container>
                        <div className="mx-auto max-w-6xl">
                            <div className="text-center">
                                <p className="text-xs font-extrabold tracking-[0.16em] text-instinct-dark uppercase">
                                    Servicio completo
                                </p>

                                <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.045em] text-deep-blue sm:text-4xl">
                                    {
                                        content.includedServices
                                            .title
                                    }
                                </h2>

                                <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted">
                                    Te acompañamos en los principales pasos
                                    necesarios para que tu empresa pueda comenzar
                                    a operar.
                                </p>
                            </div>

                            <div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {content.includedServices.items.map(
                                    (item, index) => (
                                        <IncludedService
                                            key={item}
                                            index={index}
                                            text={item}
                                        />
                                    ),
                                )}
                            </div>
                        </div>
                    </Container>
                </section>

                {/* =========================================================
                 * CTA / PAGO
                 * ======================================================= */}
                <section
                    id="contratar"
                    className="scroll-mt-28 bg-white py-12 sm:py-16 lg:py-20"
                >
                    <Container>
                        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-card bg-deep-blue shadow-card lg:grid-cols-[1fr_0.8fr]">
                            <div className="p-7 text-white sm:p-10 lg:p-12">
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

                                <h2 className="mt-6 max-w-2xl text-3xl font-extrabold tracking-[-0.045em] sm:text-4xl">
                                    Comienza hoy la constitución de tu empresa
                                </h2>

                                <p className="mt-5 max-w-2xl text-base leading-7 text-white/70">
                                    Contrata el servicio de Constitución de
                                    Empresa + Inicio de Actividades junto con tu
                                    Oficina Virtual Animal Co-work por 2 años.
                                </p>

                                <div className="mt-8 flex flex-wrap items-end gap-x-3">
                                    <span className="text-5xl font-extrabold tracking-[-0.055em] text-instinct sm:text-6xl">
                                        {formatClp(
                                            content.totalPrice,
                                        )}
                                    </span>

                                    <span className="pb-2 text-sm font-bold text-white/55">
                                        total paquete
                                    </span>
                                </div>

                                <div className="mt-8 max-w-md">
                                    <ButtonArrow
                                        href={paymentHref}
                                        className="w-full justify-center sm:w-auto"
                                    >
                                        PAGAR{' '}
                                        {formatClp(
                                            content.totalPrice,
                                        )}
                                    </ButtonArrow>
                                </div>

                            </div>

                            {/* Resumen */}
                            <div className="border-t border-white/10 bg-white/[0.06] p-7 sm:p-10 lg:border-t-0 lg:border-l lg:p-12">
                                <p className="text-xs font-extrabold tracking-[0.14em] text-white/55 uppercase">
                                    Resumen
                                </p>

                                <div className="mt-6 space-y-5">
                                    <CheckoutSummaryItem
                                        label="Constitución + Inicio SII"
                                        value={formatClp(
                                            content.externalService
                                                .price,
                                        )}
                                    />

                                    <CheckoutSummaryItem
                                        label={`Oficina Virtual · ${content.virtualOffice.duration}`}
                                        value={formatClp(
                                            content.virtualOffice
                                                .price,
                                        )}
                                    />

                                    <div className="border-t border-white/15 pt-5">
                                        <CheckoutSummaryItem
                                            label="Total"
                                            value={formatClp(
                                                content.totalPrice,
                                            )}
                                            highlighted
                                        />
                                    </div>
                                </div>

                                <div className="mt-8 flex items-start gap-3 rounded-2xl bg-white/8 p-4">
                                    <ReceiptText
                                        className="mt-0.5 size-5 shrink-0 text-instinct"
                                        aria-hidden
                                    />

                                    <p className="text-sm leading-6 text-white/60">
                                        El valor de $35.000 corresponde al
                                        servicio externo de constitución e
                                        inicio de actividades bajo convenio
                                        para clientes Animal Co-work.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Container>
                </section>

                {/* =========================================================
                 * CONTACTO
                 * ======================================================= */}
                <section className="bg-background py-12 sm:py-16">
                    <Container>
                        <div className="mx-auto max-w-5xl rounded-card border border-deep-blue/10 bg-white p-7 shadow-card sm:p-9">
                            <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
                                <div>
                                    <p className="text-xs font-extrabold tracking-[0.14em] text-instinct-dark uppercase">
                                        ¿Tienes dudas?
                                    </p>

                                    <h2 className="mt-3 text-2xl font-extrabold tracking-[-0.035em] text-deep-blue sm:text-3xl">
                                        {content.contact.title}
                                    </h2>

                                    <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
                                        {
                                            content.contact
                                                .description
                                        }
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
                                            content.contact
                                                .whatsapp,
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

interface PriceCardProps {
    eyebrow: string;
    title: string;
    price: number;
    description: string;
    icon: typeof FileText;
}

function PriceCard({
    eyebrow,
    title,
    price,
    description,
    icon: Icon,
}: PriceCardProps) {
    return (
        <article className="rounded-card border border-deep-blue/10 bg-white p-7 shadow-card sm:p-8">
            <Icon
                className="size-7 text-instinct"
                strokeWidth={2}
                aria-hidden
            />

            <p className="mt-5 text-xs font-extrabold tracking-[0.14em] text-instinct-dark uppercase">
                {eyebrow}
            </p>

            <h3 className="mt-3 text-xl font-extrabold tracking-[-0.025em] text-deep-blue">
                {title}
            </h3>

            <p className="mt-5 text-4xl font-extrabold tracking-[-0.05em] text-deep-blue">
                {formatClp(price)}
            </p>

            <p className="mt-4 text-sm leading-6 text-muted">
                {description}
            </p>
        </article>
    );
}

interface RequirementItemProps {
    index: number;
    text: string;
}

function RequirementItem({
    index,
    text,
}: RequirementItemProps) {
    const icons = [
        KeyRound,
        KeyRound,
        IdCard,
    ];

    const Icon =
        icons[index] ?? Check;

    return (
        <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-instinct">
                <Icon
                    className="size-4.5"
                    strokeWidth={2}
                    aria-hidden
                />
            </span>

            <p className="pt-1 text-sm leading-6 text-white/75">
                {text}
            </p>
        </div>
    );
}

interface IncludedServiceProps {
    index: number;
    text: string;
}

function IncludedService({
    index,
    text,
}: IncludedServiceProps) {
    const icons = [
        FileText,
        FileCheck2,
        ShieldCheck,
        ReceiptText,
        Building2,
    ];

    const Icon =
        icons[index] ?? Check;

    return (
        <article className="flex items-start gap-4 rounded-2xl border border-deep-blue/10 bg-white p-5 shadow-[0_8px_24px_rgba(13,27,61,0.04)]">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-instinct-light text-instinct-dark">
                <Icon
                    className="size-5"
                    strokeWidth={2}
                    aria-hidden
                />
            </span>

            <div>
                <p className="text-sm font-bold leading-6 text-deep-blue">
                    {text}
                </p>
            </div>
        </article>
    );
}

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

                <div className="absolute right-4 bottom-4 left-4 rounded-2xl border border-white/25 bg-deep-blue/85 p-4 text-white shadow-lg backdrop-blur-md sm:right-6 sm:bottom-6 sm:left-6">
                    <div className="flex items-center gap-3">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-instinct text-white">
                            <BadgeCheck
                                className="size-5"
                                strokeWidth={2}
                                aria-hidden
                            />
                        </span>

                        <div>
                            <p className="text-xs font-bold tracking-[0.1em] text-white/55 uppercase">
                                Paquete completo
                            </p>

                            <p className="mt-0.5 font-extrabold">
                                Empresa + SII + Oficina Virtual
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex aspect-[4/3] min-h-72 items-center justify-center rounded-card border border-dashed border-deep-blue/25 bg-deep-blue/5 p-8 text-center">
            <div>
                <span className="mx-auto flex size-20 items-center justify-center rounded-full bg-white text-instinct shadow-card">
                    <ImageIcon
                        className="size-9"
                        strokeWidth={1.8}
                        aria-hidden
                    />
                </span>

                <p className="mt-5 text-sm font-extrabold tracking-[0.12em] text-deep-blue uppercase">
                    Imagen del servicio
                </p>

                <p className="mt-2 text-sm text-muted">
                    Espacio preparado para contenido visual
                    administrable.
                </p>
            </div>
        </div>
    );
}

function formatPhone(value: string): string {
    if (value === '+56990556983') {
        return '+56 9 9055 6983';
    }

    return value;
}
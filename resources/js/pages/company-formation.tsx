import { Head } from '@inertiajs/react';
import {
    BadgeCheck,
    CheckCircle2,
    FileCheck2,
    IdCard,
    Mail,
    MessageCircle,
    ReceiptText,
    ShieldCheck,
} from 'lucide-react';

import { Footer } from '@/components/layout/footer';
import { ButtonArrow } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { PublicLayout } from '@/layouts/public-layout';

/**
 * =========================================================
 * DATOS RECIBIDOS DESDE LARAVEL
 * =========================================================
 *
 * Estos nombres corresponden directamente a las columnas
 * de la tabla `company_formation_services`.
 *
 * No usamos aquí la estructura del contenido estático anterior.
 */
interface CompanyFormationService {
    id: number;
    slug: string;

    eyebrow: string | null;
    title: string;
    description: string;

    // Servicio externo
    external_service_label: string | null;
    external_service_title: string | null;
    external_service_price: number | null;
    external_service_description: string | null;

    // Oficina Virtual
    virtual_office_label: string | null;
    virtual_office_title: string | null;
    virtual_office_price: number | null;
    virtual_office_duration: string | null;

    // Sección del servicio
    service_section_eyebrow: string | null;
    service_section_title: string | null;
    service_section_description: string | null;
    requirements: string[] | null;
    foreigner_notice: string | null;

    // Servicios incluidos
    included_services_title: string | null;
    included_services: string[] | null;

    // Contacto
    contact_title: string | null;
    contact_description: string | null;
    contact_email: string | null;
    contact_whatsapp: string | null;

    // Imagen
    image_url: string | null;
    image_alt: string | null;

    // CTA
    primary_action_label: string | null;
    primary_action_href: string | null;

    // Publicación
    is_active: boolean;
    sort_order: number;
}

interface CompanyFormationProps {
    service: CompanyFormationService;
}

/**
 * =========================================================
 * UTILIDADES
 * =========================================================
 */

function formatClp(value: number): string {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        maximumFractionDigits: 0,
    }).format(value);
}

function formatPhone(value: string): string {
    if (value === '+56990556983') {
        return '+56 9 9055 6983';
    }

    return value;
}

/**
 * =========================================================
 * PÁGINA
 * =========================================================
 */

export default function CompanyFormation({
    service,
}: CompanyFormationProps) {
    /**
     * El total ya no viene almacenado en BD.
     *
     * Se calcula a partir de:
     * - external_service_price
     * - virtual_office_price
     *
     * Esto evita inconsistencias si posteriormente
     * modificamos alguno de los precios desde el panel admin.
     */
    const externalServicePrice = service.external_service_price ?? 0;
    const virtualOfficePrice = service.virtual_office_price ?? 0;

    const totalPrice = externalServicePrice + virtualOfficePrice;

    const requirements = service.requirements ?? [];
    const includedServices = service.included_services ?? [];

    return (
        <>
            <Head title="Constitución de Empresa + Oficina Virtual">
                <meta
                    name="description"
                    content={service.description}
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
                                    {service.eyebrow}
                                </p>

                                <h1 className="mt-4 max-w-3xl text-[clamp(2.4rem,6vw,2.5rem)] leading-[0.95] font-extrabold tracking-[-0.055em] text-balance text-deep-blue uppercase">
                                    {service.title}
                                </h1>

                                <p className="mt-6 max-w-2xl text-base leading-7 text-muted sm:text-lg">
                                    {service.description}
                                </p>

                                <div className="mt-7 flex flex-wrap items-end gap-x-3 gap-y-1">
                                    <span className="text-sm font-extrabold tracking-[0.12em] text-deep-blue/50 uppercase">
                                        Paquete completo
                                    </span>

                                    <div className="w-full" />

                                    <span className="text-4xl font-extrabold tracking-[-0.05em] text-instinct sm:text-5xl">
                                        {formatClp(totalPrice)}
                                    </span>

                                    <span className="pb-1 text-sm font-bold text-deep-blue/55">
                                        total
                                    </span>
                                </div>

                                <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
                                    {service.external_service_title} +
                                    Oficina Virtual Animal Co-work por{' '}
                                    {service.virtual_office_duration}.
                                </p>

                                <div className="mt-8">
                                    <ButtonArrow
                                        href={
                                            service.primary_action_href ??
                                            '#contratar'
                                        }
                                        className="w-full sm:w-auto"
                                    >
                                        {service.primary_action_label ??
                                            'CONTRATAR AHORA'}
                                    </ButtonArrow>
                                </div>
                            </div>

                            <ServiceImage
                                image={service.image_url}
                                alt={service.image_alt}
                            />
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
                                                {
                                                    service.external_service_label
                                                }
                                            </p>

                                            <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.035em] text-deep-blue sm:text-3xl">
                                                {service.included_services_title}
                                            </h2>

                                            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">
                                                {
                                                    service.service_section_description
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    {/* Qué incluye */}
                                    <div className="mt-6 border-t border-deep-blue/8 pt-6">
                                        <p className="text-sm font-extrabold text-deep-blue">
                                            ¿Qué incluye?
                                        </p>

                                        <div className="mt-4 grid gap-x-5 gap-y-3 sm:grid-cols-2">
                                            {includedServices.map((item) => (
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
                                            ))}
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
                                            {
                                                service.external_service_description
                                            }
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
                                            {
                                                service.service_section_eyebrow
                                            }
                                        </p>
                                    </div>

                                    <h3 className="mt-4 text-xl font-extrabold tracking-[-0.025em] sm:text-2xl">
                                        {service.service_section_title}
                                    </h3>

                                    <div className="mt-5 space-y-3">
                                        {requirements.map((requirement) => (
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
                                        ))}
                                    </div>

                                    <div className="mt-5 border-t border-white/10 pt-5">
                                        <p className="text-xs font-extrabold tracking-[0.12em] text-white/45 uppercase">
                                            Personas extranjeras
                                        </p>

                                        <p className="mt-2 text-xs leading-5 text-white/55">
                                            {service.foreigner_notice}
                                        </p>
                                    </div>

                                    {/* Precio compacto */}
                                    <div className="mt-6 border-t border-white/10 pt-5">
                                        <div className="flex items-center justify-between gap-4">
                                            <div>
                                                <p className="text-xs font-bold text-white/45">
                                                    {
                                                        service.external_service_title
                                                    }
                                                </p>

                                                <p className="mt-1 font-extrabold">
                                                    {formatClp(
                                                        externalServicePrice,
                                                    )}
                                                </p>
                                            </div>

                                            <span className="text-xl font-extrabold text-white/30">
                                                +
                                            </span>

                                            <div className="text-right">
                                                <p className="text-xs font-bold text-white/45">
                                                    {
                                                        service.virtual_office_title
                                                    }{' '}
                                                    ·{' '}
                                                    {
                                                        service.virtual_office_duration
                                                    }
                                                </p>

                                                <p className="mt-1 font-extrabold">
                                                    {formatClp(
                                                        virtualOfficePrice,
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-5 flex items-end justify-between gap-4 border-t border-white/10 pt-5">
                                            <span className="text-sm font-extrabold">
                                                Total
                                            </span>

                                            <span className="text-3xl font-extrabold tracking-[-0.045em] text-instinct">
                                                {formatClp(totalPrice)}
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
                                        {service.eyebrow}
                                    </p>
                                </div>

                                <h2 className="mt-5 max-w-2xl text-3xl font-extrabold tracking-[-0.045em] sm:text-4xl">
                                    Comienza hoy la constitución de tu empresa
                                </h2>

                                <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">
                                    {service.description}
                                </p>

                                <div className="mt-7 flex flex-wrap items-end gap-x-3">
                                    <span className="text-5xl font-extrabold tracking-[-0.055em] text-instinct sm:text-6xl">
                                        {formatClp(totalPrice)}
                                    </span>

                                    <span className="pb-2 text-sm font-bold text-white/55">
                                        total paquete
                                    </span>
                                </div>

                                <div className="mt-7 max-w-md">
                                    <ButtonArrow
                                        href={
                                            service.primary_action_href ??
                                            '#contratar'
                                        }
                                        className="w-full justify-center sm:w-auto"
                                    >
                                        PAGAR {formatClp(totalPrice)}
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
                                        label={
                                            service.external_service_title ??
                                            'Servicio externo'
                                        }
                                        value={formatClp(
                                            externalServicePrice,
                                        )}
                                    />

                                    <CheckoutSummaryItem
                                        label={`${service.virtual_office_title ?? 'Oficina Virtual'} · ${service.virtual_office_duration ?? ''}`}
                                        value={formatClp(
                                            virtualOfficePrice,
                                        )}
                                    />

                                    <div className="border-t border-white/15 pt-5">
                                        <CheckoutSummaryItem
                                            label="Total"
                                            value={formatClp(totalPrice)}
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
                                        {
                                            service.external_service_description
                                        }
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
                                        {service.contact_title}
                                    </h2>

                                    <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
                                        {service.contact_description}
                                    </p>
                                </div>

                                <div className="flex flex-col gap-3">
                                    {service.contact_email && (
                                        <a
                                            href={`mailto:${service.contact_email}`}
                                            className="flex items-center gap-3 rounded-xl border border-deep-blue/10 px-5 py-3 text-sm font-bold text-deep-blue transition hover:border-instinct hover:text-instinct-dark"
                                        >
                                            <Mail
                                                className="size-5 text-instinct"
                                                aria-hidden
                                            />

                                            {service.contact_email}
                                        </a>
                                    )}

                                    {service.contact_whatsapp && (
                                        <a
                                            href={`https://wa.me/${service.contact_whatsapp.replace(/\D/g, '')}`}
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
                                                service.contact_whatsapp,
                                            )}
                                        </a>
                                    )}
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

/**
 * =========================================================
 * COMPONENTES AUXILIARES
 * =========================================================
 */

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

interface ServiceImageProps {
    image: string | null;
    alt: string | null;
}

function ServiceImage({ image, alt }: ServiceImageProps) {
    if (!image) {
        return null;
    }

    return (
        <div className="relative">
            <div
                className="absolute -top-4 -left-4 size-28 rounded-full bg-instinct/10 blur-2xl"
                aria-hidden
            />

            <img
                src={image}
                alt={alt ?? 'Servicio Animal Co-work'}
                className="relative aspect-[4/3] w-full rounded-card object-cover shadow-card"
            />
        </div>
    );
}

import { Head } from '@inertiajs/react';
import {
    FileCheck2,
    Scale,
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
 * Estos campos corresponden directamente a las columnas
 * de la tabla `patent_management_services`.
 *
 * `image_url` es generado por el Model de Laravel.
 */
interface PatentManagementService {
    id: number;
    slug: string;

    eyebrow: string | null;
    title: string;
    description: string;

    service_section_title: string | null;
    service_section_description: string | null;

    legal_notice: string | null;

    service_price: number | null;
    currency: string;

    municipal_payment_detail: string | null;
    exclusive_notice: string | null;

    image_url: string | null;
    image_alt: string | null;

    primary_action_label: string | null;
    primary_action_href: string | null;

    is_active: boolean;
    sort_order: number;
}

interface PatentManagementProps {
    service: PatentManagementService;
}

/**
 * =========================================================
 * UTILIDADES
 * =========================================================
 */

function formatCurrency(
    value: number,
    currency: string = 'CLP',
): string {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
    }).format(value);
}

/**
 * =========================================================
 * PÁGINA
 * =========================================================
 */

export default function PatentManagement({
    service,
}: PatentManagementProps) {
    const servicePrice = service.service_price ?? 0;

    return (
        <>
            <Head title={service.title}>
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
                        <div className="grid items-center gap-10 py-12 lg:grid-cols-2 lg:gap-16 lg:py-20">
                            <div>
                                <p className="text-sm font-extrabold tracking-[0.16em] text-instinct uppercase">
                                    {service.eyebrow}
                                </p>

                                <h1 className="mt-4 max-w-3xl text-[clamp(2.5rem,7vw,2.75rem)] leading-[0.95] font-extrabold tracking-[-0.055em] text-balance text-deep-blue uppercase">
                                    {service.title}
                                </h1>

                                <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
                                    {service.description}
                                </p>

                                <p className="mt-6 text-5xl font-extrabold tracking-[-0.05em] text-instinct sm:text-5xl">
                                    {formatCurrency(
                                        servicePrice,
                                        service.currency,
                                    )}
                                </p>

                                <p className="mt-4 text-sm leading-6 text-deep-blue/70">
                                    {service.exclusive_notice}
                                </p>

                                <div className="mt-8">
                                    <ButtonArrow
                                        href={
                                            service.primary_action_href ??
                                            '#'
                                        }
                                        className="w-full sm:w-auto"
                                    >
                                        {service.primary_action_label ??
                                            'CONTRATAR'}
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
                 * INFORMACIÓN DEL SERVICIO
                 * ======================================================= */}
                <section className="bg-background py-12 sm:py-16 lg:py-20">
                    <Container>
                        <div className="mx-auto max-w-6xl">
                            <div className="overflow-hidden rounded-card border border-deep-blue/10 bg-white shadow-card">

                                {/* =================================================
                                 * QUÉ GESTIONAMOS
                                 * =============================================== */}
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
                                            {
                                                service.service_section_title
                                            }
                                        </h2>

                                        <p className="mt-4 max-w-4xl text-base leading-7 text-muted sm:text-lg">
                                            {
                                                service.service_section_description
                                            }
                                        </p>
                                    </div>
                                </article>

                                {/* Separador */}
                                <div className="mx-7 border-t border-deep-blue/10 sm:mx-9" />

                                {/* =================================================
                                 * IMPORTANCIA LEGAL
                                 * =============================================== */}
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
                                            {service.legal_notice}
                                        </p>
                                    </div>
                                </article>

                                {/* Separador */}
                                <div className="mx-7 border-t border-deep-blue/10 sm:mx-9" />

                                {/* =================================================
                                 * DERECHO DE ASEO
                                 * =============================================== */}
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
                                            {
                                                service.municipal_payment_detail
                                            }
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

/**
 * =========================================================
 * COMPONENTE DE IMAGEN
 * =========================================================
 */

interface ServiceImageProps {
    image: string | null;
    alt: string | null;
}

function ServiceImage({
    image,
    alt,
}: ServiceImageProps) {
    if (!image) {
        return null;
    }

    /**
     * Laravel puede entregar:
     *
     * 1. URL absoluta:
     *    https://dominio.com/storage/services/image.jpg
     *
     * 2. Imagen antigua:
     *    /images/services/image.jpg
     *
     * 3. Imagen nueva almacenada mediante Filament:
     *    services/image.jpg
     *
     * En el tercer caso agregamos /storage/.
     */
    const imageUrl =
        image.startsWith('http://') ||
        image.startsWith('https://')
            ? image
            : image.startsWith('/')
                ? image
                : `/storage/${image}`;

    return (
        <img
            src={imageUrl}
            alt={
                alt ??
                'Gestión de patente comercial de oficina virtual'
            }
            className="aspect-[4/3] w-full rounded-card object-cover shadow-card"
            loading="lazy"
        />
    );
}
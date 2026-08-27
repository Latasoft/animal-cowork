import { Head } from '@inertiajs/react';
import {
    BadgeCheck,
    Building2,
    CalendarDays,
    Car,
    CheckCircle2,
    Coffee,
    FileDown,
    Users,
    Wifi,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { Footer } from '@/components/layout/footer';
import { PrivateOfficeCard } from '@/components/private-offices/private-office-card';
import { ButtonArrow, ButtonLink } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { privateOfficesPageContent } from '@/data/private-offices';
import type { PrivateOfficeBenefitIcon } from '@/data/private-offices';
import { PublicLayout } from '@/layouts/public-layout';
import { createWhatsappUrl } from '@/lib/whatsapp';

interface PrivateOfficeFromDatabase {
    id: string;
    name: string;
    slug: string;
    image: string | null;
    image_alt: string | null;
    area_m2: number;
    is_available: boolean;
    price: number | null;
    currency: 'CLP' | 'UF';
    expenses_included: boolean;
    features: string[];
    sort_order: number;
    is_visible: boolean;
}

interface PrivateOfficeCardData {
    id: string;
    name: string;
    slug: string;
    image: string;
    imageAlt: string;
    areaM2: number;
    isAvailable: boolean;
    price: number | null;
    currency: 'CLP' | 'UF';
    expensesIncluded: boolean;
    features: string[];
    sortOrder: number;
    isVisible: boolean;
}

interface PrivateOfficesProps {
    offices: PrivateOfficeFromDatabase[];
}

const content = privateOfficesPageContent;

const benefitIcons: Record<PrivateOfficeBenefitIcon, LucideIcon> = {
    wifi: Wifi,
    'meeting-room': Users,
    kitchen: Coffee,
    'common-areas': Building2,
    parking: Car,
    expenses: BadgeCheck,
    'flexible-rent': CalendarDays,
};

export default function PrivateOffices({
    offices,
}: PrivateOfficesProps) {
    const generalWhatsappUrl = createWhatsappUrl(
        content.whatsapp.phone,
        content.whatsapp.defaultMessage,
    );

    const visibleOffices: PrivateOfficeCardData[] = offices
        .filter((office) => office.is_visible)
        .sort(
            (firstOffice, secondOffice) =>
                firstOffice.sort_order - secondOffice.sort_order,
        )
        .map((office) => ({
            id: office.id,
            name: office.name,
            slug: office.slug,
            image: office.image ?? '',
            imageAlt:
                office.image_alt ??
                `Interior de ${office.name} de Animal Co-work`,
            areaM2: Number(office.area_m2),
            isAvailable: office.is_available,
            price:
                office.price !== null
                    ? Number(office.price)
                    : null,
            currency: office.currency,
            expensesIncluded: office.expenses_included,
            features: office.features ?? [],
            sortOrder: office.sort_order,
            isVisible: office.is_visible,
        }));

    return (
        <>
            <Head title={content.seo.title}>
                <meta
                    head-key="description"
                    name="description"
                    content={content.seo.description}
                />
            </Head>

            <PublicLayout>
                <section className="relative overflow-hidden bg-white">
                    <Container>
                        <div className="grid items-center gap-10 py-10 lg:grid-cols-2 lg:gap-16 lg:py-14">
                            <div>
                                <p className="text-sm font-extrabold tracking-[0.16em] text-instinct uppercase">
                                    {content.hero.eyebrow}
                                </p>

                                <h1 className="mt-4 text-[clamp(2.6rem,7vw,4.75rem)] leading-[0.92] font-extrabold tracking-[-0.06em] text-balance text-deep-blue uppercase">
                                    {content.hero.title}
                                </h1>

                                <p className="mt-5 text-sm font-extrabold tracking-[0.14em] text-deep-blue uppercase sm:text-base">
                                    {content.hero.subtitle}
                                </p>

                                <p className="mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
                                    {content.hero.description}
                                </p>

                                <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                                    {content.hero.highlights.map(
                                        (highlight) => (
                                            <li
                                                key={highlight}
                                                className="flex items-start gap-2 text-sm font-semibold text-deep-blue/70"
                                            >
                                                <CheckCircle2
                                                    className="mt-0.5 size-4 shrink-0 text-instinct"
                                                    strokeWidth={2.4}
                                                    aria-hidden
                                                />

                                                {highlight}
                                            </li>
                                        ),
                                    )}
                                </ul>

                                <div className="mt-8">
                                    <ButtonArrow
                                        href={generalWhatsappUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-full sm:w-auto"
                                    >
                                        {
                                            content.whatsapp
                                                .heroActionLabel
                                        }
                                    </ButtonArrow>
                                </div>
                            </div>

                            <div className="relative">
                                <div
                                    className="absolute -top-5 -right-5 size-40 rounded-full bg-instinct/15 blur-3xl"
                                    aria-hidden
                                />

                                <img
                                    src={content.hero.image}
                                    alt={content.hero.imageAlt}
                                    className="relative aspect-square w-full rounded-card object-cover shadow-card"
                                    loading="eager"
                                    fetchPriority="high"
                                />
                            </div>
                        </div>
                    </Container>
                </section>

                <section
                    className="border-y border-deep-blue/8 bg-background py-7 sm:py-8"
                    aria-label="Beneficios de las oficinas privadas"
                >
                    <Container>
                        <ul className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4 lg:grid-cols-7">
                            {content.benefits.map((benefit) => {
                                const BenefitIcon =
                                    benefitIcons[benefit.icon];

                                return (
                                    <li
                                        key={benefit.label}
                                        className="flex items-center gap-2.5"
                                    >
                                        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-instinct-light text-instinct-dark">
                                            <BenefitIcon
                                                className="size-4.5"
                                                strokeWidth={2}
                                                aria-hidden
                                            />
                                        </span>

                                        <span className="text-xs leading-4 font-bold text-deep-blue/70">
                                            {benefit.label}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    </Container>
                </section>

                <section className="bg-background py-12 sm:py-14 lg:py-16">
                    <Container>
                        <div className="mx-auto max-w-3xl text-center">
                            <p className="text-xs font-extrabold tracking-[0.16em] text-instinct-dark uppercase">
                                {content.officesSection.eyebrow}
                            </p>

                            <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.045em] text-balance text-deep-blue sm:text-4xl">
                                {content.officesSection.title}
                            </h2>

                            <p className="mt-3 text-base leading-7 text-muted">
                                {content.officesSection.description}
                            </p>
                        </div>

                        <div className="mt-9 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            {visibleOffices.map((office) => (
                                <PrivateOfficeCard
                                    key={office.id}
                                    office={office}
                                    whatsappPhone={
                                        content.whatsapp.phone
                                    }
                                    actionLabel={
                                        content.whatsapp
                                            .officeActionLabel
                                    }
                                />
                            ))}
                        </div>
                    </Container>
                </section>

                <section className="bg-white py-10 sm:py-12 lg:py-14">
                    <Container>
                        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-card bg-deep-blue text-white shadow-card lg:grid-cols-[1.25fr_0.75fr]">
                            <div className="p-7 sm:p-9 lg:p-10">
                                <p className="text-xs font-extrabold tracking-[0.16em] text-instinct uppercase">
                                    {content.finalCta.eyebrow}
                                </p>

                                <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.045em] text-balance sm:text-4xl">
                                    {content.finalCta.title}
                                </h2>

                                <p className="mt-4 max-w-2xl text-base leading-7 text-white/70">
                                    {content.finalCta.description}
                                </p>

                                <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                                    {content.finalCta.details.map(
                                        (detail) => (
                                            <li
                                                key={detail}
                                                className="flex items-start gap-2 text-sm leading-6 text-white/65"
                                            >
                                                <CheckCircle2
                                                    className="mt-1 size-4 shrink-0 text-instinct"
                                                    strokeWidth={2.3}
                                                    aria-hidden
                                                />

                                                {detail}
                                            </li>
                                        ),
                                    )}
                                </ul>

                                <div className="mt-7">
                                    <ButtonArrow
                                        href={generalWhatsappUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-full sm:w-auto"
                                    >
                                        {
                                            content.whatsapp
                                                .finalActionLabel
                                        }
                                    </ButtonArrow>
                                </div>
                            </div>

                            <aside className="border-t border-white/10 bg-white/[0.06] p-7 sm:p-9 lg:border-t-0 lg:border-l lg:p-10">
                                <span className="flex size-11 items-center justify-center rounded-xl bg-white/10 text-instinct">
                                    <FileDown
                                        className="size-5"
                                        strokeWidth={2}
                                        aria-hidden
                                    />
                                </span>

                                <h3 className="mt-5 text-xl font-extrabold tracking-[-0.025em]">
                                    {content.requirements.title}
                                </h3>

                                <p className="mt-3 text-sm leading-6 text-white/60">
                                    {content.requirements.description}
                                </p>

                                <ButtonLink
                                    href={
                                        content.requirements
                                            .documentUrl
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    download
                                    variant="outline"
                                    className="mt-6 w-full justify-center border-white bg-white text-deep-blue hover:border-white hover:bg-white/90"
                                >
                                    {
                                        content.requirements
                                            .actionLabel
                                    }
                                </ButtonLink>
                            </aside>
                        </div>
                    </Container>
                </section>

                <Footer />
            </PublicLayout>
        </>
    );
}
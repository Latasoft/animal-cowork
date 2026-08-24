import { Head, Link } from '@inertiajs/react';
import { Check, Plus } from 'lucide-react';

import { Container } from '@/components/ui/container';
import { DataStateCard } from '@/components/ui/data-state-card';
import { PlanImage } from '@/components/ui/plan-image';
import { PublicLayout } from '@/layouts/public-layout';
import { show as checkoutShow } from '@/routes/checkout';
import type { Plan, PlanTheme } from '@/types/plan';
import { formatClp } from '@/utils/currency';

interface RenewContractPageProps {
    plans: Plan[];
    plansUnavailable: boolean;
}

export default function RenewContract({
    plans,
    plansUnavailable,
}: RenewContractPageProps) {
    const phoenixPlan = plans.find((plan) => plan.slug === 'fenix');
    const patentPlans = plans.filter((plan) =>
        ['lobo', 'leon'].includes(plan.slug),
    );

    return (
        <PublicLayout>
            <Head title="Renovación de oficina virtual" />

            <section className="bg-white py-10 sm:py-12 lg:py-16">
                <Container>
                    <div className="mx-auto max-w-6xl">
                        <header className="mx-auto max-w-3xl text-center">
                            <p className="text-sm font-extrabold tracking-[0.16em] text-instinct-dark uppercase">
                                Renovación
                            </p>

                            <h1 className="mt-3 text-4xl leading-[1.03] font-extrabold tracking-[-0.05em] text-deep-blue sm:text-5xl">
                                Elige cómo quieres renovar
                            </h1>

                            <p className="mt-5 text-base leading-7 text-deep-blue/65 sm:text-lg">
                                Selecciona la alternativa que mejor se adapte a
                                lo que necesitas para continuar.
                            </p>
                        </header>

                        {plansUnavailable ? (
                            <DataStateCard
                                state="unavailable"
                                title="No pudimos cargar las opciones de renovación"
                                description="No es posible validar planes ni precios en este momento. Intenta nuevamente más tarde."
                                className="mt-12 sm:mt-14"
                            />
                        ) : plans.length === 0 ? (
                            <DataStateCard
                                state="empty"
                                title="No hay opciones de renovación disponibles"
                                description="Actualmente no existen planes activos para renovar."
                                className="mt-12 sm:mt-14"
                            />
                        ) : (
                            <>
                                <section className="mt-12 sm:mt-14">
                                    <div className="mb-6">
                                        <p className="text-xs font-extrabold tracking-[0.14em] text-instinct-dark uppercase">
                                            Opción principal
                                        </p>
                                        <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.03em] text-deep-blue sm:text-3xl">
                                            Renovación de oficina virtual
                                        </h2>
                                        <p className="mt-5 text-base leading-7 text-deep-blue/65 sm:text-lg">
                                            Si solo necesitas renovar tu oficina
                                            virtual, esta es la opción indicada.
                                        </p>
                                    </div>

                                    <div className="max-w-xl">
                                        {phoenixPlan && (
                                            <RenewalPlanCard
                                                plan={phoenixPlan}
                                            />
                                        )}
                                    </div>
                                </section>

                                <section className="mt-14 border-t border-deep-blue/10 pt-12 sm:mt-16 sm:pt-14">
                                    <span className="text-xs font-extrabold tracking-[0.14em] text-energy-blue-dark uppercase">
                                        Oficina virtual + patente
                                    </span>
                                    <h2 className="max-w-4xl text-xl leading-8 font-extrabold tracking-[-0.02em] text-deep-blue sm:text-2xl">
                                        Si necesitas renovar tu oficina virtual
                                        y gestionar tu patente comercial, estas
                                        son las opciones que tenemos para ti:
                                    </h2>

                                    <div className="mt-7 grid gap-6 lg:grid-cols-2">
                                        {patentPlans.map((plan) => (
                                            <RenewalPlanCard
                                                key={plan.slug}
                                                plan={plan}
                                            />
                                        ))}
                                    </div>
                                </section>
                            </>
                        )}
                    </div>
                </Container>
            </section>
        </PublicLayout>
    );
}

interface RenewalPlanCardProps {
    plan: Plan;
}

const themes: Record<PlanTheme, { accent: string; badge: string }> = {
    green: {
        accent: 'text-instinct-dark',
        badge: 'bg-instinct text-white',
    },
    orange: {
        accent: 'text-orange-600',
        badge: 'bg-orange-600 text-white',
    },
    gold: {
        accent: 'text-amber-600',
        badge: 'bg-amber-500 text-deep-blue',
    },
};

function RenewalPlanCard({ plan }: RenewalPlanCardProps) {
    const featured = plan.featured;
    const theme = themes[plan.theme];
    const displayedFeatures = plan.features.slice(0, featured ? 1 : 2);
    const checkoutUrl = checkoutShow.url(plan.slug, {
        query: { flow: 'renewal' },
    });

    return (
        <article
            className={[
                'grid h-full overflow-hidden rounded-[1.75rem] border bg-white shadow-card sm:grid-cols-[11rem_minmax(0,1fr)]',
                featured
                    ? 'border-instinct ring-4 ring-instinct/10'
                    : 'border-deep-blue/10',
            ].join(' ')}
        >
            <div className="relative min-h-48 overflow-hidden bg-background sm:min-h-full">
                <PlanImage
                    src={plan.image}
                    fallbackImage={plan.fallbackImage}
                    slug={plan.slug}
                    alt={plan.imageAlt}
                    className="absolute inset-0 size-full object-cover object-center"
                    loading="lazy"
                />
                <div
                    className="absolute inset-0 bg-gradient-to-t from-deep-blue/20 to-transparent"
                    aria-hidden="true"
                />
            </div>

            <div className="flex min-w-0 flex-col p-6 sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <p
                            className={`text-xs font-extrabold tracking-[0.16em] uppercase ${theme.accent}`}
                        >
                            Plan
                        </p>
                        <h3 className="mt-1 text-3xl font-extrabold tracking-[-0.04em] text-deep-blue">
                            {plan.name}
                        </h3>
                    </div>

                    {plan.badge && (
                        <span
                            className={`rounded-full px-3 py-1 text-xs font-extrabold uppercase ${theme.badge}`}
                        >
                            {plan.badge}
                        </span>
                    )}
                </div>

                <div className="mt-5 flex-1">
                    {displayedFeatures.map((feature, index) => (
                        <div key={feature}>
                            {index > 0 && (
                                <Plus
                                    className="my-2 size-5 text-instinct-dark"
                                    strokeWidth={2.5}
                                    aria-label="más"
                                />
                            )}

                            <p className="flex items-start gap-3 text-sm leading-6 font-semibold text-deep-blue/75">
                                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md bg-instinct text-white">
                                    <Check
                                        className="size-3"
                                        aria-hidden="true"
                                    />
                                </span>
                                <span>{feature}</span>
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-7 flex flex-col gap-5 border-t border-deep-blue/10 pt-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-extrabold tracking-[0.12em] text-deep-blue/50 uppercase">
                            Precio total
                        </p>
                        <p className="mt-1 text-3xl font-extrabold tracking-[-0.04em] text-instinct-dark">
                            {formatClp(plan.totalPrice)}
                        </p>
                    </div>

                    <Link
                        href={checkoutUrl}
                        className="inline-flex h-12 items-center justify-center rounded-md bg-instinct px-6 text-xs font-semibold tracking-[-0.01em] text-white transition-all duration-300 hover:bg-instinct-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-instinct active:scale-[0.98]"
                    >
                        RENOVAR
                    </Link>
                </div>
            </div>
        </article>
    );
}

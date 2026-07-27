import { ButtonLink } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { PlanCard } from '@/components/ui/plan-card';
import type { Plan } from '@/types/plan';

interface PlansSectionProps {
    plans: Plan[];
}

export function PlansSection({ plans }: PlansSectionProps) {
    return (
        <section
            id="planes"
            className="relative scroll-mt-24 overflow-hidden bg-white py-20 sm:py-24 lg:py-15"
        >
            <div
                className="absolute top-0 left-0 -z-10 size-96 rounded-full bg-instinct/8 blur-3xl"
                aria-hidden="true"
            />

            <Container>
                <div className="mx-auto max-w-3xl text-center">
                    <p className="text-sm font-extrabold tracking-[0.2em] text-instinct-dark uppercase">
                        Nuestros planes
                    </p>

                    <h2 className="mt-4 text-4xl leading-tight font-extrabold tracking-[-0.045em] text-balance text-deep-blue sm:text-3xl lg:text-4xl">
                        Elige el plan ideal para tu negocio
                    </h2>

                    <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-muted sm:text-lg">
                        Encuentra la solución que mejor se adapta a la etapa
                        actual de tu emprendimiento.
                    </p>
                </div>

                <div className="mt-14 grid items-stretch gap-7 lg:grid-cols-3">
                    {plans.map((plan) => (
                        <PlanCard key={plan.id} plan={plan} />
                    ))}
                </div>

                <RenewalCard />
            </Container>
        </section>
    );
}

function RenewalCard() {
    return (
        <div className="relative mt-16 overflow-hidden rounded-[2rem] bg-deep-blue px-6 py-10 text-white shadow-2xl sm:px-10 lg:flex lg:items-center lg:justify-between lg:gap-12 lg:px-14">
            <div
                className="absolute -top-20 -right-12 size-72 rounded-full bg-instinct/20 blur-3xl"
                aria-hidden="true"
            />

            <div className="relative max-w-2xl">
                <p className="text-sm font-bold tracking-[0.18em] text-instinct uppercase">
                    Renovación
                </p>

                <h3 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">
                    ¿Necesitas renovar tu contrato?
                </h3>

                <p className="mt-4 text-base leading-7 text-white/70 sm:text-lg">
                    Renueva aquí de forma más rápida y mantén activa tu oficina
                    virtual sin interrupciones.
                </p>
            </div>

            <div className="relative mt-8 shrink-0 lg:mt-0">
                <ButtonLink
                    href="#contacto"
                    className="w-full min-w-56 sm:w-auto"
                >
                    Renovar mi contrato
                    <ArrowIcon />
                </ButtonLink>
            </div>
        </div>
    );
}

function ArrowIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            className="size-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
        </svg>
    );
}

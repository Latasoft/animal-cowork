import { ShieldCheck } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { DataStateCard } from '@/components/ui/data-state-card';
import { PlanCard } from '@/components/ui/plan-card';
import { RenewalCard } from '@/components/ui/renewalCard';
import type { Plan } from '@/types/plan';

interface PlansSectionProps {
    plans: Plan[];
    plansUnavailable: boolean;
}

export function PlansSection({ plans, plansUnavailable }: PlansSectionProps) {
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
                <div className="mx-auto flex max-w-3xl items-center justify-center gap-4 text-center sm:gap-6">
                    <span
                        className="h-[3px] w-12 rounded-full bg-instinct sm:w-20 lg:w-28"
                        aria-hidden="true"
                    />

                    <h2 className="shrink-0 text-3xl leading-tight font-extrabold tracking-[-0.045em] text-instinct sm:text-4xl">
                        Nuestros planes
                    </h2>

                    <span
                        className="h-[3px] w-12 rounded-full bg-instinct sm:w-20 lg:w-28"
                        aria-hidden="true"
                    />
                </div>

                {plansUnavailable ? (
                    <DataStateCard
                        state="unavailable"
                        title="No pudimos cargar los planes"
                        description="La información de contratación no está disponible en este momento. Intenta nuevamente más tarde."
                        className="mt-14"
                    />
                ) : plans.length === 0 ? (
                    <DataStateCard
                        state="empty"
                        title="No hay planes publicados"
                        description="Actualmente no existen planes disponibles para contratación."
                        className="mt-14"
                    />
                ) : (
                    <div className="mt-14 grid items-stretch gap-7 lg:grid-cols-3">
                        {plans.map((plan) => (
                            <PlanCard key={plan.slug} plan={plan} />
                        ))}
                    </div>
                )}

                <div className="">
                    <p className="mt-10 text-center text-lg font-semibold text-deep-blue">
                        <ShieldCheck className="mr-2 inline-block" />
                        Todos nuestros planes incluyen dirección aceptada por el
                        SII, y contrato 100% online.
                    </p>
                </div>

                <RenewalCard />
            </Container>
        </section>
    );
}

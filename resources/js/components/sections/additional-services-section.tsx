import { router } from '@inertiajs/react';
import {
    ArrowRight,
    Building2,
    FileSignature,
    Store,
    MousePointerClick,
    FileSearchCorner,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { ButtonArrow } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import SketchAccent from '@/components/ui/sketch-accent';
import type {
    AdditionalService,
    AdditionalServiceIcon,
    OfficeSetupStep,
    OfficeSetupStepIcon,
} from '@/types/additional-services';

interface AdditionalServicesSectionProps {
    services: AdditionalService[];
    steps: OfficeSetupStep[];
}

export function AdditionalServicesSection({
    services,
    steps,
}: AdditionalServicesSectionProps) {
    return (
        <section
            id="servicios-adicionales"
            className="relative overflow-hidden bg-white py-8 sm:py-10 lg:py-12"
        >
            {/* Cards de servicios */}
            <Container>
                <div className="mx-auto max-w-7xl">
                    <div className="grid gap-5 lg:grid-cols-[1.08fr_0.96fr_0.96fr]">
                        <IntroCard />

                        {services.map((service) => (
                            <AdditionalServiceCard
                                key={service.id}
                                service={service}
                            />
                        ))}
                    </div>
                </div>
            </Container>

            {/* Bloque full-width de pasos */}
            <div className="mt-10 bg-deep-blue py-10 sm:mt-12 sm:py-12 lg:py-14">
                <Container>
                    <div className="mx-auto max-w-7xl">
                        <div className="flex items-center justify-center gap-3 text-center">
                            <SketchAccent />

                            <h3 className="text-2xl font-extrabold tracking-[-0.035em] text-balance text-white sm:text-3xl">
                                En 3 simples pasos tendrás tu oficina virtual
                                lista
                            </h3>
                        </div>

                        <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-stretch">
                            {steps.map((step, index) => (
                                <StepGroup
                                    key={step.id}
                                    step={step}
                                    showConnector={
                                        index < steps.length - 1
                                    }
                                />
                            ))}
                        </div>
                    </div>
                </Container>
            </div>
        </section>
    );
}

function IntroCard() {
    return (
        <article className="rounded-[1.5rem] border border-deep-blue/10 bg-[#fcfcfa] p-6 sm:p-7">
            <div className="flex items-start gap-3">
                <SketchAccent />

                <h2 className="text-2xl leading-tight font-extrabold tracking-[-0.04em] text-balance text-deep-blue sm:text-[2rem]">
                    ¿Necesitas{' '}
                    <span className="text-instinct">
                        servicios adicionales?
                    </span>
                </h2>
            </div>

            <p className="mt-4 text-sm leading-6 font-semibold text-deep-blue sm:text-base">
                Haz crecer tu territorio de negocios.
            </p>

            <p className="mt-3 max-w-md text-sm leading-6 text-deep-blue sm:text-[0.95rem]">
                Complementa tu contratación con alguno de nuestros servicios y
                realiza todo el proceso en un solo lugar.
            </p>
        </article>
    );
}

interface AdditionalServiceCardProps {
    service: AdditionalService;
}

function AdditionalServiceCard({ service }: AdditionalServiceCardProps) {
    const Icon = serviceIcons[service.icon];

    return (
        <article className="flex h-full flex-col rounded-[1.5rem] border border-deep-blue/10 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-7">
            <div className="flex items-start gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl text-instinct">
                    <Icon className="size-14" strokeWidth={2} aria-hidden />
                </div>

                <div>
                    <h3 className="text-sm leading-5 font-extrabold tracking-[0.02em] text-balance text-deep-blue uppercase sm:text-base">
                        {service.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-deep-blue">
                        {service.description}
                    </p>
                </div>
            </div>

            <div className="mt-auto pt-6">
                <ButtonArrow
                    href={service.action.href}
                    className="h-11 w-full px-4 text-xs font-extrabold tracking-[0.04em] sm:w-auto"
                    onClick={(event) => {
                        if (!service.action.href.startsWith('/')) {
                            return;
                        }

                        event.preventDefault();
                        router.visit(service.action.href);
                    }}
                >
                    {service.action.label}
                </ButtonArrow>
            </div>
        </article>
    );
}

interface StepGroupProps {
    step: OfficeSetupStep;
    showConnector: boolean;
}

function StepGroup({ step, showConnector }: StepGroupProps) {
    return (
        <>
            <StepCard step={step} />

            {showConnector && <StepConnector />}
        </>
    );
}

interface StepCardProps {
    step: OfficeSetupStep;
}

function StepCard({ step }: StepCardProps) {
    const Icon = stepIcons[step.icon];

    return (
        <article className="flex h-full flex-col rounded-[1.5rem] border border-deep-blue/10 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-6">
            <div className="flex items-center gap-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-instinct text-sm font-extrabold text-white">
                    {step.step}
                </span>

                <h4 className="text-base font-extrabold tracking-[-0.02em] text-deep-blue sm:text-lg">
                    {step.title}
                </h4>
            </div>

            <div className="mt-5 flex items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl text-deep-blue">
                    <Icon className="size-14" strokeWidth={2} aria-hidden />
                </div>

                <p className="text-sm leading-6 text-muted">
                    {step.description}
                </p>
            </div>

            {step.action && (
                <div className="mt-auto pt-6">
                    <ButtonArrow
                        href={step.action.href}
                        className="h-11 w-full px-4 text-xs font-extrabold tracking-[0.04em] sm:w-auto"
                    >
                        {step.action.label}
                    </ButtonArrow>
                </div>
            )}
        </article>
    );
}

function StepConnector() {
    return (
        <div className="hidden items-center justify-center lg:flex">
            <ArrowRight
                className="size-6 text-deep-blue/40"
                strokeWidth={2}
                aria-hidden
            />
        </div>
    );
}

const serviceIcons: Record<AdditionalServiceIcon, LucideIcon> = {
    patent: Store,
    company: Building2,
};

const stepIcons: Record<OfficeSetupStepIcon, LucideIcon> = {
    'select-plan': MousePointerClick,
    'fill-form': FileSignature,
    'review-contract': FileSearchCorner,
};

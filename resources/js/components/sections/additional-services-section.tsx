import {
    ArrowRight,
    Building2,
    ClipboardList,
    FileSignature,
    Store,
    WandSparkles,
    type LucideIcon,
} from 'lucide-react';

import { ButtonArrow } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
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
            className="scroll-mt-24 bg-[#f8f8f5] py-16 sm:py-20 lg:py-24"
        >
            <Container>
                <div className="rounded-[2rem] border border-deep-blue/8 bg-white px-5 py-6 shadow-[0_18px_45px_rgba(13,27,61,0.06)] sm:px-8 sm:py-8 lg:px-10 lg:py-10">
                    <div className="grid gap-5 lg:grid-cols-[1.08fr_0.96fr_0.96fr]">
                        <IntroCard />

                        {services.map((service) => (
                            <AdditionalServiceCard
                                key={service.id}
                                service={service}
                            />
                        ))}
                    </div>

                    <div className="mt-10 border-t border-deep-blue/10 pt-8 sm:mt-12 sm:pt-10">
                        <div className="flex items-center justify-center gap-3 text-center">
                            <SketchAccent />

                            <h3 className="text-balance text-2xl font-extrabold tracking-[-0.035em] text-deep-blue sm:text-3xl">
                                En 3 simples pasos tendrás tu oficina virtual
                                lista
                            </h3>
                        </div>

                        <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-stretch">
                            {steps.map((step, index) => (
                                <StepGroup
                                    key={step.id}
                                    step={step}
                                    showConnector={index < steps.length - 1}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}

function IntroCard() {
    return (
        <article className="rounded-[1.5rem] border border-deep-blue/10 bg-[#fcfcfa] p-6 sm:p-7">
            <div className="flex items-start gap-3">
                <SketchAccent />

                <h2 className="text-balance text-2xl leading-tight font-extrabold tracking-[-0.04em] text-deep-blue sm:text-[2rem]">
                    ¿Necesitas{' '}
                    <span className="text-instinct">
                        servicios adicionales?
                    </span>
                </h2>
            </div>

            <p className="mt-4 text-sm leading-6 font-semibold text-deep-blue sm:text-base">
                Haz crecer tu territorio de negocios.
            </p>

            <p className="mt-3 max-w-md text-sm leading-6 text-muted sm:text-[0.95rem]">
                Complementa tu contratación con alguno de nuestros servicios y
                realiza todo el proceso en un solo lugar.
            </p>
        </article>
    );
}

interface AdditionalServiceCardProps {
    service: AdditionalService;
}

function AdditionalServiceCard({
    service,
}: AdditionalServiceCardProps) {
    const Icon = serviceIcons[service.icon];

    return (
        <article className="flex h-full flex-col rounded-[1.5rem] border border-deep-blue/10 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-7">
            <div className="flex items-start gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-instinct-light text-instinct">
                    <Icon
                        className="size-7"
                        strokeWidth={2}
                        aria-hidden
                    />
                </div>

                <div>
                    <h3 className="text-balance text-sm leading-5 font-extrabold tracking-[0.02em] text-deep-blue uppercase sm:text-base">
                        {service.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-muted">
                        {service.description}
                    </p>
                </div>
            </div>

            <div className="mt-auto pt-6">
                <ButtonArrow
                    href={service.action.href}
                    className="h-11 w-full px-4 text-xs font-extrabold tracking-[0.04em] sm:w-auto"
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

function StepGroup({
    step,
    showConnector,
}: StepGroupProps) {
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
                <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-deep-blue/6 text-deep-blue">
                    <Icon
                        className="size-6"
                        strokeWidth={2}
                        aria-hidden
                    />
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

function SketchAccent() {
    return (
        <div
            className="mt-1 flex shrink-0 flex-col gap-[6px] text-instinct"
            aria-hidden
        >
            <span className="block h-[3px] w-6 -rotate-45 rounded-full bg-current" />
            <span className="block h-[3px] w-8 -rotate-12 rounded-full bg-current" />
            <span className="block h-[3px] w-6 rotate-[30deg] rounded-full bg-current" />
        </div>
    );
}

const serviceIcons: Record<AdditionalServiceIcon, LucideIcon> = {
    patent: Store,
    company: Building2,
};

const stepIcons: Record<OfficeSetupStepIcon, LucideIcon> = {
    'select-plan': WandSparkles,
    'fill-form': ClipboardList,
    'review-contract': FileSignature,
};
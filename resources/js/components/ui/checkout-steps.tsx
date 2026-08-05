import { Check } from 'lucide-react';

interface CheckoutStepsProps {
    currentStep?: 1 | 2 | 3;
}

const steps = [
    {
        number: 1,
        label: 'Plan y pago',
    },
    {
        number: 2,
        label: 'Ingreso de datos',
    },
    {
        number: 3,
        label: 'Previsualización',
    },
] as const;

export function CheckoutSteps({
    currentStep = 1,
}: CheckoutStepsProps) {
    return (
        <nav
            aria-label="Progreso de contratación"
            className="mx-auto flex max-w-2xl items-center justify-center"
        >
            {steps.map((step, index) => {
                const isCompleted = step.number < currentStep;
                const isActive = step.number === currentStep;

                return (
                    <div
                        key={step.number}
                        className="flex flex-1 items-center last:flex-none"
                    >
                        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                            <span
                                className={[
                                    'flex size-9 items-center justify-center rounded-full border text-sm font-extrabold transition-colors',
                                    isCompleted
                                        ? 'border-instinct bg-instinct text-white'
                                        : isActive
                                          ? 'border-deep-blue bg-deep-blue text-white'
                                          : 'border-deep-blue/15 bg-white text-deep-blue/45',
                                ].join(' ')}
                                aria-current={
                                    isActive ? 'step' : undefined
                                }
                            >
                                {isCompleted ? (
                                    <Check
                                        className="size-4"
                                        strokeWidth={2.5}
                                        aria-hidden
                                    />
                                ) : (
                                    step.number
                                )}
                            </span>

                            <span
                                className={[
                                    'hidden text-xs font-extrabold tracking-[0.12em] uppercase sm:block',
                                    isCompleted || isActive
                                        ? 'text-deep-blue'
                                        : 'text-deep-blue/40',
                                ].join(' ')}
                            >
                                {step.label}
                            </span>
                        </div>

                        {index < steps.length - 1 && (
                            <span
                                className={[
                                    'mx-3 h-px flex-1 sm:mx-5',
                                    step.number < currentStep
                                        ? 'bg-instinct'
                                        : 'bg-deep-blue/12',
                                ].join(' ')}
                                aria-hidden
                            />
                        )}
                    </div>
                );
            })}
        </nav>
    );
}
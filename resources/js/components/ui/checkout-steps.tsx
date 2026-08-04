import {
    Check,
} from 'lucide-react';

export function CheckoutSteps() {
    const steps = [
        {
            number: 1,
            label: 'Datos y pago',
            active: true,
        },
        {
            number: 2,
            label: 'Firma electrónica',
            active: false,
        },
        {
            number: 3,
            label: 'Contrato',
            active: false,
        },
    ];

    return (
        <nav
            aria-label="Progreso de contratación"
            className="mx-auto flex max-w-2xl items-center justify-center"
        >
            {steps.map((step, index) => (
                <div
                    key={step.number}
                    className="flex flex-1 items-center last:flex-none"
                >
                    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                        <span
                            className={[
                                'flex size-9 items-center justify-center rounded-full border text-sm font-extrabold transition-colors',
                                step.active
                                    ? 'border-instinct bg-instinct text-white'
                                    : 'border-deep-blue/15 bg-white text-deep-blue/45',
                            ].join(' ')}
                        >
                            {step.active ? (
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
                                step.active
                                    ? 'text-deep-blue'
                                    : 'text-deep-blue/40',
                            ].join(' ')}
                        >
                            {step.label}
                        </span>
                    </div>

                    {index < steps.length - 1 && (
                        <span
                            className="mx-3 h-px flex-1 bg-deep-blue/12 sm:mx-5"
                            aria-hidden
                        />
                    )}
                </div>
            ))}
        </nav>
    );
}
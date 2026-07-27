import { ButtonLink } from '@/components/ui/button';
import type { Plan, PlanTheme } from '@/types/plan';

interface PlanCardProps {
    plan: Plan;
}

const themes: Record<
    PlanTheme,
    {
        accent: string;
        badge: string;
        icon: string;
        buttonVariant: 'primary' | 'secondary';
    }
> = {
    green: {
        accent: 'text-instinct-dark',
        badge: 'bg-instinct-dark text-white',
        icon: 'bg-instinct-light text-instinct-dark',
        buttonVariant: 'secondary',
    },
    orange: {
        accent: 'text-orange-600',
        badge: 'bg-orange-600 text-white',
        icon: 'bg-orange-50 text-orange-600',
        buttonVariant: 'primary',
    },
    gold: {
        accent: 'text-amber-600',
        badge: 'bg-amber-500 text-deep-blue',
        icon: 'bg-amber-50 text-amber-600',
        buttonVariant: 'secondary',
    },
};

export function PlanCard({ plan }: PlanCardProps) {
    const theme = themes[plan.theme];

    return (
        <article
            className={[
                'relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border bg-white',
                'transition duration-300 hover:-translate-y-1 hover:shadow-2xl',
                plan.featured
                    ? 'border-instinct shadow-xl ring-4 ring-instinct/10'
                    : 'border-deep-blue/10 shadow-card',
            ].join(' ')}
        >
            {plan.badge && (
                <div
                    className={[
                        'absolute top-5 left-5 z-20 inline-flex items-center gap-2 rounded-lg px-4 py-2',
                        'text-xs font-extrabold tracking-wide uppercase shadow-lg',
                        theme.badge,
                    ].join(' ')}
                >
                    <StarIcon />
                    {plan.badge}
                </div>
            )}

            <div className="relative h-72 overflow-hidden bg-background sm:h-80">
                <img
                    src={plan.image}
                    alt={plan.imageAlt}
                    className="h-full w-full object-cover object-center transition duration-500 hover:scale-105"
                    loading="lazy"
                />

                <div
                    className="absolute inset-0 bg-gradient-to-t from-white via-white/5 to-transparent"
                    aria-hidden="true"
                />
            </div>

            <div className="relative -mt-12 flex flex-1 flex-col px-6 pb-7 sm:px-7">
                <div>
                    <p
                        className={[
                            'text-xs font-extrabold tracking-[0.18em] uppercase',
                            theme.accent,
                        ].join(' ')}
                    >
                        Plan
                    </p>

                    <h3 className="mt-1 text-4xl font-extrabold tracking-[-0.045em] text-deep-blue">
                        {plan.name}
                    </h3>

                    <p
                        className={[
                            'mt-2 text-sm font-bold',
                            theme.accent,
                        ].join(' ')}
                    >
                        {plan.tagline}
                    </p>
                </div>

                <div className="mt-7">
                    <p className="text-4xl font-extrabold tracking-[-0.04em] text-deep-blue">
                        {plan.price}
                    </p>

                    <p className="mt-1 text-sm font-semibold text-muted">
                        {plan.duration}
                    </p>
                </div>

                <ul className="mt-7 flex-1 space-y-4">
                    {plan.features.map((feature) => (
                        <li
                            key={feature}
                            className="flex items-start gap-3 text-sm leading-6 font-medium text-deep-blue/80"
                        >
                            <span
                                className={[
                                    'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full',
                                    theme.icon,
                                ].join(' ')}
                            >
                                <CheckIcon />
                            </span>

                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>

                <ButtonLink
                    href={plan.action.href}
                    variant={theme.buttonVariant}
                    className="mt-8 w-full px-4 text-center"
                >
                    <span className="line-clamp-1">{plan.action.label}</span>
                    <ArrowIcon />
                </ButtonLink>
            </div>
        </article>
    );
}

function CheckIcon() {
    return (
        <svg
            viewBox="0 0 20 20"
            className="size-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <path d="m5 10 3 3 7-7" />
        </svg>
    );
}

function StarIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            className="size-4"
            fill="currentColor"
            aria-hidden="true"
        >
            <path d="m12 2.7 2.8 5.7 6.3.9-4.6 4.4 1.1 6.3-5.6-3-5.6 3 1.1-6.3-4.6-4.4 6.3-.9L12 2.7Z" />
        </svg>
    );
}

function ArrowIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            className="size-4 shrink-0"
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
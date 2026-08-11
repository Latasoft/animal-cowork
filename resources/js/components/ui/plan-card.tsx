import { ButtonLink } from '@/components/ui/button';
import { formatClp, getPlanTotalPrice } from '@/data/plans';
import type { Plan, PlanTheme } from '@/types/plan';
import {
    Check,
    Star
} from 'lucide-react';


interface PlanCardProps {
    plan: Plan;
}

const themes: Record<
    PlanTheme,
    {
        accent: string;
        badge: string;
        buttonVariant: 'primary' | 'secondary';
    }
> = {
    green: {
        accent: 'text-instinct-dark',
        badge: 'bg-instinct-dark text-white',
        buttonVariant: 'secondary',
    },
    orange: {
        accent: 'text-orange-600',
        badge: 'bg-orange-600 text-white',
        buttonVariant: 'primary',
    },
    gold: {
        accent: 'text-amber-600',
        badge: 'bg-amber-500 text-deep-blue',
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
                    <Star className="size-3" aria-hidden="true" />
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
                    </p>
                </div>

                <ul className="mt-7 flex-1 space-y-2">
                    {plan.features.map((feature) => (
                        <li
                            key={feature}
                            className="flex items-start gap-3 text-sm leading-6 font-medium text-deep-blue/80"
                        >
                            <span
                                className={[
                                    'mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md',
                                    'bg-instinct text-white',
                                ].join(' ')}
                            >
                                <Check className="size-3" aria-hidden="true" />
                            </span>

                            <span>{feature}</span>
                        </li>
                    ))}
                </ul>

                <div className="mt-7 text-center">
                    <p className="text-sm font-bold text-deep-blue text-align-center sm:text-left">
                        Desde 
                    </p>
                    <p className="text-4xl font-bold tracking-[-0.04em] text-instinct sm:text-5xl text-center">
                        {formatClp(getPlanTotalPrice(plan))}
                        <span className="text-sm font-bold text-instinct"> / mes</span>
                    </p>


                </div>

                <ButtonLink
                    href={plan.action.href}
                    variant={theme.buttonVariant}
                    className="mt-8 w-full justify-center px-4"
                >
                    <span className="line-clamp-1 text-center">{plan.action.label}</span>
                </ButtonLink>
            </div>
        </article>
    );
}


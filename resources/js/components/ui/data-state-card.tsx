import { CloudOff, Inbox, LoaderCircle } from 'lucide-react';

type DataState = 'loading' | 'empty' | 'unavailable';

interface DataStateCardProps {
    state: DataState;
    title: string;
    description: string;
    className?: string;
}

const icons = {
    loading: LoaderCircle,
    empty: Inbox,
    unavailable: CloudOff,
};

export function DataStateCard({
    state,
    title,
    description,
    className = '',
}: DataStateCardProps) {
    const Icon = icons[state];

    return (
        <div
            role={state === 'unavailable' ? 'alert' : 'status'}
            aria-live="polite"
            className={[
                'flex min-h-52 flex-col items-center justify-center rounded-card border bg-white p-8 text-center shadow-card',
                state === 'unavailable'
                    ? 'border-amber-200'
                    : 'border-deep-blue/10',
                className,
            ].join(' ')}
        >
            <span
                className={[
                    'flex size-12 items-center justify-center rounded-full',
                    state === 'unavailable'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-instinct/10 text-instinct-dark',
                ].join(' ')}
            >
                <Icon
                    className={[
                        'size-6',
                        state === 'loading' ? 'animate-spin' : '',
                    ].join(' ')}
                    aria-hidden
                />
            </span>

            <h3 className="mt-4 text-xl font-extrabold tracking-[-0.03em] text-deep-blue">
                {title}
            </h3>
            <p className="mt-2 max-w-lg text-sm leading-6 text-deep-blue/60">
                {description}
            </p>
        </div>
    );
}

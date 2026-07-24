import type {
    AnchorHTMLAttributes,
    ButtonHTMLAttributes,
    ReactNode,
} from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline';

type SharedButtonProps = {
    children: ReactNode;
    className?: string;
    variant?: ButtonVariant;
};

type ButtonProps = SharedButtonProps &
    Omit<
        ButtonHTMLAttributes<HTMLButtonElement>,
        'children' | 'className'
    >;

type ButtonLinkProps = SharedButtonProps &
    Omit<
        AnchorHTMLAttributes<HTMLAnchorElement>,
        'children' | 'className'
    >;

const variants: Record<ButtonVariant, string> = {
    primary:
        'bg-instinct text-white hover:bg-instinct-dark focus-visible:outline-instinct',
    secondary:
        'bg-deep-blue text-white hover:bg-deep-blue-light focus-visible:outline-deep-blue',
    outline:
        'border border-deep-blue/20 bg-transparent text-deep-blue hover:border-instinct hover:bg-instinct-light focus-visible:outline-instinct',
};

function getButtonClasses(
    variant: ButtonVariant,
    className: string,
): string {
    return [
        'inline-flex min-h-12 items-center justify-center gap-2 rounded-button px-6 py-3',
        'text-sm font-bold transition duration-200',
        'focus-visible:outline-2 focus-visible:outline-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        variants[variant],
        className,
    ].join(' ');
}

export function Button({
    children,
    className = '',
    variant = 'primary',
    type = 'button',
    ...props
}: ButtonProps) {
    return (
        <button
            type={type}
            className={getButtonClasses(variant, className)}
            {...props}
        >
            {children}
        </button>
    );
}

export function ButtonLink({
    children,
    className = '',
    variant = 'primary',
    ...props
}: ButtonLinkProps) {
    return (
        <a
            className={getButtonClasses(variant, className)}
            {...props}
        >
            {children}
        </a>
    );
}
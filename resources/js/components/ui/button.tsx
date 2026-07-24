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
    `
    bg-amarillo
    text-black
    shadow-lg
    shadow-amarillo/20
    hover:-translate-y-0.5
    hover:bg-amarillo-dark
    hover:shadow-xl
    hover:shadow-amarillo/30
    focus-visible:outline-amarillo
    `,
    secondary:
        'bg-deep-blue text-white hover:bg-deep-blue-light focus-visible:outline-deep-blue',
    outline:
        'border border-deep-blue/20 bg-transparent text-deep-blue hover:border-amarillo hover:bg-amarillo-light focus-visible:outline-amarillo',
};

function getButtonClasses(
    variant: ButtonVariant,
    className: string,
): string {
return [
    'inline-flex h-12 items-center justify-center gap-2',
    'rounded-xl',
    'px-7',
    'text-[15px]',
    'font-semibold',
    'tracking-[-0.01em]',
    'transition-all duration-300',
    'active:scale-[0.98]',
    'focus-visible:outline-2',
    'focus-visible:outline-offset-2',
    'disabled:pointer-events-none',
    'disabled:opacity-50',
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
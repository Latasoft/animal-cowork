import type {
    AnchorHTMLAttributes,
    ButtonHTMLAttributes,
    ReactNode,
} from 'react';
import { ArrowRight } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'btnArrow';

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
    primary: `
        bg-instinct
        text-white
        hover:bg-instinct-dark
        focus-visible:outline-instinct
    `,

    secondary: `
        border
        border-deep-blue
        bg-deep-blue
        text-white
        hover:bg-deep-blue-light
        hover:text-white
        focus-visible:outline-deep-blue
    `,

    outline: `
        border
        border-deep-blue
        bg-transparent
        text-deep-blue
        hover:border-instinct
        hover:bg-instinct-light
        focus-visible:outline-instinct
    `,

    btnArrow: `
        justify-between
        bg-instinct
        text-white
        hover:bg-instinct-dark
        focus-visible:outline-instinct
        group
    `,
};

function getButtonClasses(
    variant: ButtonVariant,
    className: string,
): string {
    return [
        'inline-flex h-12 items-center gap-3',
        'rounded-md',
        'px-5',
        'text-[12px]',
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

export function ButtonSecondary({
    children,
    className = '',
    variant = 'secondary',
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

export function ButtonArrow({
    children,
    className = '',
    variant = 'btnArrow',
    ...props
}: ButtonLinkProps) {
    return (
        <a
            className={getButtonClasses(variant, className)}
            {...props}
        >
            <span>{children}</span>

            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-deep-blue text-white transition-transform duration-300 group-hover:translate-x-1">
                <ArrowRight
                    className="size-4"
                    strokeWidth={2.5}
                    aria-hidden="true"
                />
            </span>
        </a>
    );
}
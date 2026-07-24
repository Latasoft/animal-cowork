import { useEffect, useState } from 'react';
import { ButtonLink } from '@/components/ui/button';
import { Container } from '@/components/ui/container';

interface NavigationItem {
    label: string;
    href: string;
}

const navigation: NavigationItem[] = [
    {
        label: 'Beneficios',
        href: '#beneficios',
    },
    {
        label: 'Planes',
        href: '#planes',
    },
    {
        label: 'Cómo funciona',
        href: '#como-funciona',
    },
    {
        label: 'Preguntas frecuentes',
        href: '#preguntas',
    },
    {
        label: 'Contacto',
        href: '#contacto',
    },
];

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';

        return () => {
            document.body.style.overflow = '';
        };
    }, [isMenuOpen]);

    function closeMenu() {
        setIsMenuOpen(false);
    }

    return (
        <header className="sticky top-0 z-50 border-b border-deep-blue/8 bg-white/90 backdrop-blur-xl">
            <Container>
                <div className="flex min-h-20 items-center justify-between gap-6">
                    <a
                        href="#inicio"
                        className="group flex shrink-0 items-center gap-3"
                        aria-label="Animal Co-work, ir al inicio"
                        onClick={closeMenu}
                    >
                        <span className="flex size-11 items-center justify-center rounded-2xl bg-deep-blue transition-transform duration-200 group-hover:-rotate-3">
                            <svg
                                viewBox="0 0 32 32"
                                className="size-6 text-instinct"
                                fill="none"
                                aria-hidden="true"
                            >
                                <path
                                    d="M7 23.5 12.2 9l3.8 8.2L19.8 9 25 23.5"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M10 21h12"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </span>

                        <span className="leading-none">
                            <span className="block text-base font-extrabold tracking-[-0.035em] text-deep-blue">
                                ANIMAL
                            </span>

                            <span className="mt-1 block text-[0.65rem] font-bold tracking-[0.2em] text-instinct-dark">
                                CO-WORK
                            </span>
                        </span>
                    </a>

                    <nav
                        className="hidden items-center gap-7 lg:flex"
                        aria-label="Navegación principal"
                    >
                        {navigation.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                className="relative py-2 text-sm font-semibold text-deep-blue/70 transition-colors hover:text-deep-blue"
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>

                    <div className="hidden shrink-0 lg:block">
                        <ButtonLink href="#planes">
                            Contratar ahora
                            <ArrowIcon />
                        </ButtonLink>
                    </div>

                    <button
                        type="button"
                        className="inline-flex size-12 items-center justify-center rounded-full border border-deep-blue/10 bg-white text-deep-blue transition hover:bg-instinct-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-instinct lg:hidden"
                        aria-label={
                            isMenuOpen
                                ? 'Cerrar menú de navegación'
                                : 'Abrir menú de navegación'
                        }
                        aria-expanded={isMenuOpen}
                        aria-controls="mobile-navigation"
                        onClick={() => setIsMenuOpen((current) => !current)}
                    >
                        {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
                    </button>
                </div>
            </Container>

            <div
                id="mobile-navigation"
                className={[
                    'fixed inset-x-0 top-20 h-[calc(100dvh-5rem)] bg-white transition duration-300 lg:hidden',
                    isMenuOpen
                        ? 'visible translate-y-0 opacity-100'
                        : 'invisible -translate-y-3 opacity-0',
                ].join(' ')}
            >
                <Container className="flex h-full flex-col py-7">
                    <nav
                        className="flex flex-col"
                        aria-label="Navegación móvil"
                    >
                        {navigation.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                className="border-b border-deep-blue/8 py-5 text-lg font-bold text-deep-blue transition-colors hover:text-instinct-dark"
                                onClick={closeMenu}
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>

                    <div className="mt-auto space-y-4 pb-8">
                        <p className="text-sm leading-6 text-muted">
                            Contrata tu oficina virtual de forma rápida, segura
                            y completamente online.
                        </p>

                        <ButtonLink
                            href="#planes"
                            className="w-full"
                            onClick={closeMenu}
                        >
                            Quiero mi oficina virtual
                            <ArrowIcon />
                        </ButtonLink>
                    </div>
                </Container>
            </div>
        </header>
    );
}

function MenuIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            className="size-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
        >
            <path d="M4 7h16" />
            <path d="M4 12h16" />
            <path d="M4 17h16" />
        </svg>
    );
}

function CloseIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            className="size-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
        >
            <path d="m6 6 12 12" />
            <path d="M18 6 6 18" />
        </svg>
    );
}

function ArrowIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            className="size-4"
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

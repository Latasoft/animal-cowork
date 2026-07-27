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
        <header className="sticky top-0 z-50 border-b border-deep-blue/8 bg-white/95 backdrop-blur-xl">
            <Container>
                <div className="flex min-h-24 items-center justify-between gap-5">
                    <a
                        href="#inicio"
                        aria-label="Animal Co-work, ir al inicio"
                        onClick={closeMenu}
                        className="shrink-0 transition duration-300 hover:opacity-90"
                    >
                        <img
                            src="/images/Logo/Logo.jpg"
                            alt="Animal Co-work"
                            className="h-14 w-auto object-contain transition duration-300 lg:h-16"
                        />
                    </a>

                    <nav
                        className="hidden items-center gap-6 xl:flex"
                        aria-label="Navegación principal"
                    >
                        {navigation.map((item) => (
                            <a
                                key={item.href}
                                href={item.href}
                                className="group relative py-5 text-lg font-semibold text-deep-blue transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-0 after:bg-amarillo after:transition-all after:duration-300 hover:after:w-full"
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>

                    <div className="hidden shrink-0 xl:block">
                        <ButtonLink href="#planes">
                            Quiero mi oficina virtual
                        </ButtonLink>
                    </div>

                    <button
                        type="button"
                        className="inline-flex size-12 items-center justify-center rounded-full border border-deep-blue/10 bg-white text-deep-blue transition hover:border-amarillo/40 hover:bg-amarillo-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amarillo xl:hidden"
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
                    'fixed inset-x-0 top-24 h-[calc(100dvh-6rem)] bg-white transition-all duration-300 xl:hidden',
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
                                className="border-b border-deep-blue/8 py-5 text-lg font-bold text-deep-blue transition-colors duration-200 hover:text-instinct-dark"
                                onClick={closeMenu}
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>

                    <div className="mt-auto space-y-5 pb-8">
                        <div className="rounded-2xl bg-instinct-light p-5">
                            <p className="text-sm font-bold text-deep-blue">
                                Contratación rápida y completamente online
                            </p>

                            <p className="mt-2 text-sm leading-6 text-muted">
                                Obtén tu dirección tributaria y firma tu
                                contrato de manera segura.
                            </p>
                        </div>

                        <ButtonLink
                            href="#planes"
                            className="w-full"
                            onClick={closeMenu}
                        >
                            Quiero mi oficina virtual
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

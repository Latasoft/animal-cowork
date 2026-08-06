import { Icon } from '@iconify/react';

import { Mail, MapPin, Phone } from 'lucide-react';

import { Container } from '@/components/ui/container';

const footerLinks = [
    {
        label: 'Inicio',
        href: '#inicio',
    },
    {
        label: 'Planes',
        href: '#planes',
    },
    {
        label: 'Servicios adicionales',
        href: '#servicios-adicionales',
    },
    {
        label: 'Sala de reuniones',
        href: '#sala-reuniones',
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

const socialLinks = [
    {
        label: 'Instagram',
        href: 'https://www.instagram.com/animalcowork_oficinavirtual?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
        icon: 'simple-icons:instagram',
    },
    {
        label: 'TikTok',
        href: 'https://www.tiktok.com/@animal.cowork?_r=1&_t=ZS-98ZsO1Gugon',
        icon: 'simple-icons:tiktok',
    },
    {
        label: 'WhatsApp',
        href: 'https://wa.me/56990556983',
        icon: 'simple-icons:whatsapp',
    },
];

export function Footer() {
    return (
        <footer
            id="contacto"
            className="relative overflow-hidden border-t-4 border-instinct bg-deep-blue text-white"
        >
            <Container className="relative">
                <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.25fr_0.9fr_0.8fr_1.1fr] lg:gap-12 lg:py-14">
                    {/* Logo */}
                    <div>
                        <a
                            href="#inicio"
                            className="inline-flex transition duration-300 hover:opacity-90"
                            aria-label="Animal Co-work"
                        >
                            <img
                                src="/images/Logo/logo.webp"
                                alt="Animal Co-work"
                                className="h-16 w-auto object-contain"
                            />
                        </a>

                        <p className="mt-5 max-w-xs text-sm leading-6 text-white/65">
                            La oficina virtual más conveniente de Chile.
                            Dirección tributaria, contratación digital y
                            servicios para emprendedores.
                        </p>
                    </div>

                    {/* Enlaces */}
                    <div>
                        <h2 className="text-xs font-extrabold tracking-[0.18em] uppercase">
                            Enlaces rápidos
                        </h2>

                        <nav
                            className="mt-5 flex flex-col gap-3"
                            aria-label="Footer"
                        >
                            {footerLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className="w-fit text-sm text-white/65 transition-colors duration-200 hover:text-instinct"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </nav>
                    </div>

                    {/* Redes */}
                    <div>
                        <h2 className="text-xs font-extrabold tracking-[0.18em] uppercase">
                            Síguenos
                        </h2>

                        <div className="mt-5 flex gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-instinct hover:bg-instinct"
                                >
                                    <Icon
                                        icon={social.icon}
                                        width={18}
                                        height={18}
                                    />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Contacto */}
                    <div>
                        <h2 className="text-xs font-extrabold tracking-[0.18em] uppercase">
                            Contáctanos
                        </h2>

                        <div className="mt-5 space-y-4">
                            <a
                                href="tel:+56912345678"
                                className="group flex items-start gap-3"
                            >
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/8 text-instinct transition group-hover:bg-instinct group-hover:text-white">
                                    <Phone
                                        className="h-4 w-4"
                                        strokeWidth={2}
                                    />
                                </span>

                                <span className="pt-1 text-sm text-white/65 transition group-hover:text-white">
                                    +56 9 9055 6983
                                </span>
                            </a>

                            <a
                                href="mailto:hola@animalcowork.cl"
                                className="group flex items-start gap-3"
                            >
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/8 text-instinct transition group-hover:bg-instinct group-hover:text-white">
                                    <Mail className="h-4 w-4" strokeWidth={2} />
                                </span>

                                <span className="pt-1 text-sm text-white/65 transition group-hover:text-white">
                                    Oficinavirtual@animalcoworking.cl
                                </span>
                            </a>

                            <div className="flex items-start gap-3">
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/8 text-instinct">
                                    <MapPin
                                        className="h-4 w-4"
                                        strokeWidth={2}
                                    />
                                </span>

                                <span className="pt-1 text-sm leading-6 text-white/65">
                                    EULOGIA SANCHEZ 065 PROVIDENCIA,
                                    <br />
                                    Santiago, Chile
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="flex flex-col gap-4 border-t border-white/10 py-6 text-sm text-white/45 md:flex-row md:items-center md:justify-between">
                    <p>
                        © {new Date().getFullYear()} Animal Co-work. Todos los
                        derechos reservados.
                    </p>

                    <div className="flex gap-6">
                        <a
                            href="#"
                            className="transition-colors hover:text-instinct"
                        >
                            Política de privacidad
                        </a>

                        <a
                            href="#"
                            className="transition-colors hover:text-instinct"
                        >
                            Términos y condiciones
                        </a>
                    </div>
                </div>
            </Container>
        </footer>
    );
}

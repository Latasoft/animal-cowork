import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ButtonLink } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { PublicLayout } from '@/layouts/public-layout';

export default function Welcome() {
    return (
        <>
            <Head title="Inicio" />

            <PublicLayout>
                <Section
                    id="inicio"
                    className="flex min-h-[calc(100vh-5rem)] scroll-mt-20 items-center bg-background"
                >
                    <Container>
                        <div className="max-w-4xl">
                            <span className="mb-6 inline-flex rounded-button bg-instinct-light px-4 py-2 text-sm font-bold text-instinct-dark">
                                Animal Co-work
                            </span>

                            <h1 className="text-5xl leading-[1.05] font-extrabold tracking-[-0.04em] text-balance text-deep-blue sm:text-6xl lg:text-7xl">
                                Base visual configurada correctamente.
                            </h1>

                            <p className="mt-7 max-w-2xl text-lg leading-8 text-muted">
                                Laravel, React, Inertia, TypeScript, Tailwind
                                CSS y la identidad visual de Animal Co-work
                                están funcionando sobre una misma base.
                            </p>

                            <div className="mt-10 flex flex-wrap gap-4">
                                <ButtonLink href="#planes">
                                    Quiero mi oficina virtual
                                </ButtonLink>

                                <Button variant="outline">
                                    Botón secundario
                                </Button>
                            </div>
                        </div>
                    </Container>
                </Section>

                <Section id="beneficios" className="scroll-mt-20 bg-white">
                    <Container>
                        <h2 className="text-4xl font-extrabold tracking-[-0.04em]">
                            Beneficios
                        </h2>
                    </Container>
                </Section>

                <Section id="planes" className="scroll-mt-20 bg-instinct-light">
                    <Container>
                        <h2 className="text-4xl font-extrabold tracking-[-0.04em]">
                            Planes
                        </h2>
                    </Container>
                </Section>

                <Section id="como-funciona" className="scroll-mt-20 bg-white">
                    <Container>
                        <h2 className="text-4xl font-extrabold tracking-[-0.04em]">
                            Cómo funciona
                        </h2>
                    </Container>
                </Section>

                <Section id="preguntas" className="scroll-mt-20 bg-background">
                    <Container>
                        <h2 className="text-4xl font-extrabold tracking-[-0.04em]">
                            Preguntas frecuentes
                        </h2>
                    </Container>
                </Section>

                <Section
                    id="contacto"
                    className="scroll-mt-20 bg-deep-blue text-white"
                >
                    <Container>
                        <h2 className="text-4xl font-extrabold tracking-[-0.04em]">
                            Contacto
                        </h2>
                    </Container>
                </Section>
            </PublicLayout>
        </>
    );
}

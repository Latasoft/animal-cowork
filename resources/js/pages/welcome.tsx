import { Head } from '@inertiajs/react';
import { HeroSection } from '@/components/sections/hero-section';
import { PlansSection } from '@/components/sections/plans-section';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { heroContent } from '@/data/home';
import { plans } from '@/data/plans';
import { PublicLayout } from '@/layouts/public-layout';

export default function Welcome() {
    return (
        <>
            <Head title="Oficina virtual en Chile">
                <meta
                    name="description"
                    content="Contrata tu oficina virtual con dirección tributaria aceptada por el SII, firma electrónica avanzada y un proceso 100% online."
                />
            </Head>

            <PublicLayout>
                <HeroSection content={heroContent} />
                <PlansSection plans={plans} />

                <Section id="beneficios" className="scroll-mt-24 bg-white">
                    <Container>
                        <h2 className="text-4xl font-extrabold tracking-[-0.04em]">
                            Beneficios
                        </h2>
                    </Container>
                </Section>

                <Section id="como-funciona" className="scroll-mt-24 bg-white">
                    <Container>
                        <h2 className="text-4xl font-extrabold tracking-[-0.04em]">
                            Cómo funciona
                        </h2>
                    </Container>
                </Section>

                <Section id="preguntas" className="scroll-mt-24 bg-background">
                    <Container>
                        <h2 className="text-4xl font-extrabold tracking-[-0.04em]">
                            Preguntas frecuentes
                        </h2>
                    </Container>
                </Section>

                <Section
                    id="contacto"
                    className="scroll-mt-24 bg-deep-blue text-white"
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

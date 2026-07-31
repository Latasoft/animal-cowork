import { Head } from '@inertiajs/react';
import { HeroSection } from '@/components/sections/hero-section';
import { PlansSection } from '@/components/sections/plans-section';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { heroContent } from '@/data/home';
import { plans } from '@/data/plans';
import { PublicLayout } from '@/layouts/public-layout';

import { AdditionalServicesSection } from '@/components/sections/additional-services-section';
import {
    additionalServices,
    officeSetupSteps,
} from '@/data/additional-services';

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

                <AdditionalServicesSection
                    services={additionalServices}
                    steps={officeSetupSteps}
                />
            </PublicLayout>
        </>
    );
}

import { Users } from 'lucide-react';

import {
    ButtonArrow,
    ButtonSecondary,
} from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import TornImage from '@/components/ui/torn-image';
import TrustBar from '@/components/ui/trust-bar';
import type { HeroContent } from '@/types/home';

interface HeroSectionProps {
    content: HeroContent;
}

export function HeroSection({
    content,
}: HeroSectionProps) {
    return (
<section className="relative overflow-hidden bg-white">
    {/* Decoración lateral */}
    <img
        src="/images/hero/trazos.webp"
        alt=""
        aria-hidden="true"
        className="
            pointer-events-none
            absolute
            top-50
            right-0
            z-0
            hidden
            h-auto
            w-40
            select-none
            opacity-90
            md:block
            lg:w-52
            xl:w-64
        "
    />
        {/* Decoración lateral */}
    <img
        src="/images/hero/trazos.webp"
        alt=""
        aria-hidden="true"
        className="
            pointer-events-none
            absolute
            top-50
            left-0
            z-0
            hidden
            h-auto
            w-40
            select-none
            opacity-90
            md:block
            lg:w-32
            xl:w-48
        "
    />

            <Container>
                <div className="relative z-10 grid items-center gap-10 py-12 lg:grid-cols-2 lg:gap-14 lg:py-16">
                    {/* Columna izquierda */}
                    <div className="relative z-10">
                        <div>
                            <h1 className="text-[clamp(2.3rem,6vw,2.4rem)] leading-[0.95] font-extrabold tracking-[-0.055em] text-deep-blue uppercase">
                                {content.title}
                            </h1>
                        </div>

                        <h2 className="mt-2 text-[clamp(2.3rem,6vw,2.4rem)] leading-[0.95] font-extrabold tracking-[-0.055em] text-instinct uppercase">
                            {content.title2}
                        </h2>

                        <p className="mt-4 text-sm font-semibold text-deep-blue sm:text-base">
                            {content.subtitle}
                        </p>

                        <div className="mt-5 inline-flex rounded-md bg-deep-blue px-4 py-2">
                            <p className="text-base leading-none font-extrabold tracking-[-0.025em] text-white uppercase sm:text-lg">
                                {content.promotion}
                            </p>
                        </div>

                        <p className="mt-5 text-2xl font-extrabold tracking-[-0.03em] text-deep-blue sm:text-3xl">
                            {'Planes desde '}

                            <span className="text-instinct">
                                {content.price}
                            </span>
                        </p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <ButtonArrow
                                href={
                                    content.primaryAction
                                        .href
                                }
                                className="w-full min-w-[250px] sm:w-auto"
                            >
                                {
                                    content
                                        .primaryAction
                                        .label
                                }
                            </ButtonArrow>

                            <ButtonSecondary
                                href={
                                    content
                                        .secondaryAction
                                        .href
                                }
                                className="flex w-full items-center justify-center gap-2 px-6 text-sm sm:w-auto"
                            >
                                {
                                    content
                                        .secondaryAction
                                        .label
                                }
                            </ButtonSecondary>
                        </div>

                        <div className="mt-8">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl text-deep-blue">
                                    <Users
                                        className="size-10"
                                        strokeWidth={2}
                                        aria-hidden="true"
                                    />
                                </div>

                                <div>
                                    <p className="text-xs font-extrabold text-deep-blue sm:text-base">
                                        {
                                            content.socialProof
                                        }
                                    </p>

                                    <div className="mt-2 inline-flex items-center gap-2 rounded-md border border-instinct px-4 py-2">
                                        <p className="text-xs font-bold tracking-wide text-instinct-dark sm:text-sm">
                                            {
                                                content.communityMessage
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Columna derecha */}
                    <div className="relative z-10">
                        <TornImage />
                    </div>
                </div>

                <TrustBar />
            </Container>
        </section>
    );
}

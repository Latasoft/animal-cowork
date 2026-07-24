import { ButtonLink } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import type { HeroContent } from '@/types/home';

interface HeroSectionProps {
    content: HeroContent;
}

export function HeroSection({ content }: HeroSectionProps) {
    return (
        <section
            id="inicio"
            className="relative isolate scroll-mt-24 overflow-hidden"
        >
            <img
                src="/images/hero/Fondo.webp"
                alt=""
                aria-hidden="true"
                className="absolute inset-0 -z-30 h-full w-full object-cover object-center"
            />
            <div
                className="absolute inset-0 -z-20 bg-[linear-gradient(to_bottom,rgba(247,249,245,0.52),rgba(247,249,245,0.68)_55%,rgba(247,249,245,0.84))]"
                aria-hidden="true"
            />
            <div
                className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.72),rgba(255,255,255,0.36)_48%,transparent_76%)]"
                aria-hidden="true"
            />
            <div
                className="absolute top-10 left-1/2 -z-10 size-[32rem] -translate-x-1/2 rounded-full bg-instinct/10 blur-3xl"
                aria-hidden="true"
            />

            <div
                className="absolute top-1/3 -left-32 -z-10 size-80 rounded-full bg-energy-blue/5 blur-3xl"
                aria-hidden="true"
            />

            <Container>
                <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center py-16 sm:py-20 lg:py-10">
                    <div className="mx-auto w-full max-w-5xl text-center">
                        <h1 className="text-[clamp(2.5rem,8vw,4.5rem)] leading-[0.95] font-extrabold tracking-[-0.06em] text-balance text-deep-blue text-shadow-sm text-shadow-white/80">
                            {content.title}
                        </h1>

                        <p className="mt-7 text-2xl leading-tight font-extrabold tracking-[-0.035em] text-balance text-deep-blue text-shadow-sm text-shadow-white/80 sm:text-3xl lg:text-4xl">
                            {content.promotion}
                        </p>

                        <p className="relative mt-4 inline-block text-xl font-bold text-deep-blue text-shadow-sm text-shadow-white/80 after:absolute after:-bottom-2 after:left-1/2 after:h-1 after:w-full after:-translate-x-1/2 after:rounded-full after:bg-amarillo sm:text-2xl">
                            {content.price}
                        </p>

                        <div className="mx-auto mt-8 max-w-3xl rounded-2xl border-2 border-instinct/45 bg-white/78 px-6 py-6 shadow-card backdrop-blur-sm">
                            <div className="flex items-start gap-4 text-left">
                                <p className="text-base leading-7 font-medium text-deep-blue sm:text-lg sm:leading-8">
                                    {content.description}
                                </p>
                            </div>
                        </div>

                        <div className="mt-10">
                            <ButtonLink
                                href={content.primaryAction.href}
                                className="w-full px-8 sm:w-auto"
                            >
                                {content.primaryAction.label}
                            </ButtonLink>
                        </div>

                        <div className="mx-auto mt-12 max-w-3xl px-5 py-6">
                            <div className="space-y-3">
                                <p className="text-xl font-black tracking-[-0.03em] text-deep-blue sm:text-2xl">
                                    {content.socialProof}
                                </p>

                                <div className="inline-flex items-center gap-3 rounded-full border border-instinct/30 bg-instinct-light px-5 py-3">
                                    <span className="h-3 w-3 animate-pulse rounded-full bg-instinct" />

                                    <p className="text-sm font-bold tracking-wide text-instinct-dark uppercase">
                                        {content.communityMessage}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}

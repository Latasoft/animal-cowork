import { ButtonArrow } from '@/components/ui/button';
import { renew as renewContract } from '@/routes/contract';
import { Repeat } from 'lucide-react';

function RenewalCard() {
    return (
        <section
            className="relative left-1/2 mt-16 w-screen -translate-x-1/2"
            aria-labelledby="renewal-title"
        >
            <svg
                width="0"
                height="0"
                className="absolute"
                aria-hidden="true"
                focusable="false"
            >
                <defs>
                    <filter
                        id="renewal-paper-edge"
                        x="-5%"
                        y="-20%"
                        width="110%"
                        height="140%"
                    >
                        <feTurbulence
                            type="fractalNoise"
                            baseFrequency="0.012 0.045"
                            numOctaves="3"
                            seed="7"
                            result="noise"
                        />
                        <feDisplacementMap
                            in="SourceGraphic"
                            in2="noise"
                            scale="10"
                            xChannelSelector="R"
                            yChannelSelector="G"
                        />
                    </filter>
                </defs>
            </svg>

            <div className="relative px-6 py-10 sm:px-10 lg:px-16 lg:py-8">
                <div
                    className="absolute inset-0 bg-white shadow-[0_18px_50px_rgba(13,27,61,0.12)]"
                    style={{ filter: 'url(#renewal-paper-edge)' }}
                    aria-hidden="true"
                />

                <div
                    className="absolute inset-x-0 top-2 h-px bg-deep-blue/8"
                    aria-hidden="true"
                />
                <div
                    className="absolute inset-x-0 bottom-2 h-px bg-deep-blue/8"
                    aria-hidden="true"
                />

                <div className="relative mx-auto flex max-w-7xl flex-col gap-8 text-deep-blue lg:flex-row lg:items-stretch lg:justify-between lg:gap-12">
                    <div className="flex flex-1 flex-col gap-6 sm:flex-row sm:items-stretch">
                        <div className="flex shrink-0 items-center justify-center sm:w-24">
                            <div className="flex size-16 items-center justify-center rounded-full border-2 border-instinct/20 bg-instinct-light text-instinct shadow-sm sm:size-20">
                                <Repeat
                                    className="size-8 sm:size-10"
                                    strokeWidth={2.2}
                                    aria-hidden="true"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col justify-center text-center sm:text-left">
                            <p className="text-xs font-extrabold tracking-[0.18em] text-instinct-dark uppercase">
                                Renovación
                            </p>

                            <h3
                                id="renewal-title"
                                className="mt-2 text-3xl leading-tight font-extrabold tracking-[-0.04em] text-deep-blue sm:text-4xl"
                            >
                                ¿Necesitas renovar tu contrato?
                            </h3>

                            <p className="mt-3 text-base leading-7 font-semibold text-deep-blue/70 sm:text-lg">
                                Renueva aquí de forma más rápida.
                            </p>
                        </div>
                    </div>

                    <div className="flex shrink-0 items-center justify-center lg:justify-end">
                        <ButtonArrow
                            href={renewContract.url()}
                            className="h-14 w-full min-w-64 px-6 text-base font-extrabold shadow-[0_14px_30px_rgba(106,174,59,0.3)] hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(106,174,59,0.4)] sm:w-auto"
                        >
                            RENOVAR MI CONTRATO
                        </ButtonArrow>
                    </div>
                </div>
            </div>
        </section>
    );
}

export { RenewalCard };

import { useId } from 'react';

function TornImage() {
    const uid = useId();
    const filterId = `brush-edge-${uid}`;
    const maskId = `brush-mask-${uid}`;

    return (
        <div className="relative mx-auto max-w-3xl">
            <div className="relative h-[360px] w-full sm:h-[450px] lg:h-[560px]">
                <svg
                    viewBox="0 0 800 560"
                    preserveAspectRatio="none"
                    className="h-full w-full"
                >
                    <defs>
                        <filter
                            id={filterId}
                            x="-20%"
                            y="-20%"
                            width="140%"
                            height="140%"
                        >
                            <feTurbulence
                                type="fractalNoise"
                                baseFrequency="0.012 0.025"
                                numOctaves="3"
                                seed="7"
                                result="noise"
                            />
                            <feDisplacementMap
                                in="SourceGraphic"
                                in2="noise"
                                scale="35"
                                xChannelSelector="R"
                                yChannelSelector="G"
                            />
                        </filter>

                        <mask id={maskId} maskUnits="userSpaceOnUse">
                            <rect
                                x="20"
                                y="20"
                                width="760"
                                height="520"
                                fill="white"
                                filter={`url(#${filterId})`}
                            />
                        </mask>

                        <linearGradient
                            id={`gradient-${uid}`}
                            x1="0"
                            y1="1"
                            x2="0"
                            y2="0"
                        >
                            <stop offset="0%" stopColor="rgba(15,35,80,0.08)" />
                            <stop offset="100%" stopColor="rgba(15,35,80,0)" />
                        </linearGradient>
                    </defs>

                    <g mask={`url(#${maskId})`}>
                        <image
                            href="/images/hero/fachada.webp"
                            x="0"
                            y="0"
                            width="800"
                            height="560"
                            preserveAspectRatio="xMidYMid slice"
                        />
                        <rect
                            x="0"
                            y="0"
                            width="800"
                            height="560"
                            fill={`url(#gradient-${uid})`}
                        />
                    </g>
                </svg>
            </div>
        </div>
    );
}

export default TornImage;
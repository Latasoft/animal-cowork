import { useEffect, useMemo, useState } from 'react';
import type { ComponentProps } from 'react';

interface PlanImageProps
    extends Omit<ComponentProps<'img'>, 'src' | 'alt' | 'onError'> {
    src: string;
    fallbackImage: string;
    slug: string;
    alt: string;
}

export function PlanImage({
    src,
    fallbackImage,
    slug,
    alt,
    ...imageProps
}: PlanImageProps) {
    const sources = useMemo(
        () =>
            Array.from(
                new Set([
                    src,
                    fallbackImage,
                    `/images/plans/${slug}.webp`,
                    '/images/plans/placeholder.svg',
                ]),
            ),
        [fallbackImage, slug, src],
    );
    const [sourceIndex, setSourceIndex] = useState(0);

    useEffect(() => setSourceIndex(0), [sources]);

    return (
        <img
            {...imageProps}
            src={sources[sourceIndex]}
            alt={alt}
            onError={() =>
                setSourceIndex((currentIndex) =>
                    Math.min(currentIndex + 1, sources.length - 1),
                )
            }
        />
    );
}

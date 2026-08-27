import {
    Check,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Images,
    Users,
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import type { MeetingRoom } from '@/types/meeting-room';

interface RoomCardProps {
    room: MeetingRoom;
    isSelected: boolean;
    onSelect: () => void;
}

export function RoomCard({
    room,
    isSelected,
    onSelect,
}: RoomCardProps) {
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const totalImages = room.images.length;

    function getImageUrl(image: string): string {
        if (image.startsWith('/images/')) {
            return image;
        }

        if (image.startsWith('/storage/')) {
            return image;
        }

        return `/storage/${image}`;
    }

    function showPreviousImage() {
        setActiveImageIndex((current) =>
            current === 0
                ? totalImages - 1
                : current - 1,
        );
    }

    function showNextImage() {
        setActiveImageIndex((current) =>
            current === totalImages - 1
                ? 0
                : current + 1,
        );
    }

    return (
        <article
            className={[
                'overflow-hidden rounded-card border-2 bg-white shadow-card transition duration-300',
                isSelected
                    ? 'border-instinct ring-4 ring-instinct/10'
                    : 'border-deep-blue/8 hover:-translate-y-1 hover:border-instinct/35',
            ].join(' ')}
        >
            {/* Carrusel de imágenes */}
            <div className="relative aspect-[16/10] overflow-hidden bg-deep-blue/5">
                <img
                    src={getImageUrl(room.images[activeImageIndex])}
                    alt={`${room.imageAlt}, vista ${activeImageIndex + 1}`}
                    className="h-full w-full object-cover transition duration-500"
                    loading="lazy"
                />

                {/* Gradiente inferior */}
                <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-deep-blue/80 via-deep-blue/25 to-transparent"
                    aria-hidden
                />

                {/* Flecha izquierda */}
                {totalImages > 1 && (
                    <button
                        type="button"
                        aria-label="Ver fotografía anterior"
                        onClick={showPreviousImage}
                        className="absolute top-1/2 left-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-deep-blue/55 text-white backdrop-blur-sm transition hover:bg-deep-blue/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-instinct"
                    >
                        <ChevronLeft
                            className="size-5"
                            aria-hidden
                        />
                    </button>
                )}

                {/* Flecha derecha */}
                {totalImages > 1 && (
                    <button
                        type="button"
                        aria-label="Ver fotografía siguiente"
                        onClick={showNextImage}
                        className="absolute top-1/2 right-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-deep-blue/55 text-white backdrop-blur-sm transition hover:bg-deep-blue/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-instinct"
                    >
                        <ChevronRight
                            className="size-5"
                            aria-hidden
                        />
                    </button>
                )}

                {/* Información inferior */}
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
                    <div className="flex items-center gap-2 text-xs font-bold text-white">
                        <Images
                            className="size-4"
                            aria-hidden
                        />

                        {activeImageIndex + 1} / {totalImages}
                    </div>

                    {isSelected && (
                        <span className="inline-flex items-center gap-2 rounded-full bg-instinct px-3 py-1.5 text-xs font-extrabold text-white">
                            <CheckCircle2
                                className="size-4"
                                aria-hidden
                            />
                            Seleccionada
                        </span>
                    )}
                </div>

                {/* Indicadores */}
                {totalImages > 1 && (
                    <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
                        {room.images.map((image, index) => (
                            <button
                                key={image}
                                type="button"
                                aria-label={`Ver fotografía ${index + 1} de ${room.name}`}
                                aria-pressed={
                                    activeImageIndex === index
                                }
                                onClick={() =>
                                    setActiveImageIndex(index)
                                }
                                className={[
                                    'rounded-full transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-instinct',
                                    activeImageIndex === index
                                        ? 'h-2 w-5 bg-instinct'
                                        : 'size-2 bg-white/60 hover:bg-white',
                                ].join(' ')}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Contenido */}
            <div className="p-6 sm:p-7">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-extrabold tracking-[0.14em] text-instinct-dark uppercase">
                            {room.shortName}
                        </p>

                        <h3 className="mt-2 text-2xl font-extrabold tracking-[-0.035em] text-deep-blue sm:text-3xl">
                            {room.name}
                        </h3>
                    </div>

                    <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-instinct-light text-instinct-dark">
                        <Users
                            className="size-5"
                            aria-hidden
                        />
                    </span>
                </div>

                <p className="mt-3 font-bold text-deep-blue/65">
                    Hasta {room.capacity} personas
                </p>

                {room.description && (
                    <p className="mt-3 text-sm leading-6 text-deep-blue/60">
                        {room.description}
                    </p>
                )}

                {room.features.length > 0 && (
                    <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                        {room.features.map((feature) => (
                            <li
                                key={feature}
                                className="flex items-start gap-2 text-sm leading-6 text-deep-blue/70"
                            >
                                <Check
                                    className="mt-1 size-4 shrink-0 text-instinct-dark"
                                    strokeWidth={2.5}
                                    aria-hidden
                                />

                                {feature}
                            </li>
                        ))}
                    </ul>
                )}

                <p className="mt-6 text-lg font-extrabold text-deep-blue">
                    {new Intl.NumberFormat('es-CL', {
                        style: 'currency',
                        currency: 'CLP',
                        maximumFractionDigits: 0,
                    }).format(room.normalHourlyRate)}{' '}
                    {room.normalHourlyRateTaxable
                        ? '+ IVA '
                        : ''}
                    por hora
                </p>

                <Button
                    type="button"
                    variant={
                        isSelected
                            ? 'outline'
                            : 'primary'
                    }
                    aria-pressed={isSelected}
                    onClick={onSelect}
                    className="mt-6 w-full justify-center text-sm"
                >
                    {isSelected ? (
                        <>
                            <CheckCircle2
                                className="size-5"
                                aria-hidden
                            />
                            Sala seleccionada
                        </>
                    ) : (
                        'Seleccionar sala'
                    )}
                </Button>
            </div>
        </article>
    );
}
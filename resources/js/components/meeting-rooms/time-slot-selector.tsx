import { Check, Clock3 } from 'lucide-react';

import type { TimeSlot } from '@/types/meeting-room';

interface TimeSlotSelectorProps {
    slots: TimeSlot[];
    selectedSlotIds: string[];
    isLoading: boolean;
    onToggleSlot: (slotId: string) => void;
}

export function TimeSlotSelector({
    slots,
    selectedSlotIds,
    isLoading,
    onToggleSlot,
}: TimeSlotSelectorProps) {
    return (
        <section aria-labelledby="time-slots-heading">
            <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-deep-blue text-white">
                    <Clock3 className="size-5" aria-hidden />
                </span>
                <div>
                    <p className="text-xs font-extrabold tracking-[0.14em] text-instinct-dark uppercase">
                        Paso 3 · Horario
                    </p>
                    <h3
                        id="time-slots-heading"
                        tabIndex={-1}
                        className="mt-1 text-2xl font-extrabold tracking-[-0.035em] text-deep-blue outline-none"
                    >
                        Horarios disponibles
                    </h3>
                </div>
            </div>

            {isLoading ? (
                <div
                    className="mt-6 grid animate-pulse grid-cols-2 gap-3 sm:grid-cols-3"
                    aria-label="Consultando disponibilidad"
                >
                    {Array.from({ length: 6 }, (_, index) => (
                        <div
                            key={index}
                            className="h-12 rounded-xl bg-deep-blue/8"
                        />
                    ))}
                </div>
            ) : slots.some((slot) => slot.available) ? (
                <>
                    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                        {slots.map((slot) => {
                            const isSelected = selectedSlotIds.includes(
                                slot.id,
                            );

                            return (
                                <button
                                    key={slot.id}
                                    type="button"
                                    disabled={!slot.available}
                                    aria-pressed={isSelected}
                                    onClick={() => onToggleSlot(slot.id)}
                                    className={[
                                        'flex min-h-12 items-center justify-center gap-2 rounded-xl border px-2 text-xs font-extrabold transition sm:text-sm',
                                        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-instinct',
                                        isSelected
                                            ? 'border-instinct bg-instinct text-white shadow-[0_8px_18px_rgba(106,174,59,0.22)]'
                                            : 'border-deep-blue/12 bg-white text-deep-blue hover:border-instinct hover:bg-instinct-light',
                                        !slot.available
                                            ? 'cursor-not-allowed bg-deep-blue/4 text-deep-blue/35 opacity-60 hover:border-deep-blue/12 hover:bg-deep-blue/4'
                                            : '',
                                    ].join(' ')}
                                >
                                    {isSelected && (
                                        <Check className="size-4" aria-hidden />
                                    )}
                                    {slot.start} – {slot.end}
                                </button>
                            );
                        })}
                    </div>

                    <p className="mt-4 text-sm leading-6 text-deep-blue/55">
                        Cada bloque se cobra por hora completa. El margen de
                        limpieza posterior no se cobra.
                    </p>
                </>
            ) : (
                <div className="mt-6 rounded-xl border border-deep-blue/10 bg-deep-blue/3 p-5 text-sm leading-6 text-deep-blue/65">
                    No hay horarios disponibles para esta sala en la fecha
                    seleccionada. Prueba con otro día.
                </div>
            )}
        </section>
    );
}

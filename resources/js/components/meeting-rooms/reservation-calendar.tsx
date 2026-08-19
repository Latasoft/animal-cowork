import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

import type { MeetingRoomId } from '@/types/meeting-room';
import { isChileanHoliday } from '@/utils/chilean-holidays';

interface ReservationCalendarProps {
    roomId: MeetingRoomId;
    selectedDate: string | null;
    onSelectDate: (date: string) => void;
}

const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

function startOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
}

function formatDateKey(date: Date): string {
    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, '0');

    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

function isWeekend(date: Date): boolean {
    const day = date.getDay();

    return day === 0 || day === 6;
}

function getMonthDays(month: Date): Array<Date | null> {
    const firstDay = startOfMonth(month);

    const mondayBasedOffset = (firstDay.getDay() + 6) % 7;

    const daysInMonth = new Date(
        month.getFullYear(),
        month.getMonth() + 1,
        0,
    ).getDate();

    const cells: Array<Date | null> = Array.from(
        {
            length: mondayBasedOffset,
        },
        () => null,
    );

    for (let day = 1; day <= daysInMonth; day += 1) {
        cells.push(new Date(month.getFullYear(), month.getMonth(), day));
    }

    while (cells.length % 7 !== 0) {
        cells.push(null);
    }

    return cells;
}

export function ReservationCalendar({
    selectedDate,
    onSelectDate,
}: ReservationCalendarProps) {
    const today = startOfDay(new Date());

    const firstAvailableMonth = startOfMonth(today);

    const [visibleMonth, setVisibleMonth] = useState(firstAvailableMonth);

    const monthDays = getMonthDays(visibleMonth);

    const monthLabel = new Intl.DateTimeFormat('es-CL', {
        month: 'long',
        year: 'numeric',
    }).format(visibleMonth);

    const canGoPrevious = visibleMonth > firstAvailableMonth;

    function changeMonth(offset: number) {
        setVisibleMonth(
            (current) =>
                new Date(current.getFullYear(), current.getMonth() + offset, 1),
        );
    }

    return (
        <section aria-labelledby="calendar-heading">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-xs font-extrabold tracking-[0.14em] text-instinct-dark uppercase">
                        Paso 2 · Fecha
                    </p>

                    <h3
                        id="calendar-heading"
                        tabIndex={-1}
                        className="mt-2 text-2xl font-extrabold tracking-[-0.035em] text-deep-blue outline-none"
                    >
                        Selecciona un día
                    </h3>
                </div>

                <div className="flex gap-2">
                    <button
                        type="button"
                        aria-label="Ver mes anterior"
                        disabled={!canGoPrevious}
                        onClick={() => changeMonth(-1)}
                        className="flex size-10 items-center justify-center rounded-full border border-deep-blue/15 bg-white text-deep-blue transition hover:border-instinct hover:text-instinct-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-instinct disabled:cursor-not-allowed disabled:opacity-30"
                    >
                        <ChevronLeft className="size-5" aria-hidden />
                    </button>

                    <button
                        type="button"
                        aria-label="Ver mes siguiente"
                        onClick={() => changeMonth(1)}
                        className="flex size-10 items-center justify-center rounded-full border border-deep-blue/15 bg-white text-deep-blue transition hover:border-instinct hover:text-instinct-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-instinct"
                    >
                        <ChevronRight className="size-5" aria-hidden />
                    </button>
                </div>
            </div>

            <div className="mt-6 rounded-2xl border border-deep-blue/10 bg-white p-3 shadow-[0_14px_34px_rgba(13,27,61,0.06)] sm:p-5">
                <p className="text-center text-base font-extrabold text-deep-blue capitalize">
                    {monthLabel}
                </p>

                <div className="mt-5 grid grid-cols-7 gap-1 text-center sm:gap-2">
                    {weekDays.map((day) => (
                        <div
                            key={day}
                            className="py-2 text-[10px] font-extrabold tracking-wide text-deep-blue/45 uppercase sm:text-xs"
                        >
                            {day}
                        </div>
                    ))}

                    {monthDays.map((date, index) => {
                        if (!date) {
                            return <div key={`empty-${index}`} aria-hidden />;
                        }

                        const dateKey = formatDateKey(date);

                        const isPast = date < today;

                        const weekend = isWeekend(date);

                        const holiday = isChileanHoliday(dateKey);

                        const isDisabled = isPast || weekend || holiday;

                        const isSelected = selectedDate === dateKey;

                        const accessibleDate = new Intl.DateTimeFormat(
                            'es-CL',
                            {
                                dateStyle: 'full',
                            },
                        ).format(date);

                        let availabilityLabel = '';

                        if (isPast) {
                            availabilityLabel = ', fecha pasada';
                        } else if (weekend) {
                            availabilityLabel =
                                ', no disponible los fines de semana';
                        } else if (holiday) {
                            availabilityLabel = ', feriado, no disponible';
                        }

                        return (
                            <button
                                key={dateKey}
                                type="button"
                                disabled={isDisabled}
                                aria-label={`${accessibleDate}${availabilityLabel}`}
                                aria-pressed={isSelected}
                                onClick={() => onSelectDate(dateKey)}
                                className={[
                                    'relative aspect-square min-w-0 rounded-xl text-xs font-bold transition sm:text-sm',
                                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-instinct',

                                    isSelected
                                        ? 'bg-instinct text-white shadow-[0_8px_20px_rgba(106,174,59,0.3)]'
                                        : 'bg-deep-blue/3 text-deep-blue hover:bg-instinct-light hover:text-instinct-dark',

                                    isDisabled
                                        ? 'cursor-not-allowed opacity-30 hover:bg-deep-blue/3 hover:text-deep-blue'
                                        : '',
                                ].join(' ')}
                            >
                                {date.getDate()}

                                {!isDisabled && !isSelected && (
                                    <span className="absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-instinct sm:bottom-1.5" />
                                )}
                            </button>
                        );
                    })}
                </div>

                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-deep-blue/8 pt-4 text-xs font-semibold text-deep-blue/55">
                    <span className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-instinct" />
                        Disponible
                    </span>

                    <span className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-deep-blue/20" />
                        No disponible
                    </span>
                </div>
            </div>
        </section>
    );
}

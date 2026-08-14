const chileHolidays2026 = new Set([
    '2026-01-01', // Año Nuevo

    '2026-04-03', // Viernes Santo
    '2026-04-04', // Sábado Santo

    '2026-05-01', // Día del Trabajo
    '2026-05-21', // Glorias Navales

    '2026-06-21', // Día Nacional de los Pueblos Indígenas
    '2026-06-29', // San Pedro y San Pablo

    '2026-07-16', // Virgen del Carmen

    '2026-08-15', // Asunción de la Virgen

    '2026-09-18', // Independencia Nacional
    '2026-09-19', // Glorias del Ejército

    '2026-10-12', // Encuentro de Dos Mundos
    '2026-10-31', // Iglesias Evangélicas y Protestantes

    '2026-11-01', // Todos los Santos

    '2026-12-08', // Inmaculada Concepción
    '2026-12-25', // Navidad
]);

export function isChileanHoliday(
    date: string,
): boolean {
    return chileHolidays2026.has(date);
}
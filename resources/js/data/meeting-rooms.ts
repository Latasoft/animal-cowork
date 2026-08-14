import type {
    MeetingRoom,
    MeetingRoomId,
    RoomAvailability,
    TimeSlot,
} from '@/types/meeting-room';

export const meetingRoomSettings = {
    normalHourlyRate: 12_000,
    clientAdditionalHourlyRate: 7_000,
    includedClientHours: 2,
    taxRate: 0.19,
} as const;

export const meetingRooms: MeetingRoom[] = [
    {
        id: 'sala-1',
        name: 'Sala de Reuniones 1',
        shortName: 'Sala 1',
        capacity: 'Hasta 10 personas',
        images: [
            '/images/rooms/sala1.1.webp',
            '/images/rooms/sala1.3.webp',
            '/images/rooms/sala1.4.webp',

        ],
        imageAlt: 'Sala de reuniones principal de Animal Coworking',
        features: [
            'Aire acondicionado',
            'Conexiones eléctricas',
            'Smart TV de 55"',
            'Pizarra de vidrio',
            'Cafetera',
            'Dispensador de agua',
        ],
        priceLabel: '$12.000 + IVA por hora',
    },
    {
        id: 'sala-2',
        name: 'Sala de Reuniones 2',
        shortName: 'Sala 2',
        capacity: '5–6 personas',
        images: [
            '/images/rooms/sala2.1.webp',
            '/images/rooms/sala2.2.webp',
            '/images/rooms/sala2.3.webp',
        ],
        imageAlt: 'Sala 2 de Animal Coworking',
                features: [
            'Aire acondicionado',
            'Conexiones eléctricas',
            'Smart TV de 55"',
            'Pizarra de vidrio',
            'Cafetera',
            'Dispensador de agua',
        ],
        priceLabel: '$12.000 + IVA por hora',
    },
];

export const reservationTerms = [
    'Las horas agendadas no son acumulables ni reembolsables. Una vez realizado el agendamiento y confirmado el pago, se reserva el bloque horario sin derecho a devolución del dinero u horas solicitadas si el cliente no asiste.',
    'Las reservas realizadas y no pagadas con al menos 24 horas de anticipación quedarán anuladas.',
];

const mockTimeSlots: Omit<TimeSlot, 'available'>[] = [
    { id: '10-11', start: '10:00', end: '11:10' },
    { id: '11-12', start: '11:20', end: '12:30' },
    { id: '12-13', start: '12:40', end: '13:50' },
    { id: '14-15', start: '14:00', end: '15:10' },
    { id: '15-16', start: '15:20', end: '16:30' },
    { id: '16-17', start: '16:40', end: '17:50' },
    { id: '18-19', start: '18:00', end: '19:10' },
];

function getDateSeed(date: string): number {
    return date
        .replaceAll('-', '')
        .split('')
        .reduce((total, digit) => total + Number(digit), 0);
}

export function getMockAvailability(
    roomId: MeetingRoomId,
    date: string,
): RoomAvailability {
    return {
        roomId,
        date,
        slots: mockTimeSlots.map((slot) => ({
            ...slot,
            available: true,
        })),
    };
}

export function hasMockAvailability(
    roomId: MeetingRoomId,
    date: string,
): boolean {
    return getMockAvailability(
        roomId,
        date,
    ).slots.some((slot) => slot.available);
}

export function formatClp(value: number): string {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        maximumFractionDigits: 0,
    }).format(value);
}

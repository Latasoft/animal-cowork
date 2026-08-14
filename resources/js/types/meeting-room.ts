export type MeetingRoomId = 'sala-1' | 'sala-2';

export type VirtualOfficeClientStatus = 'yes' | 'no' | '';

export type ReservationStatus =
    | 'available'
    | 'selected'
    | 'pending_payment'
    | 'confirmed'
    | 'blocked'
    | 'cancelled';

export interface MeetingRoom {
    id: MeetingRoomId;
    name: string;
    shortName: string;
    capacity: string;
    images: string[];
    imageAlt: string;
    features: string[];
    priceLabel?: string;
}

export interface TimeSlot {
    id: string;
    start: string;
    end: string;
    available: boolean;
}

export interface RoomAvailability {
    roomId: MeetingRoomId;
    date: string;
    slots: TimeSlot[];
}

export interface ReservationFormData {
    companyName: string;
    representativeName: string;
    email: string;
    phone: string;
    isVirtualOfficeClient: VirtualOfficeClientStatus;
    acceptsTerms: boolean;
}

export interface ReservationPayload {
    room_id: MeetingRoomId;
    date: string;
    start_time: string;
    end_time: string;
    duration_hours: number;
    company_name: string;
    representative_name: string;
    email: string;
    phone: string;
    is_virtual_office_client: boolean;
    accepts_terms: true;
}

export type ReservationFormErrors = Partial<
    Record<keyof ReservationFormData | 'room' | 'date' | 'slots', string>
>;

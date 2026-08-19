export type MeetingRoomId = string;

export type CustomerType = 'plan' | 'external';

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
    description: string | null;
    capacity: number;
    location: string | null;
    images: string[];
    imageAlt: string;
    features: string[];
    normalHourlyRate: number;
    normalHourlyRateTaxable: boolean;
}

export interface TimeSlot {
    id: string;
    start: string;
    end: string;
    operational_end: string;
    billable_minutes: number;
    available: boolean;
}

export interface RoomAvailability {
    roomId: MeetingRoomId;
    date: string;
    slots: TimeSlot[];
}

export interface ReservationFormData {
    companyRut: string;
    companyName: string;
    representativeName: string;
    email: string;
    phone: string;
    contractType: 'natural' | 'legal' | '';
    representativeRut: string;
    address: string;
    commune: string;
    region: string;
    acceptsTerms: boolean;
    acceptsPrivacy: boolean;
}

export interface CompanyLookupResult {
    company: {
        client_found: boolean;
        has_active_plan: boolean;
        company_name: string | null;
        plan: { slug: string; name: string } | null;
        included_minutes: number;
        used_included_minutes: number;
        available_included_minutes: number;
    };
    quote: ReservationQuote;
}

export interface ReservationQuote {
    rate_type: 'client' | 'public';
    requested_minutes: number;
    included_minutes_used: number;
    billable_minutes: number;
    rate_per_hour_net: number;
    tax_rate: number;
    subtotal_net: number;
    tax_amount: number;
    total_amount: number;
}

export interface ReservationRequestData {
    customer_type: CustomerType;
    room: MeetingRoomId;
    date: string;
    slot_ids: string[];
    company_rut: string;
    company_name: string;
    representative_name: string;
    email: string;
    phone: string;
    contract_type: 'natural' | 'legal' | '';
    representative_rut: string;
    address: string;
    commune: string;
    region: string;
    accepts_terms: boolean;
    accepts_privacy: boolean;
}

export interface ConfirmedReservation {
    id: number;
    room: string;
    company: string | null;
    date: string;
    starts_at: string;
    ends_at: string;
    duration_minutes: number;
    included_minutes_used: number;
    billable_minutes: number;
    rate_per_hour_net: number;
    subtotal_net: number;
    tax_amount: number;
    total_amount: number;
    payment_status: string;
    status: string;
}

export interface ReservationResponse {
    message: string;
    reservation: ConfirmedReservation;
}

export type ReservationFormErrors = Partial<Record<string, string>>;

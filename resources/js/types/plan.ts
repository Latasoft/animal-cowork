export type PlanTheme = 'green' | 'orange' | 'gold';

export interface Plan {
    id: number;
    slug: string;
    name: string;
    badge: string | null;
    priceOffice: number;
    priceAdditional: number;
    totalPrice: number;
    contractDurationMonths: number;
    features: string[];
    includesRoomAccess: boolean;
    monthlyRoomMinutesIncluded: number;
    roomMinutesRollover: boolean;
    extraRoomHourPriceNet: number | null;
    extraRoomHourTaxable: boolean;
    image: string;
    fallbackImage: string;
    imageAlt: string;
    theme: PlanTheme;
    featured: boolean;
    active: boolean;
    sortOrder: number;
}

export type PlanTheme = 'green' | 'orange' | 'gold';

export interface Plan {
    id: string;
    name: string;
    badge?: string;
    priceOffice: number;
    priceAdditional: number;
    image: string;
    imageAlt: string;
    features: string[];
    action: {
        label: string;
        href: string;
    };
    theme: PlanTheme;
    featured?: boolean;
    contractDurationMonths: number;
}

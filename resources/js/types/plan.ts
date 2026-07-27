export type PlanTheme = 'green' | 'orange' | 'gold';

export interface Plan {
    id: string;
    name: string;
    tagline: string;
    badge?: string;
    price: string;
    duration: string;
    image: string;
    imageAlt: string;
    features: string[];
    action: {
        label: string;
        href: string;
    };
    theme: PlanTheme;
    featured?: boolean;
}

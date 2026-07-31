export type PlanTheme = 'green' | 'orange' | 'gold';

export interface Plan {
    id: string;
    name: string;
    badge?: string;
    price: string;
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

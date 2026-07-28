export interface HeroContent {
    title: string;
    title2: string;
    subtitle: string;
    promotion: string;
    price: string;
    primaryAction: {
        label: string;
        href: string;
    };
    secondaryAction: {
        label: string;
        href: string;
    };
    socialProof: string;
    communityMessage: string;
}

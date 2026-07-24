export interface HeroContent {
    title: string;
    promotion: string;
    price: string;
    description: string;
    primaryAction: {
        label: string;
        href: string;
    };
    socialProof: string;
    communityMessage: string;
}
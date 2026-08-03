export type AdditionalServiceIcon = 'patent' | 'company';

export type OfficeSetupStepIcon =
    'select-plan' | 'fill-form' | 'review-contract';

export interface AdditionalService {
    id: string;
    title: string;
    description: string;
    icon: AdditionalServiceIcon;
    action: {
        label: string;
        href: string;
    };
}

export interface OfficeSetupStep {
    id: string;
    step: number;
    title: string;
    description: string;
    icon: OfficeSetupStepIcon;
    action?: {
        label: string;
        href: string;
    };
}

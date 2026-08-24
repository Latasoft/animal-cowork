import type { Plan } from '@/types/plan';

export function formatPlanDuration(months: number): string {
    if (months % 12 === 0) {
        const years = months / 12;

        return `${years} ${years === 1 ? 'año' : 'años'}`;
    }

    return `${months} meses`;
}

export function getPlanTagline(plan: Plan): string {
    return (
        plan.features[0] ??
        `Oficina virtual por ${formatPlanDuration(plan.contractDurationMonths)}`
    );
}

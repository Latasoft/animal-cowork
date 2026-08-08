import type { ContractDates } from '@/types/checkout';

function formatLocalDateAsIso(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export function createAutomaticContractDates(
    contractDurationMonths: number,
    generatedAt: Date = new Date(),
): ContractDates {
    const startDate = new Date(
        generatedAt.getFullYear(),
        generatedAt.getMonth(),
        generatedAt.getDate(),
    );
    const endDate = new Date(startDate);

    endDate.setMonth(endDate.getMonth() + contractDurationMonths);
    endDate.setDate(endDate.getDate() - 1);

    const generatedDate = formatLocalDateAsIso(startDate);

    return {
        contract_date: generatedDate,
        contract_start_date: generatedDate,
        contract_end_date: formatLocalDateAsIso(endDate),
    };
}

export function formatContractDate(date: string): string {
    const [year, month, day] = date.split('-').map(Number);
    const localDate = new Date(year, month - 1, day);

    return new Intl.DateTimeFormat('es-CL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })
        .format(localDate)
        .toLocaleUpperCase('es-CL');
}

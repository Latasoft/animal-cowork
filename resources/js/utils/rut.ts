export function normalizeRut(value: string): string {
    return value
        .replace(/[^0-9kK]/g, '')
        .toUpperCase();
}

export function formatRut(value: string): string {
    const cleaned = normalizeRut(value).slice(0, 9);

    if (cleaned.length <= 1) {
        return cleaned;
    }

    const verificationDigit = cleaned.slice(-1);

    const body = cleaned
        .slice(0, -1)
        .replace(/\D/g, '');

    if (!body) {
        return verificationDigit;
    }

    const formattedBody = body.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        '.',
    );

    return `${formattedBody}-${verificationDigit}`;
}
/**
 * Converte um valor de data vindo do Supabase/Postgres para um objeto Date local,
 * sem o deslize de fuso horário que acontece quando uma string "apenas data"
 * (ex: "2026-08-15", tipo `date` no Postgres) é interpretada como meia-noite UTC
 * em vez de meia-noite local.
 */
export function parseServerDate(value: string | Date | null | undefined): Date {
    if (!value) return new Date();
    if (value instanceof Date) return value;

    const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(value);

    if (dateOnly) {
        const [year, month, day] = value.split("-").map(Number);
        return new Date(year, month - 1, day);
    }

    return new Date(value);
}

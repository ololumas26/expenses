import type { Movement } from "@/types/models";

export type MonthlyTotal = {
    key: string;
    label: string;
    income: number;
    outcome: number;
};

function monthKey(date: Date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

/**
 * Agrupa os movimentos por mês (receitas e despesas em separado), devolvendo
 * sempre `monthsCount` meses consecutivos terminados no mês atual — mesmo os
 * meses sem nenhum movimento aparecem, com totais a 0.
 */
export function getMonthlyTotals(movements: Movement[], monthsCount: number = 6): MonthlyTotal[] {
    const now = new Date();
    const months: MonthlyTotal[] = [];

    for (let i = monthsCount - 1; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push({
            key: monthKey(date),
            label: new Intl.DateTimeFormat("pt-PT", { month: "short" }).format(date).replace(".", ""),
            income: 0,
            outcome: 0,
        });
    }

    const byKey = new Map(months.map((month) => [month.key, month]));

    movements.forEach((movement) => {
        const bucket = byKey.get(monthKey(movement.date));
        if (!bucket) return;

        if (movement.type === "income") bucket.income += movement.amount;
        else if (movement.type === "outcome") bucket.outcome += movement.amount;
    });

    return months;
}

export type MonthComparison = {
    currentIncome: number;
    currentOutcome: number;
    previousIncome: number;
    previousOutcome: number;
    incomeDeltaPct: number | null;
    outcomeDeltaPct: number | null;
};

function percentDelta(current: number, previous: number): number | null {
    if (previous === 0) return current === 0 ? 0 : null;
    return ((current - previous) / previous) * 100;
}

/**
 * Compara o mês atual com o mês anterior. `incomeDeltaPct`/`outcomeDeltaPct`
 * vêm a `null` quando não há base de comparação (mês anterior a 0).
 */
export function getMonthComparison(movements: Movement[]): MonthComparison {
    const [previous, current] = getMonthlyTotals(movements, 2);

    return {
        currentIncome: current.income,
        currentOutcome: current.outcome,
        previousIncome: previous.income,
        previousOutcome: previous.outcome,
        incomeDeltaPct: percentDelta(current.income, previous.income),
        outcomeDeltaPct: percentDelta(current.outcome, previous.outcome),
    };
}

export function isCurrentMonth(date: Date) {
    const now = new Date();
    return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
}

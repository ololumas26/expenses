import type { Movement } from "@/types/models";
import { CHART_CATEGORICAL_COLORS, CHART_OTHER_COLOR } from "@/constants/chartColors";

export type CategoryBreakdownItem = {
    category: string;
    total: number;
    percentage: number;
};

export function getCategoryBreakdown(movements: Movement[]): CategoryBreakdownItem[] {
    const total = movements.reduce((sum, movement) => sum + movement.amount, 0);

    const totalsByCategory = new Map<string, number>();

    movements.forEach((movement) => {
        const category = movement.category ?? "Outros";
        totalsByCategory.set(category, (totalsByCategory.get(category) ?? 0) + movement.amount);
    });

    return Array.from(totalsByCategory.entries())
        .map(([category, categoryTotal]) => ({
            category,
            total: categoryTotal,
            percentage: total > 0 ? (categoryTotal / total) * 100 : 0,
        }))
        .sort((a, b) => b.total - a.total);
}

// Caps a (descending-sorted) breakdown to `maxSlices` real categories and folds
// whatever is left into a single "Outros" bucket.
export function capBreakdownForChart(items: CategoryBreakdownItem[], maxSlices: number = 5): CategoryBreakdownItem[] {
    if (items.length <= maxSlices) return items;

    const head = items.slice(0, maxSlices);
    const tail = items.slice(maxSlices);

    const otherTotal = tail.reduce((sum, item) => sum + item.total, 0);
    const otherPercentage = tail.reduce((sum, item) => sum + item.percentage, 0);

    return [...head, { category: "Outros", total: otherTotal, percentage: otherPercentage }];
}

export function colorForSlice(category: string, index: number): string {
    if (category === "Outros") return CHART_OTHER_COLOR;
    return CHART_CATEGORICAL_COLORS[index % CHART_CATEGORICAL_COLORS.length];
}

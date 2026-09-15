// Categorical palette for charts (pie/bar-by-category). Fixed hue order — never
// cycled or reordered. A 6th "real" category is never added here — beyond 5
// slices, fold the tail into CHART_OTHER_COLOR instead (see utils/category.ts).
export const CHART_CATEGORICAL_COLORS = [
    "#2a78d6", // blue
    "#eb6834", // orange
    "#1baf7a", // aqua
    "#eda100", // yellow
    "#e87ba4", // magenta
] as const;

// De-emphasis token for a folded "Outros" bucket.
export const CHART_OTHER_COLOR = "#9CA3AF";

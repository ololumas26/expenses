import { formatCoin } from "@/utils/coin";
import { CHART_OTHER_COLOR } from "@/constants/chartColors";
import { capBreakdownForChart, colorForSlice, type CategoryBreakdownItem } from "@/utils/category";

const SIZE = 160;
const STROKE_WIDTH = 26;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CENTER = SIZE / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const GAP = 4;
const MIN_SLICE_LENGTH = 2;

export default function CategoryPieChart({ categories, title = "Comparação por categoria" }: { categories: CategoryBreakdownItem[]; title?: string }) {
    const sliced = capBreakdownForChart(categories, 5);
    const total = sliced.reduce((sum, item) => sum + item.total, 0);

    if (sliced.length === 0 || total <= 0) {
        return (
            <div className="rounded-2xl border border-border/60 p-4">
                <h2 className="mb-3 text-sm font-semibold">{title}</h2>
                <p className="py-4 text-center text-sm text-tertiary/60">Ainda não há movimentos categorizados</p>
            </div>
        );
    }

    let cumulative = 0;
    const segments = sliced.map((item, index) => {
        const fraction = item.total / total;
        const length = fraction * CIRCUMFERENCE;
        const dashLength = Math.max(length - GAP, MIN_SLICE_LENGTH);
        const offset = -cumulative;
        cumulative += length;
        return { ...item, color: colorForSlice(item.category, index), dashLength, offset };
    });

    return (
        <div className="rounded-2xl border border-border/60 p-4">
            <h2 className="mb-4 text-sm font-semibold">{title}</h2>
            <div className="flex flex-col items-center gap-5 sm:flex-row">
                <div className="relative shrink-0" style={{ width: SIZE, height: SIZE }}>
                    <svg width={SIZE} height={SIZE}>
                        <g transform={`rotate(-90 ${CENTER} ${CENTER})`}>
                            <circle cx={CENTER} cy={CENTER} r={RADIUS} stroke="var(--border)" strokeWidth={STROKE_WIDTH} fill="none" />
                            {segments.map((segment) => (
                                <circle
                                    key={segment.category}
                                    cx={CENTER}
                                    cy={CENTER}
                                    r={RADIUS}
                                    stroke={segment.color}
                                    strokeWidth={STROKE_WIDTH}
                                    strokeDasharray={`${segment.dashLength} ${CIRCUMFERENCE - segment.dashLength}`}
                                    strokeDashoffset={segment.offset}
                                    strokeLinecap="round"
                                    fill="none"
                                />
                            ))}
                        </g>
                    </svg>
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-sm font-bold text-tertiary">{formatCoin(total)}</span>
                        <span className="text-[11px] text-tertiary/50">total</span>
                    </div>
                </div>

                <ul className="flex w-full flex-1 flex-col gap-2.5">
                    {segments.map((segment) => (
                        <li key={segment.category} className="flex items-center gap-2">
                            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: segment.color }} />
                            <span className="min-w-0 flex-1 truncate text-sm font-medium text-tertiary">{segment.category}</span>
                            <span className="shrink-0 text-xs text-tertiary/60">{formatCoin(segment.total)} · {segment.percentage.toFixed(0)}%</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

import type { MonthlyTotal } from "@/utils/analytics";

const CHART_HEIGHT = 140;

export default function MonthlyBarChart({ data }: { data: MonthlyTotal[] }) {
    const maxValue = Math.max(1, ...data.flatMap((month) => [month.income, month.outcome]));

    return (
        <div>
            <div className="mb-4 flex justify-center gap-4">
                <span className="flex items-center gap-1.5 text-xs text-tertiary/60"><span className="h-2 w-2 rounded-full bg-primary" /> Receitas</span>
                <span className="flex items-center gap-1.5 text-xs text-tertiary/60"><span className="h-2 w-2 rounded-full bg-danger" /> Despesas</span>
            </div>

            <div className="flex items-end justify-between gap-1" style={{ height: CHART_HEIGHT }}>
                {data.map((month) => (
                    <div key={month.key} className="flex flex-1 flex-col items-center gap-2">
                        <div className="flex items-end gap-1" style={{ height: CHART_HEIGHT - 22 }}>
                            <div className="w-2 rounded-full bg-primary" style={{ height: `${Math.max((month.income / maxValue) * 100, month.income > 0 ? 4 : 0)}%` }} />
                            <div className="w-2 rounded-full bg-danger" style={{ height: `${Math.max((month.outcome / maxValue) * 100, month.outcome > 0 ? 4 : 0)}%` }} />
                        </div>
                        <span className="text-[11px] capitalize text-tertiary/60">{month.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

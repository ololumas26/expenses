import { formatCoin } from "@/utils/coin";
import type { CategoryBreakdownItem } from "@/utils/category";

function CategoryCard({ category, total, percentage, accentColor }: CategoryBreakdownItem & { accentColor: string }) {
    return (
        <div className="rounded-2xl border border-border/60 p-3.5">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-tertiary">{category}</h3>
                <span className="text-xs font-semibold" style={{ color: accentColor }}>{percentage.toFixed(0)}%</span>
            </div>
            <p className="mt-1 text-base font-semibold text-tertiary">{formatCoin(total)}</p>
            <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-border/60">
                <div className="h-full rounded-full" style={{ width: `${Math.min(percentage, 100)}%`, backgroundColor: accentColor }} />
            </div>
        </div>
    );
}

export default function CategoryBreakdown({ categories, title = "Por categoria", accentColor = "var(--color-primary)" }: {
    categories: CategoryBreakdownItem[];
    title?: string;
    accentColor?: string;
}) {
    return (
        <div>
            <h2 className="mb-2.5 px-0.5 text-sm font-semibold text-tertiary">{title}</h2>
            {categories.length > 0 ? (
                <div className="flex flex-col gap-2.5 md:grid md:grid-cols-2 md:gap-3 md:space-y-0 lg:grid-cols-3">
                    {categories.map((item) => (
                        <CategoryCard key={item.category} accentColor={accentColor} {...item} />
                    ))}
                </div>
            ) : (
                <p className="py-4 text-center text-sm text-tertiary/60">Ainda não há movimentos categorizados</p>
            )}
        </div>
    );
}

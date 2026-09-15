"use client";

import { TrendingUp, TrendingDown, PiggyBank, HandCoins } from "lucide-react";
import { formatCoin } from "@/utils/coin";
import { getCategoryBreakdown } from "@/utils/category";
import { getMonthlyTotals, getMonthComparison, isCurrentMonth } from "@/utils/analytics";
import { useMoviments } from "@/hooks/useMoviments";
import { useGoals } from "@/hooks/useGoals";
import { useInvestments } from "@/hooks/useInvestments";
import { useCategories } from "@/hooks/useCategories";
import MonthlyBarChart from "./MonthlyBarChart";
import CategoryPieChart from "./CategoryPieChart";
import CategoryBreakdown from "./CategoryBreakdown";

function ComparisonRow({ label, current, deltaPct, higherIsGood }: {
    label: string;
    current: number;
    deltaPct: number | null;
    higherIsGood: boolean;
}) {
    const isUp = (deltaPct ?? 0) >= 0;
    const isGood = deltaPct === null ? true : isUp ? higherIsGood : !higherIsGood;
    const trendColorClass = deltaPct === null ? "text-tertiary/50" : isGood ? "text-primary" : "text-danger";
    const trendBgClass = deltaPct === null ? "bg-tertiary/10" : isGood ? "bg-primary/10" : "bg-danger/10";
    const TrendIcon = isUp ? TrendingUp : TrendingDown;

    return (
        <div className="flex items-center justify-between py-1.5">
            <div>
                <p className="text-xs text-tertiary/60">{label}</p>
                <p className="mt-0.5 text-base font-bold text-tertiary">{formatCoin(current)}</p>
            </div>
            {deltaPct !== null && (
                <span className={`flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-bold ${trendColorClass} ${trendBgClass}`}>
                    <TrendIcon size={14} aria-hidden="true" />
                    {Math.abs(deltaPct).toFixed(0)}%
                </span>
            )}
        </div>
    );
}

function GoalProgressRow({ name, currentAmount, targetAmount }: { name: string; currentAmount: number; targetAmount: number }) {
    const progress = targetAmount > 0 ? Math.min((currentAmount / targetAmount) * 100, 100) : 0;

    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-tertiary">{name}</p>
                <p className="text-xs font-bold text-primary">{progress.toFixed(0)}%</p>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-border/60">
                <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
            </div>
        </div>
    );
}

export default function AnalyticsPageContent() {
    const { moviments } = useMoviments("", 1000);
    const { goals } = useGoals();
    const { investments } = useInvestments();
    const { categories } = useCategories();

    const monthlyTotals = getMonthlyTotals(moviments, 6);
    const comparison = getMonthComparison(moviments);

    const currentMonthOutcomes = moviments.filter((movement) => movement.type === "outcome" && isCurrentMonth(movement.date));
    const categoryBreakdown = getCategoryBreakdown(currentMonthOutcomes);

    const savingsCategory = categories.find((category) => category.slug === "savings");
    const totalSaved = savingsCategory
        ? moviments
              .filter((movement) => movement.category === savingsCategory.name)
              .reduce((sum, movement) => sum + (movement.type === "income" ? -movement.amount : movement.amount), 0)
        : 0;

    const totalInvested = investments.reduce((sum, investment) => sum + investment.investedAmount, 0);

    return (
        <div className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
                <div className="rounded-2xl border border-border/60 p-4">
                    <h2 className="mb-2 text-sm font-semibold text-tertiary">Este mês vs. mês passado</h2>
                    <ComparisonRow label="Receitas" current={comparison.currentIncome} deltaPct={comparison.incomeDeltaPct} higherIsGood={true} />
                    <div className="my-1 h-px bg-border/60" />
                    <ComparisonRow label="Despesas" current={comparison.currentOutcome} deltaPct={comparison.outcomeDeltaPct} higherIsGood={false} />
                </div>

                <div className="rounded-2xl border border-border/60 p-4">
                    <h2 className="mb-3 text-sm font-semibold text-tertiary">Evolução mensal</h2>
                    <MonthlyBarChart data={monthlyTotals} />
                </div>
            </div>

            <CategoryPieChart categories={categoryBreakdown} title="Despesas por categoria (este mês)" />

            <CategoryBreakdown categories={categoryBreakdown} title="Despesas por categoria (este mês)" />

            <div className="rounded-2xl border border-border/60 p-4">
                <h2 className="mb-3 text-sm font-semibold text-tertiary">Metas</h2>
                {goals.length > 0 ? (
                    <div className="flex flex-col gap-3.5 md:grid md:grid-cols-2 md:gap-4">
                        {goals.map((goal) => (
                            <GoalProgressRow key={goal.id} name={goal.name} currentAmount={goal.currentAmount} targetAmount={goal.targetAmount} />
                        ))}
                    </div>
                ) : (
                    <p className="py-2 text-center text-sm text-tertiary/60">Ainda não tens metas definidas</p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-neutral p-4">
                    <span className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <PiggyBank size={18} aria-hidden="true" />
                    </span>
                    <p className="text-xs text-tertiary/60">Poupado</p>
                    <p className="mt-0.5 text-base font-bold text-tertiary">{formatCoin(totalSaved)}</p>
                </div>
                <div className="rounded-2xl bg-neutral p-4">
                    <span className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                        <HandCoins size={18} aria-hidden="true" />
                    </span>
                    <p className="text-xs text-tertiary/60">Investido</p>
                    <p className="mt-0.5 text-base font-bold text-tertiary">{formatCoin(totalInvested)}</p>
                </div>
            </div>
        </div>
    );
}

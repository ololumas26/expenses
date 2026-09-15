"use client";

import { useState } from "react";
import { Plus, Wallet } from "lucide-react";
import { formatCoin } from "@/utils/coin";
import { useBudgets } from "@/hooks/useBudgets";
import { useMoviments } from "@/hooks/useMoviments";
import { useCategories } from "@/hooks/useCategories";
import { isCurrentMonth } from "@/utils/analytics";
import Modal from "@/components/ui/Modal";
import AmountInput from "@/components/ui/AmountInput";
import CategoryPickerField from "@/components/ui/CategoryPickerField";
import BudgetCard from "./BudgetCard";

function progressOf(spent: number, limit: number) {
    return limit > 0 ? (spent / limit) * 100 : 0;
}

export default function BudgetPageContent() {
    const { budgets, upsertBudget, deleteBudget } = useBudgets();
    const { moviments } = useMoviments("", 1000);
    const { categories } = useCategories();

    const [showNewModal, setShowNewModal] = useState(false);
    const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
    const [limit, setLimit] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const availableCategories = categories.filter((category) =>
        category.type === "outcome" && !budgets.some((budget) => budget.categoryId === category.id)
    );

    const spentByBudget = budgets.reduce<Record<string, number>>((acc, budget) => {
        acc[budget.id] = moviments
            .filter((movement) => movement.type === "outcome" && movement.category === budget.categoryName && isCurrentMonth(movement.date))
            .reduce((total, movement) => total + movement.amount, 0);
        return acc;
    }, {});

    const totalBudgeted = budgets.reduce((total, budget) => total + budget.monthlyLimit, 0);
    const totalSpent = budgets.reduce((total, budget) => total + (spentByBudget[budget.id] ?? 0), 0);
    const overallProgress = progressOf(totalSpent, totalBudgeted);
    const isOver = overallProgress > 100;
    const isNear = overallProgress >= 80 && overallProgress <= 100;
    const heroClass = isOver ? "bg-danger" : isNear ? "bg-warning" : "bg-primary";

    const sortedBudgets = [...budgets].sort((a, b) =>
        progressOf(spentByBudget[b.id] ?? 0, b.monthlyLimit) - progressOf(spentByBudget[a.id] ?? 0, a.monthlyLimit)
    );

    function closeModal() {
        setShowNewModal(false);
        setCategoryId(undefined);
        setLimit("");
        setError("");
    }

    async function handleCreateBudget() {
        const parsedLimit = Number(limit.replace(",", "."));

        if (!categoryId) {
            setError("Escolhe uma categoria");
            return;
        }
        if (!limit.trim() || Number.isNaN(parsedLimit) || parsedLimit <= 0) {
            setError("Indica um limite válido");
            return;
        }

        setSubmitting(true);
        const success = await upsertBudget(categoryId, parsedLimit);
        setSubmitting(false);

        if (success) closeModal();
        else setError("Não foi possível criar o orçamento");
    }

    return (
        <div className="space-y-6">
            <div className={`rounded-2xl p-5 text-white ${heroClass}`}>
                <div className="flex items-center justify-between">
                    <h2 className="text-sm text-white/80">Gasto este mês</h2>
                    <span className="rounded-full bg-white/20 p-2"><Wallet size={18} aria-hidden="true" /></span>
                </div>
                <p className="mt-2 text-4xl font-semibold tracking-tight">{formatCoin(totalSpent)}</p>
                <p className="mt-3 text-xs text-white/80">{budgets.length > 0 ? `de ${formatCoin(totalBudgeted)} orçamentados` : "Ainda sem orçamentos definidos"}</p>
                {budgets.length > 0 && (
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/25">
                        <div className="h-full rounded-full bg-white" style={{ width: `${Math.min(overallProgress, 100)}%` }} />
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-tertiary/60">Por categoria</h2>
                <button type="button" onClick={() => setShowNewModal(true)} aria-label="Novo orçamento" className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/15">
                    <Plus size={18} aria-hidden="true" />
                </button>
            </div>

            {sortedBudgets.length === 0 && (
                <p className="rounded-2xl border border-dashed border-border/60 p-6 text-center text-sm text-tertiary/60">Ainda não definiste nenhum orçamento</p>
            )}

            <div className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0 lg:grid-cols-3">
                {sortedBudgets.map((budget) => (
                    <BudgetCard key={budget.id} budget={budget} spent={spentByBudget[budget.id] ?? 0} onEdit={upsertBudget} onDelete={deleteBudget} />
                ))}
            </div>

            <Modal open={showNewModal} onClose={closeModal} title="Novo orçamento">
                <CategoryPickerField categories={availableCategories} value={categoryId} onChange={setCategoryId} />
                <AmountInput value={limit} onChange={setLimit} />
                {!!error && <p className="text-center text-xs text-danger">{error}</p>}
                <button type="button" onClick={handleCreateBudget} disabled={submitting} className="rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60">
                    {submitting ? "A guardar..." : "Criar orçamento"}
                </button>
            </Modal>
        </div>
    );
}

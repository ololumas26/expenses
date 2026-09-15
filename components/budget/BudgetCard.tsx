"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { formatCoin } from "@/utils/coin";
import Modal from "@/components/ui/Modal";
import AmountInput from "@/components/ui/AmountInput";
import CategoryIcon from "@/components/movements/CategoryIcon";
import type { Budget } from "@/types/models";

export default function BudgetCard({ budget, spent, onEdit, onDelete }: {
    budget: Budget;
    spent: number;
    onEdit: (categoryId: string, monthlyLimit: number) => Promise<boolean>;
    onDelete: (budgetId: string) => Promise<boolean>;
}) {
    const [showEditModal, setShowEditModal] = useState(false);
    const [limitInput, setLimitInput] = useState(String(budget.monthlyLimit));
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const progress = budget.monthlyLimit > 0 ? (spent / budget.monthlyLimit) * 100 : 0;
    const isOver = progress > 100;
    const isNear = progress >= 80 && progress <= 100;
    const progressColor = isOver ? "bg-danger" : isNear ? "bg-warning" : "bg-primary";
    const textColor = isOver ? "text-danger" : isNear ? "text-warning" : "text-primary";

    function openEditModal() {
        setLimitInput(String(budget.monthlyLimit));
        setError("");
        setShowEditModal(true);
    }

    async function handleEdit() {
        const parsedLimit = Number(limitInput.replace(",", "."));

        if (!limitInput.trim() || Number.isNaN(parsedLimit) || parsedLimit <= 0) {
            setError("Indica um limite válido");
            return;
        }

        setSubmitting(true);
        const success = await onEdit(budget.categoryId, parsedLimit);
        setSubmitting(false);

        if (success) setShowEditModal(false);
        else setError("Não foi possível guardar");
    }

    return (
        <article className="rounded-2xl border border-border/60 p-4">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <span className="rounded-full bg-primary/10 p-1.5 text-primary"><CategoryIcon slug={budget.categorySlug} /></span>
                    <h3 className="text-sm font-medium">{budget.categoryName}</h3>
                </div>
                <div className="flex items-center gap-3">
                    <button type="button" onClick={openEditModal} aria-label={`Editar orçamento de ${budget.categoryName}`} className="text-tertiary/40 hover:text-tertiary"><Pencil size={14} aria-hidden="true" /></button>
                    <button type="button" onClick={() => onDelete(budget.id)} aria-label={`Remover orçamento de ${budget.categoryName}`} className="text-tertiary/40 hover:text-danger"><Trash2 size={14} aria-hidden="true" /></button>
                </div>
            </div>

            <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-border/60">
                <div className={`h-full rounded-full ${progressColor}`} style={{ width: `${Math.min(progress, 100)}%` }} />
            </div>

            <div className="mt-2.5 flex items-center justify-between text-xs">
                <p className="font-semibold text-tertiary">{formatCoin(spent)} <span className="font-normal text-tertiary/60">de {formatCoin(budget.monthlyLimit)}</span></p>
                <p className={`font-bold ${textColor}`}>{isOver ? "Ultrapassado" : `${progress.toFixed(0)}%`}</p>
            </div>

            <Modal open={showEditModal} onClose={() => setShowEditModal(false)} title={`Limite mensal — ${budget.categoryName}`}>
                <AmountInput value={limitInput} onChange={setLimitInput} />
                {!!error && <p className="text-center text-xs text-danger">{error}</p>}
                <button type="button" onClick={handleEdit} disabled={submitting} className="rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60">
                    {submitting ? "A guardar..." : "Guardar"}
                </button>
            </Modal>
        </article>
    );
}

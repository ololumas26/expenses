"use client";

import { useState } from "react";
import { Target, Plus, Pencil } from "lucide-react";
import { formatCoin } from "@/utils/coin";
import Modal from "@/components/ui/Modal";
import AmountInput from "@/components/ui/AmountInput";
import DatePickerField from "@/components/ui/DatePickerField";
import type { Goal } from "@/types/models";

function formatDeadline(date: Date) {
    return new Intl.DateTimeFormat("pt-PT", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

export default function GoalCard({ goal, onAddFunds, onEdit }: {
    goal: Goal;
    onAddFunds: (goalId: string, amount: number) => Promise<boolean>;
    onEdit: (goalId: string, updates: { name: string; targetAmount: number; deadline?: Date }) => Promise<boolean>;
}) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [amount, setAmount] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const [showEditModal, setShowEditModal] = useState(false);
    const [editName, setEditName] = useState(goal.name);
    const [editTargetAmount, setEditTargetAmount] = useState(String(goal.targetAmount));
    const [editDeadline, setEditDeadline] = useState(goal.deadline ?? new Date());
    const [editError, setEditError] = useState("");
    const [editSubmitting, setEditSubmitting] = useState(false);

    const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
    const isComplete = progress >= 100;

    function closeModal() {
        setShowAddModal(false);
        setAmount("");
        setError("");
    }

    function openEditModal() {
        setEditName(goal.name);
        setEditTargetAmount(String(goal.targetAmount));
        setEditDeadline(goal.deadline ?? new Date());
        setEditError("");
        setShowEditModal(true);
    }

    async function handleEditGoal() {
        const parsedAmount = Number(editTargetAmount.replace(",", "."));

        if (!editName.trim()) {
            setEditError("Indica um nome para a meta");
            return;
        }
        if (!editTargetAmount.trim() || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
            setEditError("Indica um valor objetivo válido");
            return;
        }

        setEditSubmitting(true);
        const success = await onEdit(goal.id, { name: editName.trim(), targetAmount: parsedAmount, deadline: editDeadline });
        setEditSubmitting(false);

        if (success) setShowEditModal(false);
        else setEditError("Não foi possível guardar as alterações");
    }

    async function handleAddFunds() {
        const parsedAmount = Number(amount.replace(",", "."));

        if (!amount.trim() || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
            setError("Indica um valor válido");
            return;
        }

        setSubmitting(true);
        const success = await onAddFunds(goal.id, parsedAmount);
        setSubmitting(false);

        if (success) closeModal();
        else setError("Não foi possível adicionar o valor");
    }

    return (
        <article className="rounded-2xl border border-border/60 p-4">
            <div className="mb-4 flex items-center gap-3">
                <span className="rounded-full bg-primary/10 p-2 text-primary"><Target size={20} aria-hidden="true" /></span>
                <div className="min-w-0 flex-1"><h3 className="text-sm font-semibold">{goal.name}</h3>{goal.deadline && <p className="text-xs text-tertiary/60">{isComplete ? "Concluída" : `até ${formatDeadline(goal.deadline)}`}</p>}</div>
                <span className="text-sm font-semibold text-primary">{Math.min(progress, 100).toFixed(0)}%</span>
                <button type="button" onClick={openEditModal} aria-label="Editar meta" className="text-tertiary/40 hover:text-tertiary"><Pencil size={16} aria-hidden="true" /></button>
            </div>
            <div role="progressbar" aria-label={goal.name} aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100} className="h-2 overflow-hidden rounded-full bg-border/60">
                <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(progress, 100)}%` }} />
            </div>
            <p className="mt-3 flex flex-wrap justify-between gap-2 text-xs"><span className="font-semibold">{formatCoin(goal.currentAmount)}</span><span className="text-tertiary/60">de {formatCoin(goal.targetAmount)}</span></p>

            {!isComplete && (
                <button type="button" onClick={() => setShowAddModal(true)} className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary/10 py-2.5 text-xs font-semibold text-primary hover:bg-primary/15">
                    <Plus size={16} aria-hidden="true" /> Adicionar dinheiro
                </button>
            )}

            <Modal open={showAddModal} onClose={closeModal} title={`Adicionar a "${goal.name}"`}>
                <AmountInput value={amount} onChange={setAmount} />
                {!!error && <p className="text-center text-xs text-danger">{error}</p>}
                <button type="button" onClick={handleAddFunds} disabled={submitting} className="rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60">
                    {submitting ? "A guardar..." : "Adicionar"}
                </button>
            </Modal>

            <Modal open={showEditModal} onClose={() => setShowEditModal(false)} title="Editar meta">
                <div>
                    <label htmlFor={`edit-name-${goal.id}`} className="mb-1.5 block text-xs text-tertiary/60">Nome</label>
                    <input id={`edit-name-${goal.id}`} value={editName} onChange={(event) => setEditName(event.target.value)} className="w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none focus:border-primary" />
                </div>
                <div>
                    <label htmlFor={`edit-amount-${goal.id}`} className="mb-1.5 block text-xs text-tertiary/60">Valor objetivo</label>
                    <input id={`edit-amount-${goal.id}`} inputMode="decimal" value={editTargetAmount} onChange={(event) => setEditTargetAmount(event.target.value)} className="w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none focus:border-primary" />
                </div>
                <DatePickerField value={editDeadline} onChange={setEditDeadline} label="Data do objetivo" id={`edit-deadline-${goal.id}`} />
                {!!editError && <p className="text-center text-xs text-danger">{editError}</p>}
                <button type="button" onClick={handleEditGoal} disabled={editSubmitting} className="rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60">
                    {editSubmitting ? "A guardar..." : "Guardar alterações"}
                </button>
            </Modal>
        </article>
    );
}

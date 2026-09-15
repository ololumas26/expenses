"use client";

import { useState } from "react";
import { HandCoins, Plus, Trash2 } from "lucide-react";
import { formatCoin } from "@/utils/coin";
import Modal from "@/components/ui/Modal";
import AmountInput from "@/components/ui/AmountInput";
import type { Investment } from "@/types/models";

export default function InvestmentCard({ investment, onAddFunds, onDelete }: {
    investment: Investment;
    onAddFunds: (investmentId: string, amount: number) => Promise<boolean>;
    onDelete: (investmentId: string) => Promise<boolean>;
}) {
    const [showAddModal, setShowAddModal] = useState(false);
    const [amount, setAmount] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    function closeModal() {
        setShowAddModal(false);
        setAmount("");
        setError("");
    }

    async function handleAddFunds() {
        const parsedAmount = Number(amount.replace(",", "."));

        if (!amount.trim() || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
            setError("Indica um valor válido");
            return;
        }

        setSubmitting(true);
        const success = await onAddFunds(investment.id, parsedAmount);
        setSubmitting(false);

        if (success) closeModal();
        else setError("Não foi possível adicionar o valor");
    }

    return (
        <article className="rounded-2xl border border-border/60 p-4">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <span className="rounded-full bg-secondary/10 p-2 text-secondary"><HandCoins size={18} aria-hidden="true" /></span>
                    <h3 className="text-sm font-semibold">{investment.name}</h3>
                </div>
                <button type="button" onClick={() => onDelete(investment.id)} aria-label={`Remover ${investment.name}`} className="text-tertiary/40 hover:text-danger"><Trash2 size={16} aria-hidden="true" /></button>
            </div>

            <p className="mt-3 text-lg font-bold text-tertiary">{formatCoin(investment.investedAmount)}</p>

            <button type="button" onClick={() => setShowAddModal(true)} className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-secondary/10 py-2.5 text-xs font-semibold text-secondary hover:bg-secondary/15">
                <Plus size={16} aria-hidden="true" /> Adicionar valor
            </button>

            <Modal open={showAddModal} onClose={closeModal} title={`Adicionar a "${investment.name}"`}>
                <AmountInput value={amount} onChange={setAmount} color="text-secondary" />
                {!!error && <p className="text-center text-xs text-danger">{error}</p>}
                <button type="button" onClick={handleAddFunds} disabled={submitting} className="rounded-xl bg-secondary py-3 text-sm font-semibold text-white hover:bg-secondary/90 disabled:opacity-60">
                    {submitting ? "A guardar..." : "Adicionar"}
                </button>
            </Modal>
        </article>
    );
}

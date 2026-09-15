"use client";

import { useState } from "react";
import { Plus, HandCoins } from "lucide-react";
import { formatCoin } from "@/utils/coin";
import { useInvestments } from "@/hooks/useInvestments";
import { useMoviments } from "@/hooks/useMoviments";
import { useCategories } from "@/hooks/useCategories";
import { useTotals } from "@/context/TotalsContext";
import Modal from "@/components/ui/Modal";
import InvestmentCard from "./InvestmentCard";

export default function InvestmentsPageContent() {
    const { investments, createInvestment, addFunds, deleteInvestment, isLoading } = useInvestments();
    const { createMoviment } = useMoviments();
    const { categories } = useCategories();
    const { applyMovement } = useTotals();

    const [showNewModal, setShowNewModal] = useState(false);
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const totalInvested = investments.reduce((total, investment) => total + investment.investedAmount, 0);

    function closeModal() {
        setShowNewModal(false);
        setName("");
        setError("");
    }

    async function handleCreateInvestment() {
        if (!name.trim()) {
            setError("Indica um nome para o investimento");
            return;
        }

        setSubmitting(true);
        const created = await createInvestment(name.trim());
        setSubmitting(false);

        if (created) closeModal();
        else setError("Não foi possível criar o investimento");
    }

    async function handleAddFunds(investmentId: string, amount: number) {
        const investment = investments.find((item) => item.id === investmentId);
        const investmentsCategory = categories.find((item) => item.slug === "investments");

        const created = await createMoviment({
            name: `Investimento${investment ? `: ${investment.name}` : ""}`,
            category: investmentsCategory?.id,
            amount,
            date: new Date(),
            type: "outcome",
        });

        if (!created) return false;

        applyMovement("outcome", amount);
        return addFunds(investmentId, amount);
    }

    return (
        <div className="space-y-6">
            <div className="rounded-2xl bg-secondary p-5 text-white">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm text-white/80">Total investido</h2>
                    <span className="rounded-full bg-white/20 p-2"><HandCoins size={18} aria-hidden="true" /></span>
                </div>
                <p className="mt-2 text-4xl font-semibold tracking-tight">{formatCoin(totalInvested)}</p>
                <p className="mt-3 text-xs text-white/80">{investments.length} {investments.length === 1 ? "investimento" : "investimentos"}</p>
            </div>

            <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-tertiary/60">Os teus investimentos</h2>
                <button type="button" onClick={() => setShowNewModal(true)} aria-label="Novo investimento" className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary/10 text-secondary hover:bg-secondary/15">
                    <Plus size={18} aria-hidden="true" />
                </button>
            </div>

            {isLoading && investments.length === 0 && <p className="text-center text-sm text-tertiary/60">A carregar...</p>}
            {!isLoading && investments.length === 0 && (
                <p className="rounded-2xl border border-dashed border-border/60 p-6 text-center text-sm text-tertiary/60">Ainda não registaste nenhum investimento</p>
            )}

            <div className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0 lg:grid-cols-3">
                {investments.map((investment) => (
                    <InvestmentCard key={investment.id} investment={investment} onAddFunds={handleAddFunds} onDelete={deleteInvestment} />
                ))}
            </div>

            <Modal open={showNewModal} onClose={closeModal} title="Novo investimento">
                <div>
                    <label htmlFor="new-investment-name" className="mb-1.5 block text-xs text-tertiary/60">Nome</label>
                    <input id="new-investment-name" placeholder="Ex: PPR, Ações XPTO, Cripto" value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none focus:border-secondary" />
                </div>
                {!!error && <p className="text-center text-xs text-danger">{error}</p>}
                <button type="button" onClick={handleCreateInvestment} disabled={submitting} className="rounded-xl bg-secondary py-3 text-sm font-semibold text-white hover:bg-secondary/90 disabled:opacity-60">
                    {submitting ? "A guardar..." : "Criar investimento"}
                </button>
            </Modal>
        </div>
    );
}

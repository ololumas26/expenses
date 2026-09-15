"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import { useGoals } from "@/hooks/useGoals";
import { useMoviments } from "@/hooks/useMoviments";
import { useCategories } from "@/hooks/useCategories";
import { useTotals } from "@/context/TotalsContext";
import Modal from "@/components/ui/Modal";
import DatePickerField from "@/components/ui/DatePickerField";
import GoalCard from "./GoalCard";

export default function GoalsOverview() {
    const searchParams = useSearchParams();
    const prefillName = searchParams.get("prefillName");

    const { goals, createGoal, addFunds, updateGoal, isLoading } = useGoals();
    const { createMoviment } = useMoviments();
    const { categories } = useCategories();
    const { applyMovement } = useTotals();

    const [completed, setCompleted] = useState(false);
    const [showNewGoalModal, setShowNewGoalModal] = useState(false);
    const [name, setName] = useState("");
    const [targetAmount, setTargetAmount] = useState("");
    const [deadline, setDeadline] = useState(new Date());
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (prefillName) {
            setName(prefillName);
            setShowNewGoalModal(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [prefillName]);

    const filteredGoals = goals.filter((goal) => (goal.currentAmount >= goal.targetAmount) === completed);

    async function handleAddFundsToGoal(goalId: string, amount: number) {
        const goal = goals.find((item) => item.id === goalId);
        const goalsCategory = categories.find((item) => item.slug === "goals");

        const created = await createMoviment({
            name: `Transferência${goal ? `: ${goal.name}` : ""}`,
            category: goalsCategory?.id,
            amount,
            date: new Date(),
            type: "outcome",
        });

        if (!created) return false;

        applyMovement("outcome", amount);
        return addFunds(goalId, amount);
    }

    function closeModal() {
        setShowNewGoalModal(false);
        setName("");
        setTargetAmount("");
        setDeadline(new Date());
        setError("");
    }

    async function handleCreateGoal() {
        const parsedAmount = Number(targetAmount.replace(",", "."));

        if (!name.trim()) {
            setError("Indica um nome para a meta");
            return;
        }
        if (!targetAmount.trim() || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
            setError("Indica um valor objetivo válido");
            return;
        }

        setSubmitting(true);
        const created = await createGoal({ name: name.trim(), targetAmount: parsedAmount, deadline });
        setSubmitting(false);

        if (created) closeModal();
        else setError("Não foi possível criar a meta");
    }

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between gap-3">
                <div className="grid flex-1 grid-cols-2 gap-2 rounded-xl border border-border/60 p-1">
                    {[false, true].map((value) => (
                        <button key={String(value)} type="button" aria-pressed={completed === value} onClick={() => setCompleted(value)} className={`rounded-lg py-2 text-sm font-semibold ${completed === value ? "bg-primary/10 text-primary" : "text-tertiary/60"}`}>
                            {value ? "Concluídas" : "Em progresso"}
                        </button>
                    ))}
                </div>
                <button type="button" onClick={() => setShowNewGoalModal(true)} aria-label="Nova meta" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/15">
                    <Plus size={20} aria-hidden="true" />
                </button>
            </div>

            {isLoading && goals.length === 0 && <p className="text-center text-sm text-tertiary/60">A carregar metas...</p>}
            {!isLoading && filteredGoals.length === 0 && (
                <p className="rounded-2xl border border-dashed border-border/60 p-6 text-center text-sm text-tertiary/60">
                    {completed ? "Ainda não tens metas concluídas" : "Ainda não definiste nenhuma meta"}
                </p>
            )}

            <div className="space-y-3 md:grid md:grid-cols-2 md:gap-4 md:space-y-0 lg:grid-cols-3">
                {filteredGoals.map((goal) => <GoalCard key={goal.id} goal={goal} onAddFunds={handleAddFundsToGoal} onEdit={updateGoal} />)}
            </div>

            <Modal open={showNewGoalModal} onClose={closeModal} title="Nova meta">
                <div>
                    <label htmlFor="new-goal-name" className="mb-1.5 block text-xs text-tertiary/60">Nome</label>
                    <input id="new-goal-name" placeholder="Ex: Viagem a Cabo Verde" value={name} onChange={(event) => setName(event.target.value)} className="w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none focus:border-primary" />
                </div>
                <div>
                    <label htmlFor="new-goal-amount" className="mb-1.5 block text-xs text-tertiary/60">Valor objetivo</label>
                    <input id="new-goal-amount" placeholder="0,00" inputMode="decimal" value={targetAmount} onChange={(event) => setTargetAmount(event.target.value)} className="w-full rounded-xl border border-border px-3 py-2.5 text-sm outline-none focus:border-primary" />
                </div>
                <DatePickerField value={deadline} onChange={setDeadline} label="Data do objetivo" id="new-goal-deadline" />
                {!!error && <p className="text-center text-xs text-danger">{error}</p>}
                <button type="button" onClick={handleCreateGoal} disabled={submitting} className="rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60">
                    {submitting ? "A guardar..." : "Criar meta"}
                </button>
            </Modal>
        </section>
    );
}

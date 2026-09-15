"use client";

import { useState } from "react";
import { Plus, Minus, type LucideIcon } from "lucide-react";
import { formatCoin } from "@/utils/coin";
import AmountInput from "@/components/ui/AmountInput";
import SavingsList from "./SavingsList";
import { useMoviments } from "@/hooks/useMoviments";
import { useCategories } from "@/hooks/useCategories";
import { useTotals } from "@/context/TotalsContext";

type Mode = "deposit" | "withdraw";

export default function AccumulationScreen({ heroLabel, icon: Icon, categorySlug, accentColor = "primary" }: {
    heroLabel: string;
    icon: LucideIcon;
    categorySlug: string;
    accentColor?: "primary" | "secondary";
}) {
    const { moviments, createMoviment, getMoviments } = useMoviments("", 1000);
    const { categories } = useCategories();
    const { applyMovement } = useTotals();

    const [mode, setMode] = useState<Mode | null>(null);
    const [amount, setAmount] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const category = categories.find((item) => item.slug === categorySlug);
    const entries = category ? moviments.filter((movement) => movement.category === category.name) : [];

    // Depósito soma ao total guardado, levantamento subtrai.
    const total = entries.reduce((sum, movement) => sum + (movement.type === "income" ? -movement.amount : movement.amount), 0);

    function cancelInput() {
        setMode(null);
        setAmount("");
        setError("");
    }

    async function handleSubmit() {
        const parsedAmount = Number(amount.replace(",", "."));

        if (!amount.trim() || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
            setError("Indica um valor válido");
            return;
        }
        if (mode === "withdraw" && parsedAmount > total) {
            setError("Não podes retirar mais do que tens guardado");
            return;
        }
        if (!category) {
            setError(`Falta configurar a categoria "${categorySlug}" antes de continuar`);
            return;
        }

        setSubmitting(true);
        const movementType = mode === "withdraw" ? "income" : "outcome";

        const created = await createMoviment({
            name: mode === "withdraw" ? `Levantamento: ${heroLabel}` : heroLabel,
            category: category.id,
            amount: parsedAmount,
            date: new Date(),
            type: movementType,
        });

        setSubmitting(false);

        if (!created) {
            setError("Não foi possível guardar");
            return;
        }

        applyMovement(movementType, parsedAmount);
        await getMoviments();
        cancelInput();
    }

    const historyItems = entries
        .slice()
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .map((movement) => ({
            id: movement.id ?? `${movement.name}-${movement.date.getTime()}`,
            title: movement.name,
            amount: movement.amount,
            date: movement.date,
            type: movement.type,
        }));

    const accent = accentColor === "secondary" ? "text-secondary bg-secondary" : "text-primary bg-primary";

    return (
        <div className="space-y-6">
            <div className="flex flex-col items-center gap-2 py-3">
                <span className={`mb-1.5 flex h-18 w-18 items-center justify-center rounded-full ${accentColor === "secondary" ? "bg-secondary/15 text-secondary" : "bg-primary/15 text-primary"}`}>
                    <Icon size={32} aria-hidden="true" />
                </span>
                <p className="text-sm font-medium text-tertiary/60">{heroLabel}</p>
                <p className="text-3xl font-bold text-tertiary">{formatCoin(total)}</p>
            </div>

            {mode === null ? (
                <div className="flex gap-3">
                    <button type="button" onClick={() => setMode("deposit")} className={`flex flex-1 items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold text-white ${accentColor === "secondary" ? "bg-secondary hover:bg-secondary/90" : "bg-primary hover:bg-primary/90"}`}>
                        <Plus size={20} aria-hidden="true" /> Adicionar
                    </button>
                    <button type="button" onClick={() => setMode("withdraw")} className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-border/40 py-3.5 text-sm font-semibold text-tertiary hover:bg-border/60">
                        <Minus size={20} aria-hidden="true" /> Retirar
                    </button>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-4">
                    <p className="text-sm font-semibold text-tertiary">{mode === "withdraw" ? `Retirar de ${heroLabel}` : `Adicionar a ${heroLabel}`}</p>
                    <AmountInput value={amount} onChange={setAmount} color={mode === "withdraw" ? "text-danger" : accent.split(" ")[0]} />
                    {!!error && <p className="text-center text-xs text-danger">{error}</p>}
                    <div className="flex w-full gap-3">
                        <button type="button" onClick={cancelInput} className="flex-1 rounded-2xl bg-border/40 py-3.5 text-sm font-semibold text-tertiary hover:bg-border/60">Cancelar</button>
                        <button type="button" onClick={handleSubmit} disabled={submitting} className={`flex-1 rounded-2xl py-3.5 text-sm font-semibold text-white disabled:opacity-60 ${mode === "withdraw" ? "bg-danger hover:bg-danger/90" : accentColor === "secondary" ? "bg-secondary hover:bg-secondary/90" : "bg-primary hover:bg-primary/90"}`}>
                            {submitting ? "A guardar..." : "Guardar"}
                        </button>
                    </div>
                </div>
            )}

            <SavingsList savings={historyItems} title="Histórico" />
        </div>
    );
}

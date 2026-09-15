"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { Category, MovementType } from "@/types/movement";
import MovementTypeSelector from "./MovementTypeSelector";
import MovementCategorySelect from "./MovementCategorySelect";
import MovementAmount from "./MovementAmount";
import { useMoviments } from "@/hooks/useMoviments";
import { useTotals } from "@/context/TotalsContext";

const inputClassName = "w-full rounded-xl border border-border bg-neutral px-3 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

export default function MovementForm({ initialType, categories }: { initialType: MovementType; categories: Category[] }) {
    const router = useRouter();
    const { createMoviment, isLoading } = useMoviments();
    const { applyMovement } = useTotals();

    const [type, setType] = useState<MovementType>(initialType);
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
    const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [notes, setNotes] = useState("");
    const [error, setError] = useState("");

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const parsedAmount = Number(amount.replace(",", "."));

        if (!amount.trim() || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
            setError("Indica um valor válido");
            return;
        }

        if (!description.trim()) {
            setError("Indica uma descrição");
            return;
        }

        if (!categoryId) {
            setError("Escolhe uma categoria");
            return;
        }

        setError("");

        const [year, month, day] = date.split("-").map(Number);

        const created = await createMoviment({
            name: description.trim(),
            category: categoryId,
            note: notes.trim() || undefined,
            amount: parsedAmount,
            date: new Date(year, month - 1, day),
            type,
        });

        if (!created) {
            setError("Não foi possível guardar o movimento. Tenta novamente.");
            return;
        }

        applyMovement(type, parsedAmount);
        router.push("/movimentos");
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <MovementTypeSelector value={type} onChange={(next) => { setType(next); setCategoryId(undefined); }} />

            <MovementAmount value={amount} onChange={setAmount} />

            <div>
                <label htmlFor="description" className="mb-2 block text-sm font-semibold">Descrição</label>
                <input id="description" name="description" placeholder="Ex.: Compras no supermercado" maxLength={150} required value={description} onChange={(event) => setDescription(event.target.value)} className={inputClassName} />
            </div>
            <MovementCategorySelect key={type} categories={categories} type={type} value={categoryId} onChange={setCategoryId} />
            <div>
                <label htmlFor="date" className="mb-2 block text-sm font-semibold">Data</label>
                <input id="date" name="date" type="date" required value={date} onChange={(event) => setDate(event.target.value)} className={inputClassName} />
            </div>
            <div>
                <label htmlFor="notes" className="mb-2 block text-sm font-semibold">Notas <span className="font-normal text-tertiary/60">(opcional)</span></label>
                <textarea id="notes" name="notes" rows={3} maxLength={1000} placeholder="Adiciona mais detalhes…" value={notes} onChange={(event) => setNotes(event.target.value)} className={`${inputClassName} resize-y`} />
            </div>

            {error && <p role="alert" className="rounded-xl bg-danger/10 p-3 text-sm text-danger">{error}</p>}
            <button type="submit" disabled={isLoading} className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60">
                {isLoading ? "A guardar..." : "Guardar movimento"}
            </button>
            <Link href="/dashboard" className="block py-2 text-center text-sm font-semibold text-tertiary/60 hover:text-primary">Cancelar</Link>
        </form>
    );
}

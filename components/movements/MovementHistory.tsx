"use client";

import { useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Search, ChevronLeft, ChevronRight, Calendar as CalendarIcon, X } from "lucide-react";
import { formatCoin } from "@/utils/coin";
import { useMoviments } from "@/hooks/useMoviments";
import type { MovementType } from "@/types/movement";

function formatDateKey(date: Date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function isSameDay(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

const TYPE_FILTERS: { value: MovementType | "all"; label: string }[] = [
    { value: "all", label: "Todos" },
    { value: "income", label: "Entradas" },
    { value: "outcome", label: "Saídas" },
];

export default function MovementHistory() {
    const [typeFilter, setTypeFilter] = useState<MovementType | "all">("all");
    const [search, setSearch] = useState("");
    const [dateFilter, setDateFilter] = useState("");

    const { moviments, isLoading, nextPage, previousPage, hasNextPage, hasPreviousPage, page } = useMoviments(typeFilter === "all" ? "" : typeFilter, 10);

    const normalize = (value: string) => value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLocaleLowerCase("pt-PT");

    const filtered = moviments.filter((movement) => {
        if (dateFilter) {
            const [year, month, day] = dateFilter.split("-").map(Number);
            if (!isSameDay(movement.date, new Date(year, month - 1, day))) return false;
        }
        return normalize(`${movement.name} ${movement.category ?? ""}`).includes(normalize(search));
    });

    const income = filtered.filter((item) => item.type === "income").reduce((sum, item) => sum + item.amount, 0);
    const outcome = filtered.filter((item) => item.type === "outcome").reduce((sum, item) => sum + item.amount, 0);

    return (
        <>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {[{ title: "Entradas", amount: income, color: "text-primary" }, { title: "Saídas", amount: outcome, color: "text-danger" }].map((item) => (
                    <div key={item.title} className="rounded-2xl border border-border/60 p-4"><p className="text-xs text-tertiary/60">{item.title} · esta página</p><p className={`mt-2 text-xl font-semibold ${item.color}`}>{formatCoin(item.amount)}</p></div>
                ))}
            </div>
            <div className="space-y-3 md:flex md:items-center md:gap-3 md:space-y-0">
                <label className="flex items-center gap-2 rounded-xl border border-border px-3 py-3 focus-within:ring-2 focus-within:ring-primary/30 md:flex-1">
                    <Search size={18} className="text-tertiary/50" aria-hidden="true" /><span className="sr-only">Pesquisar movimentos</span>
                    <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Pesquisar movimentos" className="min-w-0 w-full bg-transparent text-sm outline-none" />
                </label>
                <div className="flex gap-2" aria-label="Filtrar movimentos">
                    {TYPE_FILTERS.map((item) => (
                        <button key={item.value} type="button" aria-pressed={typeFilter === item.value} onClick={() => setTypeFilter(item.value)} className={`flex-1 rounded-full border px-3 py-2 text-xs font-semibold md:flex-none ${typeFilter === item.value ? "border-primary bg-primary/10 text-primary" : "border-border text-tertiary/60"}`}>{item.label}</button>
                    ))}
                </div>
                <label className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs">
                    <CalendarIcon size={16} className="text-tertiary/50" aria-hidden="true" />
                    <span className="sr-only">Filtrar por data</span>
                    <input type="date" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} className="bg-transparent text-tertiary outline-none" />
                    {dateFilter && (
                        <button type="button" onClick={() => setDateFilter("")} aria-label="Limpar filtro de data"><X size={14} className="text-tertiary/50" /></button>
                    )}
                </label>
            </div>
            <section aria-label="Movimentos">
                <p aria-live="polite" className="mb-2 text-xs text-tertiary/60">{isLoading ? "A carregar..." : `${filtered.length} movimentos encontrados`}</p>
                <ul className="divide-y divide-border/60 rounded-2xl border border-border/60 px-3">
                    {filtered.map((movement) => {
                        const income = movement.type === "income";
                        const Icon = income ? ArrowDownLeft : ArrowUpRight;
                        return <li key={movement.id} className="flex items-center gap-3 py-4">
                            <span className={`rounded-full p-2 ${income ? "bg-primary/10 text-primary" : "bg-danger/10 text-danger"}`}><Icon size={18} aria-hidden="true" /></span>
                            <div className="min-w-0 flex-1"><p className="text-sm font-semibold">{movement.name}</p>{movement.category && <p className="text-xs text-tertiary/60">{movement.category}</p>}</div>
                            <div className="shrink-0 text-right"><p className={`text-sm font-semibold ${income ? "text-primary" : "text-danger"}`}>{income ? "+" : "−"}{formatCoin(movement.amount)}</p><time dateTime={movement.date.toISOString()} className="text-xs text-tertiary/60">{formatDateKey(movement.date).split("-").reverse().join("/")}</time></div>
                        </li>;
                    })}
                    {!isLoading && filtered.length === 0 && <li className="p-6 text-center text-sm text-tertiary/60">Nenhum movimento corresponde à pesquisa.</li>}
                </ul>
            </section>
            <div className="flex items-center justify-center gap-5">
                <button type="button" onClick={previousPage} disabled={!hasPreviousPage || isLoading} aria-label="Página anterior" className="flex h-10 w-10 items-center justify-center rounded-full bg-border/40 disabled:opacity-40">
                    <ChevronLeft size={20} className="text-tertiary" />
                </button>
                <span className="min-w-16 text-center text-xs font-semibold text-tertiary">Página {page + 1}</span>
                <button type="button" onClick={nextPage} disabled={!hasNextPage || isLoading} aria-label="Próxima página" className="flex h-10 w-10 items-center justify-center rounded-full bg-border/40 disabled:opacity-40">
                    <ChevronRight size={20} className="text-tertiary" />
                </button>
            </div>
        </>
    );
}

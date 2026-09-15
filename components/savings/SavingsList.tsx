import { PiggyBank, ArrowDownRight } from "lucide-react";
import { formatCoin } from "@/utils/coin";
import type { Saving } from "@/types/models";

function formatSavingDate(date: Date) {
    return new Intl.DateTimeFormat("pt-PT", { day: "2-digit", month: "short" }).format(date);
}

export default function SavingsList({ savings, title = "Histórico" }: { savings: Saving[]; title?: string }) {
    return (
        <section>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-tertiary/60">{title}</h2>
            {savings.length > 0 ? (
                <ul className="divide-y divide-border/60 rounded-2xl border border-border/60 px-3">
                    {savings.map((saving) => {
                        // Um depósito é um 'outcome' na carteira (dinheiro que sai para a
                        // poupança); um levantamento é um 'income' (dinheiro que volta). Do
                        // ponto de vista da poupança, é o inverso: depósito soma, levantamento subtrai.
                        const isWithdrawal = saving.type === "income";
                        return (
                            <li key={saving.id} className="flex items-center gap-3 py-4">
                                <span className={`rounded-full p-2 ${isWithdrawal ? "bg-danger/10 text-danger" : "bg-primary/10 text-primary"}`}>
                                    {isWithdrawal ? <ArrowDownRight size={18} aria-hidden="true" /> : <PiggyBank size={18} aria-hidden="true" />}
                                </span>
                                <div className="min-w-0 flex-1"><p className="text-sm font-semibold">{saving.title}</p></div>
                                <div className="shrink-0 text-right">
                                    <p className={`text-sm font-semibold ${isWithdrawal ? "text-danger" : "text-primary"}`}>{isWithdrawal ? "− " : "+ "}{formatCoin(saving.amount)}</p>
                                    <time dateTime={saving.date.toISOString()} className="text-xs text-tertiary/60">{formatSavingDate(saving.date)}</time>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p className="rounded-2xl border border-dashed border-border/60 p-6 text-center text-sm text-tertiary/60">Ainda não há movimentos registados</p>
            )}
        </section>
    );
}

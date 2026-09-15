'use client'

import Link from "next/link";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { formatCoin } from "@/utils/coin";
import { useMoviments } from "@/hooks/useMoviments";

function formatMovementDate(date: Date) {
    return date.toLocaleDateString("pt-PT", { day: "2-digit", month: "short" });
}

export default function MovementList() {
    const { moviments, isLoading } = useMoviments("", 4);

    return (
        <section aria-labelledby="movements-title" className="w-full max-w-md mx-auto my-4 px-3 pb-28 md:max-w-none md:px-0 md:pb-0">
            <div className="flex items-center justify-between gap-3 mb-2 px-1">
                <h2 id="movements-title" className="text-xs font-semibold text-tertiary/60 uppercase tracking-wider">
                    Últimos movimentos
                </h2>
                <Link href="/movimentos" className="shrink-0 text-xs font-semibold text-primary hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
                    Ver todos
                </Link>
            </div>
            <ul className="divide-y divide-border/60 border border-border/60 rounded-2xl px-3">
                {isLoading && (
                    <li className="py-6 text-center text-sm text-tertiary/60">A carregar...</li>
                )}
                {!isLoading && moviments.length === 0 && (
                    <li className="py-6 text-center text-sm text-tertiary/60">Ainda não há movimentos para mostrar.</li>
                )}
                {moviments.map((movement) => {
                    const isIncome = movement.type === "income";
                    const Icon = isIncome ? ArrowDownLeft : ArrowUpRight;

                    return (
                        <li key={movement.id} className="flex items-center gap-3 py-4">
                            <div className={`shrink-0 rounded-full p-2 ${isIncome ? "bg-primary/10 text-primary" : "bg-danger/10 text-danger"}`}>
                                <Icon size={20} aria-hidden="true" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-tertiary break-words">{movement.name}</p>
                                {movement.category && <p className="text-xs text-tertiary/60">{movement.category}</p>}
                            </div>
                            <div className="shrink-0 text-right">
                                <p className={`text-sm font-semibold ${isIncome ? "text-primary" : "text-danger"}`}>
                                    <span className="sr-only">{isIncome ? "Entrada" : "Saída"}: </span>
                                    {isIncome ? "+" : "−"}{formatCoin(movement.amount)}
                                </p>
                                <time dateTime={movement.date.toISOString()} className="text-xs text-tertiary/60">
                                    {formatMovementDate(movement.date)}
                                </time>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}

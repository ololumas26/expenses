"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import type { MovementType } from "@/types/movement";

export type MovimentsTotals = {
    totalIncome: number;
    totalOutcome: number;
    balance: number;
};

const EMPTY_TOTALS = { totalIncome: 0, totalOutcome: 0, balance: 0 };

type TotalsContextValue = typeof EMPTY_TOTALS & {
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    applyMovement: (type: MovementType, amount: number) => void;
};

const TotalsContext = createContext<TotalsContextValue | undefined>(undefined);

export function TotalsProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();

    const [totals, setTotals] = useState(EMPTY_TOTALS);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function getTotals() {
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase
                .from("moviments_totals_view")
                .select("total_income, total_outcome, balance")
                .single();

            if (error) {
                setError("Não foi possível carregar os totais");
                return;
            }

            setTotals({
                totalIncome: Number(data?.total_income ?? 0),
                totalOutcome: Number(data?.total_outcome ?? 0),
                balance: Number(data?.balance ?? 0),
            });
        } catch {
            setError("Não foi possível carregar os totais");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (user) {
            getTotals();
        } else {
            setTotals(EMPTY_TOTALS);
            setError(null);
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id]);

    function applyMovement(type: MovementType, amount: number) {
        setTotals((prev) => ({
            totalIncome: type === "income" ? prev.totalIncome + amount : prev.totalIncome,
            totalOutcome: type === "outcome" ? prev.totalOutcome + amount : prev.totalOutcome,
            balance: type === "income" ? prev.balance + amount : prev.balance - amount,
        }));
    }

    return (
        <TotalsContext.Provider value={{ ...totals, loading, error, refetch: getTotals, applyMovement }}>
            {children}
        </TotalsContext.Provider>
    );
}

export function useTotals() {
    const context = useContext(TotalsContext);
    if (!context) throw new Error("useTotals deve ser usado dentro de um TotalsProvider");
    return context;
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import type { Investment } from "@/types/models";

function mapInvestment(row: any): Investment {
    return {
        id: row.id,
        name: row.name,
        investedAmount: Number(row.invested_amount),
    };
}

export function useInvestments() {
    const { user } = useAuth();

    const [investments, setInvestments] = useState<Investment[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const getInvestments = useCallback(async () => {
        setIsLoading(true);
        setError("");

        try {
            const { data, error } = await supabase.from("investments").select("*");

            if (error) {
                setError("Não foi possível carregar os investimentos");
                return;
            }

            setInvestments((data ?? []).map(mapInvestment));
        } catch {
            setError("Não foi possível carregar os investimentos");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!user) return;
        getInvestments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id]);

    async function createInvestment(name: string) {
        setIsLoading(true);
        setError("");

        try {
            const { data, error } = await supabase
                .from("investments")
                .insert({ user_id: user?.id, name, invested_amount: 0 })
                .select()
                .single();

            if (error) {
                setError("Não foi possível criar o investimento");
                return null;
            }

            const newInvestment = mapInvestment(data);
            setInvestments((prev) => [...prev, newInvestment]);
            return newInvestment;
        } catch {
            setError("Não foi possível criar o investimento");
            return null;
        } finally {
            setIsLoading(false);
        }
    }

    async function addFunds(investmentId: string, amount: number) {
        setError("");

        try {
            const investment = investments.find((item) => item.id === investmentId);
            if (!investment) {
                setError("Investimento não encontrado");
                return false;
            }

            const newAmount = investment.investedAmount + amount;

            const { data, error } = await supabase
                .from("investments")
                .update({ invested_amount: newAmount, updated_at: new Date().toISOString() })
                .eq("id", investmentId)
                .select()
                .single();

            if (error) {
                setError("Não foi possível adicionar o valor");
                return false;
            }

            const updated = mapInvestment(data);
            setInvestments((prev) => prev.map((item) => (item.id === investmentId ? updated : item)));
            return true;
        } catch {
            setError("Não foi possível adicionar o valor");
            return false;
        }
    }

    async function deleteInvestment(investmentId: string) {
        setError("");

        try {
            const { error } = await supabase.from("investments").delete().eq("id", investmentId);

            if (error) {
                setError("Não foi possível remover o investimento");
                return false;
            }

            setInvestments((prev) => prev.filter((item) => item.id !== investmentId));
            return true;
        } catch {
            setError("Não foi possível remover o investimento");
            return false;
        }
    }

    return { investments, getInvestments, createInvestment, addFunds, deleteInvestment, isLoading, error };
}

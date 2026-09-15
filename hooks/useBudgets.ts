"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import type { Budget } from "@/types/models";

function mapBudget(row: any): Budget {
    return {
        id: row.id,
        categoryId: row.category_id,
        categoryName: row.categories?.name ?? "",
        categorySlug: row.categories?.slug ?? null,
        monthlyLimit: Number(row.monthly_limit),
    };
}

export function useBudgets() {
    const { user } = useAuth();

    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const getBudgets = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const { data, error } = await supabase
                .from("budgets")
                .select("id, category_id, monthly_limit, categories(name, slug)");

            if (error) {
                setError("Não foi possível carregar os orçamentos");
                return;
            }

            setBudgets((data ?? []).map(mapBudget));
        } catch {
            setError("Não foi possível carregar os orçamentos");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!user) return;
        getBudgets();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id]);

    async function upsertBudget(categoryId: string, monthlyLimit: number) {
        setError("");

        try {
            const { data, error } = await supabase
                .from("budgets")
                .upsert(
                    { user_id: user?.id, category_id: categoryId, monthly_limit: monthlyLimit, updated_at: new Date().toISOString() },
                    { onConflict: "user_id,category_id" }
                )
                .select("id, category_id, monthly_limit, categories(name, slug)")
                .single();

            if (error) {
                setError("Não foi possível guardar o orçamento");
                return false;
            }

            const updated = mapBudget(data);
            setBudgets((prev) => {
                const exists = prev.some((item) => item.categoryId === categoryId);
                return exists
                    ? prev.map((item) => (item.categoryId === categoryId ? updated : item))
                    : [...prev, updated];
            });

            return true;
        } catch {
            setError("Não foi possível guardar o orçamento");
            return false;
        }
    }

    async function deleteBudget(budgetId: string) {
        setError("");

        try {
            const { error } = await supabase.from("budgets").delete().eq("id", budgetId);

            if (error) {
                setError("Não foi possível remover o orçamento");
                return false;
            }

            setBudgets((prev) => prev.filter((item) => item.id !== budgetId));
            return true;
        } catch {
            setError("Não foi possível remover o orçamento");
            return false;
        }
    }

    return { budgets, loading, error, getBudgets, upsertBudget, deleteBudget };
}

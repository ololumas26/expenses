"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import type { Goal } from "@/types/models";
import { parseServerDate } from "@/utils/date";

function mapGoal(row: any): Goal {
    return {
        id: row.id,
        name: row.name,
        targetAmount: Number(row.target_amount),
        currentAmount: Number(row.current_amount),
        deadline: row.target_date ? parseServerDate(row.target_date) : undefined,
    };
}

export function useGoals() {
    const { user } = useAuth();

    const [goals, setGoals] = useState<Goal[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const getGoals = useCallback(async () => {
        setIsLoading(true);
        setError("");

        try {
            const { data, error } = await supabase.from("goals").select("*");

            if (error) {
                setError("Não foi possível carregar as metas");
                return;
            }

            setGoals((data ?? []).map(mapGoal));
        } catch {
            setError("Não foi possível carregar as metas");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!user) return;
        getGoals();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id]);

    async function createGoal(goal: Omit<Goal, "id" | "currentAmount">) {
        setIsLoading(true);
        setError("");

        try {
            const { data, error } = await supabase
                .from("goals")
                .insert({
                    user_id: user?.id,
                    name: goal.name,
                    target_amount: goal.targetAmount,
                    current_amount: 0,
                    target_date: goal.deadline ? goal.deadline.toISOString().slice(0, 10) : null,
                })
                .select()
                .single();

            if (error) {
                setError("Não foi possível criar a meta");
                return null;
            }

            const newGoal = mapGoal(data);
            setGoals((prev) => [...prev, newGoal]);
            return newGoal;
        } catch {
            setError("Não foi possível criar a meta");
            return null;
        } finally {
            setIsLoading(false);
        }
    }

    async function addFunds(goalId: string, amount: number) {
        setError("");

        try {
            const goal = goals.find((item) => item.id === goalId);
            if (!goal) {
                setError("Meta não encontrada");
                return false;
            }

            const newAmount = goal.currentAmount + amount;

            const { data, error } = await supabase
                .from("goals")
                .update({ current_amount: newAmount, updated_at: new Date().toISOString() })
                .eq("id", goalId)
                .select()
                .single();

            if (error) {
                setError("Não foi possível adicionar o valor");
                return false;
            }

            const updatedGoal = mapGoal(data);
            setGoals((prev) => prev.map((item) => (item.id === goalId ? updatedGoal : item)));
            return true;
        } catch {
            setError("Não foi possível adicionar o valor");
            return false;
        }
    }

    async function updateGoal(goalId: string, updates: { name: string; targetAmount: number; deadline?: Date }) {
        setError("");

        try {
            const { data, error } = await supabase
                .from("goals")
                .update({
                    name: updates.name,
                    target_amount: updates.targetAmount,
                    target_date: updates.deadline ? updates.deadline.toISOString().slice(0, 10) : null,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", goalId)
                .select()
                .single();

            if (error) {
                setError("Não foi possível editar a meta");
                return false;
            }

            const updatedGoal = mapGoal(data);
            setGoals((prev) => prev.map((item) => (item.id === goalId ? updatedGoal : item)));
            return true;
        } catch {
            setError("Não foi possível editar a meta");
            return false;
        }
    }

    return { goals, getGoals, createGoal, addFunds, updateGoal, isLoading, error };
}

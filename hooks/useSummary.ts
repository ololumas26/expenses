import "server-only";
import { createClient } from "@/lib/supabase/server";

export type TotalType = {
    total_income: number;
    total_outcome: number;
    balance: number;
};

export async function getDashboardSummary(): Promise<TotalType> {
    
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("moviments_totals_view")
        .select("total_income, total_outcome, balance")
        .single();

    if (error) {
        throw new Error("Não foi possível obter os totais.", {
            cause: error,
        });
    }

    return {
        total_income: Number(data.total_income),
        total_outcome: Number(data.total_outcome),
        balance: Number(data.balance),
    };
}
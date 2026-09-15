import "server-only";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { DashboardSummary } from "@/types/dashboard";

export async function getDashboardSummary(): Promise<DashboardSummary> {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) redirect("/");


    const { data, error } = await supabase
        .from("moviments_totals_view")
        .select("*")
        .single();

    if (error) throw new Error("Não foi possível carregar o resumo da dashboard.", { cause: error });

    return {
        total_income: Number(data?.total_income ?? 0),
        total_outcome: Number(data?.total_outcome ?? 0),
        balance: Number(data?.balance ?? 0),
    };
}

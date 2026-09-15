"use client";

import { useGoals } from "@/hooks/useGoals";
import AmountSummary from "@/components/screens/AmountSummary";

export default function GoalsSummary() {
    const { goals, isLoading } = useGoals();

    const totalSaved = goals.reduce((total, goal) => total + goal.currentAmount, 0);
    const active = goals.filter((goal) => goal.currentAmount < goal.targetAmount).length;
    const done = goals.length - active;

    const subtitle = isLoading
        ? "A carregar..."
        : `${active} ${active === 1 ? "meta em progresso" : "metas em progresso"}${done > 0 ? ` · ${done} concluída${done === 1 ? "" : "s"}` : ""}`;

    return <AmountSummary title="Total reservado para metas" amount={totalSaved} subtitle={subtitle} />;
}

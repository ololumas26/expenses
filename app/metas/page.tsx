import { Suspense } from "react";
import ScreenLayout from "@/components/screens/ScreenLayout";
import GoalsSummary from "@/components/goals/GoalsSummary";
import GoalsOverview from "@/components/goals/GoalsOverview";

export default function GoalsPage() {
    return (
        <Suspense fallback={<div className="p-6 text-center text-sm text-tertiary/60">A carregar metas...</div>}>
            <ScreenLayout title="Metas" description="Acompanha o progresso dos teus objetivos.">
                <GoalsSummary />
                <GoalsOverview />
            </ScreenLayout>
        </Suspense>
    );
}
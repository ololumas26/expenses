import ScreenLayout from "@/components/screens/ScreenLayout";
import GoalsSummary from "@/components/goals/GoalsSummary";
import GoalsOverview from "@/components/goals/GoalsOverview";

export default function GoalsPage() {
    return <ScreenLayout title="Metas" description="Acompanha o progresso dos teus objetivos.">
        <GoalsSummary />
        <GoalsOverview />
    </ScreenLayout>;
}

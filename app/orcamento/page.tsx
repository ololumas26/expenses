import ScreenLayout from "@/components/screens/ScreenLayout";
import BudgetPageContent from "@/components/budget/BudgetPageContent";

export default function BudgetPage() {
    return <ScreenLayout title="Orçamento" description="Define limites mensais por categoria e acompanha os gastos.">
        <BudgetPageContent />
    </ScreenLayout>;
}

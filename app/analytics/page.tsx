import ScreenLayout from "@/components/screens/ScreenLayout";
import AnalyticsPageContent from "@/components/analytics/AnalyticsPageContent";

export default function AnalyticsPage() {
    return (
        <ScreenLayout title="Analytics" description="Compara meses, categorias e o progresso das tuas metas.">
            <AnalyticsPageContent />
        </ScreenLayout>
    );
}

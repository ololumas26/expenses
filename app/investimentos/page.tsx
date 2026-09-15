import ScreenLayout from "@/components/screens/ScreenLayout";
import InvestmentsPageContent from "@/components/investments/InvestmentsPageContent";

export default function InvestmentsPage() {
    return <ScreenLayout title="Investimentos" description="Uma visão da tua carteira e da sua distribuição.">
        <InvestmentsPageContent />
    </ScreenLayout>;
}

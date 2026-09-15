"use client";

import { PiggyBank } from "lucide-react";
import ScreenLayout from "@/components/screens/ScreenLayout";
import AccumulationScreen from "@/components/savings/AccumulationScreen";

export default function SavingsPage() {
    return <ScreenLayout title="Poupança" description="Dá espaço aos teus planos para crescer.">
        <AccumulationScreen heroLabel="Total poupado" icon={PiggyBank} categorySlug="savings" accentColor="primary" />
    </ScreenLayout>;
}

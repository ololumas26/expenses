import DashboardHeader from "@/components/dashboard/Header"
import BalanceCard from "@/components/dashboard/BalanceCard";
import QuickActions from "@/components/dashboard/QuickActions";
import { quickActions } from "@/data/app";
import EmergencyCard from "@/components/dashboard/EmergencyCard";
import MovementList from "@/components/dashboard/MovementList";

export default function DashboardPage(){
    return (
        <div className="mx-auto w-full max-w-md px-0 pb-28 md:max-w-5xl md:px-8 md:pb-16 md:pt-10">
            <DashboardHeader />
            <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="md:col-span-2">
                    <BalanceCard />
                    <QuickActions actions={quickActions} />
                    <EmergencyCard />
                    <MovementList />
                </div>
            </div>
        </div>
    )
}

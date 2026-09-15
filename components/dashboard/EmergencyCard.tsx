'use client'

import Link from "next/link";
import { PiggyBank, Plus } from "lucide-react"
import { useGoals } from "@/hooks/useGoals";
import { formatCoin } from "@/utils/coin";

const EMERGENCY_RESERVE_GOAL_NAME = "Reserva de emergência";

export default function EmergencyCard(){

    const { goals, isLoading } = useGoals()
    const goal = goals.find((item) => item.name.trim().toLowerCase() === EMERGENCY_RESERVE_GOAL_NAME.toLowerCase())

    if (isLoading) return null

    if (!goal) {
        return (
            <section className="w-full max-w-md mx-auto my-4 px-3 md:max-w-none md:px-0">
                <Link href={{ pathname: "/metas", query: { prefillName: EMERGENCY_RESERVE_GOAL_NAME } }} className="flex items-center gap-3 rounded-xl border border-dashed border-border/60 p-4 hover:bg-primary/5">
                    <span className="rounded-full bg-primary/15 p-2 text-primary"><PiggyBank size={18} aria-hidden="true" /></span>
                    <span className="flex-1">
                        <span className="block text-sm font-semibold text-tertiary">{EMERGENCY_RESERVE_GOAL_NAME}</span>
                        <span className="block text-xs text-tertiary/60">Ainda não criaste esta meta</span>
                    </span>
                    <Plus size={20} className="text-primary" aria-hidden="true" />
                </Link>
            </section>
        )
    }

    const progress = goal.targetAmount > 0 ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100)) : 0

    return (
        <section className="w-full max-w-md mx-auto my-4 px-3 md:max-w-none md:px-0">
            <div className="border border-border/60 p-4 rounded-xl">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="border border-border/60 p-2 rounded-full bg-primary/30 text-primary"><PiggyBank/></div>
                        <span className="text-sm font-medium">{goal.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-primary">{progress}%</span>
                </div>
                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-border/60">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
                </div>
                <div className="mt-3 flex justify-between text-xs text-tertiary/60">
                    <span className="font-semibold text-tertiary">{formatCoin(goal.currentAmount)}</span>
                    <span>Meta: {formatCoin(goal.targetAmount)}</span>
                </div>
            </div>
        </section>
    )
}

'use client'

import { useState } from "react";
import { Eye, EyeOff, TrendingUp } from "lucide-react";
import { formatCoin } from "@/utils/coin";
import { useTotals } from "@/context/TotalsContext";


export default function BalanceCard({ title }: { title?: string }){

    const [showBalance, setShowBalance] = useState(true)
    const { balance, balanceChange, loading } = useTotals()

    const EyeIcon = showBalance ?
     <Eye size={40} className="bg-border/30 rounded-full p-2"/>
     : <EyeOff size={40}  className="bg-border/30 rounded-full p-2"/>

    return (
        <div className="p-3 md:p-0 md:my-4">
            <div className="flex flex-col gap-3 bg-linear-to-r from-primary to-secondary via-primary p-4 md:p-6 rounded-xl text-background">
                <div className="flex items-center justify-between">
                    <h6 className="">{title ?? 'Saldo em carteira'}</h6>
                    <button onClick={() => setShowBalance((prev) => !prev)} aria-label={showBalance ? "Ocultar saldo" : "Mostrar saldo"}>
                        {EyeIcon}
                    </button>
                </div>
                <div className="">
                    <span className="text-4xl font-semibold">{
                   showBalance ? (loading ? '···' : formatCoin(balance)) : '*********'}</span>
                </div>
                <div className="flex items-center gap-2">
                    <TrendingUp size={30} className="bg-border/30 rounded-full p-2"/>
                    <span className="text-sm">
                        {balanceChange === null
                            ? 'Sem dados do mês anterior'
                            : `${balanceChange >= 0 ? '+' : ''}${balanceChange.toFixed(1).replace('.', ',')}% em relação ao mês passado`}
                    </span>
                </div>
            </div>
        </div>
    )
}

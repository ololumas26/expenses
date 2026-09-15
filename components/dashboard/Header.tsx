"use client"

import UserBudge from "../ui/UserBudge"
import { Bell } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

export default function DashboardHeader(){
    const { user } = useAuth()
    const accountName = (user?.user_metadata?.name as string | undefined)?.trim() || user?.email || "Utilizador"
    const firstName = accountName.split(" ")[0]

    return (
        <header className="flex items-center justify-between p-3 pt-5 md:px-0 md:pt-0 md:pb-6">
                <div className="p-2 md:p-0">
                    <h4 className="text-2xl font-bold md:text-3xl">Olá, {firstName}</h4>
                    <p className="text-sm text-gray-500">Faça a gestão de gastos e finanças</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="border border-border rounded-full p-1" aria-label="Notificações">
                        <Bell/>
                    </button>
                    <UserBudge username={accountName}/>
                </div>
        </header>
    )
}

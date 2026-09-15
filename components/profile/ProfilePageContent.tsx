"use client";

import { useRouter } from "next/navigation";
import { User, Bell, Lock, HelpCircle, Info, LogOut, Target, PiggyBank, HandCoins } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getInitials } from "@/utils/name";
import ProfileMenuItem from "./ProfileMenuItem";

export default function ProfilePageContent() {
    const { user, signOut } = useAuth();
    const router = useRouter();

    const accountName = (user?.user_metadata?.name as string | undefined)?.trim() || user?.email || "Utilizador";

    async function handleSignOut() {
        await signOut();
        router.replace("/login");
    }

    return (
        <div className="space-y-5">
            <section className="flex flex-col items-center gap-1 py-4 text-center">
                <span className="mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-primary text-xl font-semibold text-white">
                    {getInitials(accountName)}
                </span>
                <h2 className="text-base font-semibold text-tertiary">{accountName}</h2>
                {!!user?.email && <p className="text-sm text-tertiary/60">{user.email}</p>}
            </section>

            <section className="rounded-2xl border border-border/60 md:grid md:grid-cols-2">
                <ProfileMenuItem label="Editar perfil" icon={User} href="/perfil/editar" />
                <ProfileMenuItem label="Notificações" icon={Bell} href="/perfil/notificacoes" />
                <ProfileMenuItem label="Segurança" icon={Lock} href="/perfil/seguranca" />
                <ProfileMenuItem label="Ajuda e suporte" icon={HelpCircle} href="/perfil/ajuda" />
                <ProfileMenuItem label="Sobre a app" icon={Info} href="/perfil/sobre" isLast />
            </section>

            <section>
                <h2 className="mb-3 px-0.5 text-xs font-semibold uppercase tracking-wider text-tertiary/60">As tuas finanças</h2>
                <div className="divide-y divide-border/60 rounded-2xl border border-border/60 md:grid md:grid-cols-3 md:divide-x md:divide-y-0">
                    <ProfileMenuItem label="Metas" icon={Target} href="/metas" isLast />
                    <ProfileMenuItem label="Poupança" icon={PiggyBank} href="/poupanca" isLast />
                    <ProfileMenuItem label="Investimentos" icon={HandCoins} href="/investimentos" isLast />
                </div>
            </section>

            <section className="rounded-2xl border border-border/60">
                <ProfileMenuItem label="Terminar sessão" icon={LogOut} destructive onClick={handleSignOut} isLast />
            </section>
        </div>
    );
}

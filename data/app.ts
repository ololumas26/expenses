import {
    Home, Target, User, Receipt, PiggyBank,
    HandCoins, Plus, Euro, BarChart3,
} from "lucide-react";
import type { MenuButtonType } from "@/types/type";

// Navegação principal (barra inferior no mobile, barra lateral no desktop).
export const menuOptions: MenuButtonType[] = [
    { label: "Início", href: "/dashboard", icon: Home },
    { label: "Movimentos", href: "/movimentos", icon: Receipt },
    { label: "Novo", href: "/movimentos/novo?type=outcome", icon: Plus },
    { label: "Metas", href: "/metas", icon: Target },
    { label: "Perfil", href: "/perfil", icon: User },
];

// Atalhos na dashboard.
export const quickActions: MenuButtonType[] = [
    { label: "Poupança", href: "/poupanca", icon: PiggyBank },
    { label: "Investimento", href: "/investimentos", icon: HandCoins },
    { label: "Orçamento", href: "/orcamento", icon: Euro },
    { label: "Analytics", href: "/analytics", icon: BarChart3 },
];

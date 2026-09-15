import Link from "next/link";
import { Plus } from "lucide-react";
import ScreenLayout from "@/components/screens/ScreenLayout";
import MovementHistory from "@/components/movements/MovementHistory";

export default function MovementsPage() {
    return <ScreenLayout title="Movimentos" description="Consulta as tuas entradas e saídas." action={<Link href="/movimentos/novo?type=income" className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-2 text-xs font-semibold text-white"><Plus size={16} aria-hidden="true" />Novo</Link>}><MovementHistory /></ScreenLayout>;
}

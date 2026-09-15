import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCategories } from "@/lib/data/categories";
import MovementForm from "@/components/movements/MovementForm";
import Providers from "@/components/Providers";
import AppShell from "@/components/AppShell";

export default async function NewMovementPage({
    searchParams,
}: {
    searchParams: Promise<{ type?: string }>;
}) {
    const [{ type }, categories] = await Promise.all([searchParams, getCategories()]);

    return (
        <Providers>
            <AppShell>
                <main className="w-full max-w-md mx-auto px-4 py-6 pb-28 text-tertiary md:max-w-lg md:pb-16 md:pt-10">
                    <header className="flex items-center gap-3 mb-8">
                        <Link href="/dashboard" aria-label="Voltar à dashboard" className="rounded-full border border-border p-2 hover:bg-primary/10 focus-visible:outline-primary">
                            <ArrowLeft size={20} aria-hidden="true" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold">Novo movimento</h1>
                            <p className="text-sm text-tertiary/60">Regista uma entrada ou uma saída.</p>
                        </div>
                    </header>
                    <MovementForm categories={categories} initialType={type === "income" ? "income" : "outcome"} />
                </main>
            </AppShell>
        </Providers>
    );
}

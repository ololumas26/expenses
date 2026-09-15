import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import Providers from "@/components/Providers";
import AppShell from "@/components/AppShell";

export default function ScreenLayout({ title, description, children, action, backHref = "/dashboard" }: {
    title: string;
    description: string;
    children: ReactNode;
    action?: ReactNode;
    backHref?: string;
}) {
    return (
        <Providers>
            <AppShell>
                <main className="mx-auto w-full max-w-md px-4 pt-6 pb-32 text-tertiary md:max-w-3xl md:pb-16 md:pt-10 lg:max-w-5xl">
                    <header className="mb-6">
                        <Link href={backHref} className="mb-5 inline-flex items-center gap-2 text-sm text-tertiary/60 hover:text-primary md:hidden">
                            <ArrowLeft size={18} aria-hidden="true" /> Início
                        </Link>
                        <div className="flex items-center justify-between gap-3">
                            <h1 className="text-2xl font-bold md:text-3xl">{title}</h1>
                            {action}
                        </div>
                        <p className="mt-1 text-sm text-tertiary/60">{description}</p>
                    </header>
                    <div className="space-y-6">{children}</div>
                </main>
            </AppShell>
        </Providers>
    );
}

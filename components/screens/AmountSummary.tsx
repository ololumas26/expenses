import { formatCoin } from "@/utils/coin";

export default function AmountSummary({ title, amount, subtitle }: { title: string; amount: number; subtitle: string }) {
    return (
        <section className="rounded-2xl bg-linear-to-r from-primary to-secondary p-5 text-white">
            <h2 className="text-sm text-white/80">{title}</h2>
            <p className="mt-2 text-4xl font-semibold tracking-tight">{formatCoin(amount)}</p>
            <p className="mt-3 text-xs text-white/80">{subtitle}</p>
        </section>
    );
}

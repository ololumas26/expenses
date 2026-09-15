import { Wallet, FileText, ShieldCheck } from "lucide-react";
import ScreenLayout from "@/components/screens/ScreenLayout";

const APP_VERSION = "1.0.0";

export default function AboutPage() {
    return (
        <ScreenLayout title="Sobre a app" description="Quem somos e como usar a app com segurança." backHref="/perfil">
            <div className="max-w-lg space-y-6">
                <div className="flex flex-col items-center py-4 text-center">
                    <span className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary">
                        <Wallet size={30} aria-hidden="true" />
                    </span>
                    <h2 className="text-base font-bold text-tertiary">Remittance</h2>
                    <p className="mt-0.5 text-sm text-tertiary/60">Versão {APP_VERSION}</p>
                </div>

                <p className="text-center text-sm leading-relaxed text-tertiary/60">
                    A Remittance ajuda-te a gerir as tuas finanças pessoais: acompanha movimentos, define orçamentos, cria metas de poupança e vê os teus investimentos, tudo num só lugar.
                </p>

                <div className="rounded-2xl border border-border/60">
                    <a href="https://remittanceapp.com/termos" target="_blank" rel="noreferrer" className="flex items-center gap-3 border-b border-border/60 px-3.5 py-3.5 hover:bg-primary/5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary"><FileText size={18} aria-hidden="true" /></span>
                        <span className="text-sm font-medium text-tertiary">Termos e Condições</span>
                    </a>
                    <a href="https://remittanceapp.com/privacidade" target="_blank" rel="noreferrer" className="flex items-center gap-3 px-3.5 py-3.5 hover:bg-primary/5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary"><ShieldCheck size={18} aria-hidden="true" /></span>
                        <span className="text-sm font-medium text-tertiary">Política de Privacidade</span>
                    </a>
                </div>

                <p className="text-center text-xs text-tertiary/50">Feito com dedicação para te ajudar a gerir melhor o teu dinheiro.</p>
            </div>
        </ScreenLayout>
    );
}

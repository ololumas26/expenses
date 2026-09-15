"use client";

import { useState } from "react";
import { ChevronDown, Mail } from "lucide-react";

const FAQ = [
    {
        question: "Como registo um novo movimento?",
        answer: "No separador \"Novo\", escolhe se é uma entrada ou saída, indica o valor, a categoria e a data. O movimento fica logo refletido no teu saldo.",
    },
    {
        question: "Como crio um orçamento para uma categoria?",
        answer: "Entra em \"Orçamento\" a partir do ecrã inicial e toca no botão de adicionar. Escolhe a categoria e define o limite mensal.",
    },
    {
        question: "Os meus dados são só meus?",
        answer: "Sim. Cada conta só vê os seus próprios movimentos, metas, investimentos e orçamentos.",
    },
    {
        question: "Como altero a minha password?",
        answer: "Vai a Perfil > Segurança e define uma nova password.",
    },
];

function FaqItem({ question, answer, isLast }: { question: string; answer: string; isLast?: boolean }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className={!isLast ? "border-b border-border/60" : undefined}>
            <button type="button" onClick={() => setExpanded((prev) => !prev)} aria-expanded={expanded} className="flex w-full items-center justify-between gap-3 px-3.5 py-3.5 text-left">
                <span className="flex-1 text-sm font-medium text-tertiary">{question}</span>
                <ChevronDown size={18} className={`shrink-0 text-tertiary/40 transition-transform ${expanded ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>
            {expanded && <p className="px-3.5 pb-3.5 text-sm leading-relaxed text-tertiary/60">{answer}</p>}
        </div>
    );
}

export default function HelpContent() {
    return (
        <div className="max-w-lg space-y-6">
            <div>
                <h2 className="mb-2.5 px-0.5 text-sm font-semibold text-tertiary">Perguntas frequentes</h2>
                <div className="rounded-2xl border border-border/60">
                    {FAQ.map((item, index) => (
                        <FaqItem key={item.question} question={item.question} answer={item.answer} isLast={index === FAQ.length - 1} />
                    ))}
                </div>
            </div>

            <div>
                <h2 className="mb-2.5 px-0.5 text-sm font-semibold text-tertiary">Ainda precisas de ajuda?</h2>
                <a
                    href="mailto:suporte@remittanceapp.com?subject=Ajuda%20com%20a%20app"
                    className="flex items-center gap-3 rounded-2xl border border-border/60 p-3.5 hover:bg-primary/5"
                >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Mail size={18} aria-hidden="true" />
                    </span>
                    <span>
                        <p className="text-sm font-semibold text-tertiary">Contactar suporte</p>
                        <p className="text-xs text-tertiary/60">suporte@remittanceapp.com</p>
                    </span>
                </a>
            </div>
        </div>
    );
}

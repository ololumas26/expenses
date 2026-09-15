"use client";

import { useEffect, useState } from "react";
import { Wallet, CalendarClock, Mail, type LucideIcon } from "lucide-react";

const STORAGE_KEY = "notification_prefs";

type NotificationPrefs = {
    budgetAlerts: boolean;
    dailyReminder: boolean;
    weeklySummary: boolean;
};

const DEFAULT_PREFS: NotificationPrefs = {
    budgetAlerts: true,
    dailyReminder: false,
    weeklySummary: true,
};

function ToggleRow({ icon: Icon, label, description, value, onValueChange, isLast }: {
    icon: LucideIcon;
    label: string;
    description: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
    isLast?: boolean;
}) {
    return (
        <div className={`flex items-center justify-between gap-3 px-3.5 py-3.5 ${!isLast ? "border-b border-border/60" : ""}`}>
            <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon size={18} aria-hidden="true" />
                </span>
                <div>
                    <p className="text-sm font-medium text-tertiary">{label}</p>
                    <p className="mt-0.5 text-xs text-tertiary/60">{description}</p>
                </div>
            </div>
            <button
                type="button"
                role="switch"
                aria-checked={value}
                aria-label={label}
                onClick={() => onValueChange(!value)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${value ? "bg-primary" : "bg-border"}`}
            >
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${value ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
        </div>
    );
}

export default function NotificationsForm() {
    const [prefs, setPrefs] = useState<NotificationPrefs>(DEFAULT_PREFS);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        try {
            const stored = window.localStorage.getItem(STORAGE_KEY);
            if (stored) setPrefs({ ...DEFAULT_PREFS, ...JSON.parse(stored) });
        } catch {
            setPrefs(DEFAULT_PREFS);
        } finally {
            setLoaded(true);
        }
    }, []);

    function updatePref(key: keyof NotificationPrefs, value: boolean) {
        const next = { ...prefs, [key]: value };
        setPrefs(next);
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
            // localStorage indisponível — a preferência fica só para esta sessão
        }
    }

    if (!loaded) return null;

    return (
        <div className="max-w-md rounded-2xl border border-border/60">
            <ToggleRow
                icon={Wallet}
                label="Alertas de orçamento"
                description="Aviso quando um orçamento se aproxima do limite"
                value={prefs.budgetAlerts}
                onValueChange={(value) => updatePref("budgetAlerts", value)}
            />
            <ToggleRow
                icon={CalendarClock}
                label="Lembrete diário"
                description="Lembrete para registares os teus movimentos"
                value={prefs.dailyReminder}
                onValueChange={(value) => updatePref("dailyReminder", value)}
            />
            <ToggleRow
                icon={Mail}
                label="Resumo semanal"
                description="Resumo das tuas finanças ao fim de cada semana"
                value={prefs.weeklySummary}
                onValueChange={(value) => updatePref("weeklySummary", value)}
                isLast
            />
        </div>
    );
}

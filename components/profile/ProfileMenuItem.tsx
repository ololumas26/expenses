import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";

type ProfileMenuItemProps = {
    label: string;
    icon: LucideIcon;
    href?: string;
    onClick?: () => void;
    destructive?: boolean;
    isLast?: boolean;
};

export default function ProfileMenuItem({ label, icon: Icon, href, onClick, destructive = false, isLast = false }: ProfileMenuItemProps) {
    const contentClass = destructive ? "text-danger" : "text-tertiary";
    const badgeClass = destructive ? "bg-danger/10 text-danger" : "bg-primary/10 text-primary";
    const rowClass = `flex w-full items-center justify-between gap-3 px-3.5 py-3.5 text-left hover:bg-primary/5 ${!isLast ? "border-b border-border/60" : ""}`;

    const content = (
        <>
            <span className="flex items-center gap-3">
                <span className={`flex h-8 w-8 items-center justify-center rounded-full ${badgeClass}`}>
                    <Icon size={18} aria-hidden="true" />
                </span>
                <span className={`text-sm font-medium ${contentClass}`}>{label}</span>
            </span>
            {!destructive && <ChevronRight size={18} className="text-tertiary/30" aria-hidden="true" />}
        </>
    );

    if (href) {
        return (
            <Link href={href} className={rowClass}>
                {content}
            </Link>
        );
    }

    return (
        <button type="button" onClick={onClick} className={rowClass}>
            {content}
        </button>
    );
}

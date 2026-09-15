import { Tag } from "lucide-react";
import { DynamicIcon, iconNames, type IconName } from "lucide-react/dynamic";

const availableIcons = new Set<string>(iconNames);

export default function CategoryIcon({ slug }: { slug: string | null }) {
    if (!slug || !availableIcons.has(slug)) return <Tag size={18} aria-hidden="true" />;

    return <DynamicIcon name={slug as IconName} size={18} aria-hidden="true" />;
}

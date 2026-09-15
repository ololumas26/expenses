import { ComponentType } from "react"

export type MenuButtonType = {
    label: string,
    href: string,
    isActive? : boolean
    isAction ?: boolean
    icon?: ComponentType<{ className?: string }>;
}
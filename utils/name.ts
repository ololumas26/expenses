export function getInitials(name: string): string {
    if (!name) return "??";

    const parts = name.toUpperCase().trim().split(" ").filter(Boolean);
    if (parts.length === 0) return "??";

    return parts[0][0] + parts[parts.length - 1][0];
}

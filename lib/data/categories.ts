import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/types/movement";

export async function getCategories(): Promise<Category[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("categories")
        .select("id, name, type, slug")
        .order("name");

    if (error) {
        throw new Error("Não foi possível carregar as categorias.", { cause: error });
    }

    return (data ?? []).filter(
        (category): category is Category => category.type === "income" || category.type === "outcome"
    );
}

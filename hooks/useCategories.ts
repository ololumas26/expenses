"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Category } from "@/types/movement";

export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getCategories = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.from("categories").select("id, name, slug, type");

            if (error) {
                setError("Não foi possível carregar as categorias");
                return;
            }

            setCategories(data ?? []);
        } catch {
            setError("Não foi possível carregar as categorias");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        getCategories();
    }, [getCategories]);

    return { categories, loading, error, refetch: getCategories };
}

"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { Category } from "@/types/movement";

const CATEGORIES_CACHE_KEY = "expenses:categories";
const CATEGORIES_CACHE_TTL = 24 * 60 * 60 * 1000;

type CategoriesCache = {
    data: Category[];
    expiresAt: number;
};

export function useCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getCategories = useCallback(async () => {
        try {
            const cached = localStorage.getItem(CATEGORIES_CACHE_KEY);
            if (cached) {
                const parsed = JSON.parse(cached) as CategoriesCache;
                if (parsed.expiresAt > Date.now()) {
                    setCategories(parsed.data);
                    setLoading(false);
                    return;
                }
                localStorage.removeItem(CATEGORIES_CACHE_KEY);
            }
        } catch {
            localStorage.removeItem(CATEGORIES_CACHE_KEY);
        }

        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.from("categories").select("id, name, slug, type");

            if (error) {
                setError("Não foi possível carregar as categorias");
                return;
            }

            const categories = data ?? [];
            setCategories(categories);
            localStorage.setItem(CATEGORIES_CACHE_KEY, JSON.stringify({
                data: categories,
                expiresAt: Date.now() + CATEGORIES_CACHE_TTL,
            } satisfies CategoriesCache));
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

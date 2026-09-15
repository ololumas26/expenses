"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import type { Movement } from "@/types/models";
import type { MovementType } from "@/types/movement";
import { parseServerDate } from "@/utils/date";

function mapMoviment(row: any): Movement {
    return {
        id: row.id,
        name: row.name,
        category: row.category,
        note: row.note,
        amount: Number(row.amount),
        date: parseServerDate(row.mov_date),
        type: row.type,
    };
}

/**
 * @param type filtra por 'income' ou 'outcome'; '' devolve os dois.
 * @param pageSize quantos registos vêm por página.
 *
 * `moviments` reflete sempre apenas a página atual — usar `nextPage`/`previousPage`
 * para navegar.
 */
export function useMoviments(type: MovementType | "" = "", pageSize: number = 10) {
    const { user } = useAuth();

    const [moviments, setMoviments] = useState<Movement[]>([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [hasNextPage, setHasNextPage] = useState(true);
    const [page, setPage] = useState(0);

    const get = useCallback(
        async (from: number, to: number) => {
            let query = supabase.from("last_moviments_list_view").select("*");

            if (type === "income" || type === "outcome") {
                query = query.eq("type", type);
            }

            return query.range(from, to);
        },
        [type]
    );

    const fetchPage = useCallback(
        async (pageIndex: number) => {
            const from = pageIndex * pageSize;
            const to = from + pageSize - 1;

            setIsLoading(true);

            try {
                const { data, error } = await get(from, to);

                if (error) {
                    setError("Não foi possível carregar os movimentos");
                    return;
                }

                const mapped = (data ?? []).map(mapMoviment);

                setMoviments(mapped);
                setHasNextPage(mapped.length === pageSize);
                setPage(pageIndex);
            } catch {
                setError("Não foi possível carregar os movimentos");
            } finally {
                setIsLoading(false);
            }
        },
        [get, pageSize]
    );

    const getMoviments = useCallback(
        async (reset: boolean = true) => {
            await fetchPage(reset ? 0 : page);
        },
        [fetchPage, page]
    );

    useEffect(() => {
        if (!user) return;
        fetchPage(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id, type, pageSize]);

    async function nextPage() {
        if (isLoading || !hasNextPage) return;
        await fetchPage(page + 1);
    }

    async function previousPage() {
        if (isLoading || page === 0) return;
        await fetchPage(page - 1);
    }

    async function createMoviment(moviment: Omit<Movement, "id">) {
        setIsLoading(true);
        setError("");

        try {
            const { data, error } = await supabase
                .from("moviments")
                .insert({
                    user_id: user?.id,
                    name: moviment.name,
                    type: moviment.type,
                    category_id: moviment.category,
                    amount: moviment.amount,
                    note: moviment.note,
                    mov_date: moviment.date.toISOString(),
                })
                .select()
                .single();

            if (error) {
                setError("Não foi possível guardar o movimento");
                return null;
            }

            return data;
        } catch {
            setError("Não foi possível guardar o movimento");
            return null;
        } finally {
            setIsLoading(false);
        }
    }

    async function deleteMoviment(id: string) {
        setError("");

        try {
            const { error } = await supabase.from("moviments").delete().eq("id", id);

            if (error) {
                setError("Não foi possível remover o movimento");
                return false;
            }

            setMoviments((prev) => prev.filter((item) => item.id !== id));
            return true;
        } catch {
            setError("Não foi possível remover o movimento");
            return false;
        }
    }

    return {
        getMoviments,
        nextPage,
        previousPage,
        hasNextPage,
        hasPreviousPage: page > 0,
        page,
        createMoviment,
        deleteMoviment,
        isLoading,
        error,
        moviments,
    };
}

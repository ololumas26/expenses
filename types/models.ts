import type { MovementType } from "@/types/movement";

// `category` is overloaded, mirroring the mobile app: when a Movement comes
// from `last_moviments_list_view` it holds the category NAME (for display and
// for matching against Budget.categoryName); when building a Movement to pass
// to `createMoviment`, it holds the category ID (inserted as `category_id`).
export type Movement = {
    id?: string;
    name: string;
    category?: string;
    note?: string;
    amount: number;
    date: Date;
    type: MovementType;
};

export type Goal = {
    id: string;
    name: string;
    targetAmount: number;
    currentAmount: number;
    deadline?: Date;
};

export type Investment = {
    id: string;
    name: string;
    investedAmount: number;
};

export type Budget = {
    id: string;
    categoryId: string;
    categoryName: string;
    categorySlug: string | null;
    monthlyLimit: number;
};

export type Saving = {
    id: string;
    title: string;
    amount: number;
    date: Date;
    type: MovementType;
};

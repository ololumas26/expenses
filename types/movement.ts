export type MovementType = "income" | "outcome";

export type Category = {
    id: string;
    name: string;
    type: MovementType;
    slug: string | null;
};

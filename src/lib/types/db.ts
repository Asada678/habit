export interface Habit {
    id?: number;
    title: string;
    createdAt: Date;
    updatedAt: Date;
    archived: boolean;
}

export interface Check {
    id?: number;
    habitId: number;
    date: string; // YYYY-MM-DD
    completed: boolean;
    note?: string;
    updatedAt: Date;
}

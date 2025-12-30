import { db } from '@/lib/db';
import type { Check } from '@/lib/types/db';

export async function getChecksForMonth(year: number, month: number): Promise<Check[]> {
    const start = `${year}-${String(month).padStart(2, '0')}-01`;
    // Simple next month calc for end bound
    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;
    const end = `${nextYear}-${String(nextMonth).padStart(2, '0')}-01`;

    // Provide string range. 'date' is YYYY-MM-DD.
    return await db.checks
        .where('date')
        .between(start, end, true, false) // Include start, exclude end
        .toArray();
}

export async function toggleCheck(habitId: number, date: string): Promise<boolean> {
    return await db.transaction('rw', db.checks, async () => {
        const existing = await db.checks.where({ habitId, date }).first();
        if (existing) {
            const newStatus = !existing.completed;
            await db.checks.update(existing.id!, {
                completed: newStatus,
                updatedAt: new Date(),
            });
            return newStatus;
        }

        await db.checks.add({
            habitId,
            date,
            completed: true,
            updatedAt: new Date(),
        });
        return true;
    });
}

export async function saveNote(habitId: number, date: string, note: string): Promise<void> {
    await db.transaction('rw', db.checks, async () => {
        const existing = await db.checks.where({ habitId, date }).first();
        if (existing) {
            await db.checks.update(existing.id!, {
                note,
                updatedAt: new Date(),
            });
        } else {
            await db.checks.add({
                habitId,
                date,
                completed: false, // Note created without completion?
                note,
                updatedAt: new Date(),
            });
        }
    });
}

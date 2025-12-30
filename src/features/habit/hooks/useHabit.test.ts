import { describe, it, expect, beforeEach } from 'vitest';
import { useHabitStore } from '../store';
import { db } from '@/lib/db';
import 'fake-indexeddb/auto';

describe('useHabitStore', () => {
    beforeEach(async () => {
        // Reset DB and Store for isolation
        await db.delete();
        await db.open();
        useHabitStore.setState({ habits: [], isLoading: false, error: null });
    });

    it('should start with empty habits', () => {
        const { habits } = useHabitStore.getState();
        expect(habits).toEqual([]);
    });

    it('should add a habit and update state', async () => {
        const title = 'Drink Water';
        await useHabitStore.getState().createHabit({ title });

        const { habits } = useHabitStore.getState();
        expect(habits).toHaveLength(1);
        expect(habits[0].title).toBe(title);
        expect(habits[0].id).toBeDefined();
    });

    it('should fetch habits from DB', async () => {
        // Add directly to DB
        await db.habits.add({
            title: 'Exercise',
            createdAt: new Date(),
            updatedAt: new Date(),
            archived: false,
        });

        await useHabitStore.getState().fetchHabits();

        const { habits } = useHabitStore.getState();
        expect(habits).toHaveLength(1);
        expect(habits[0].title).toBe('Exercise');
    });

    it('should update a habit', async () => {
        await useHabitStore.getState().createHabit({ title: 'Old Title' });
        const id = useHabitStore.getState().habits[0].id!;

        await useHabitStore.getState().editHabit(id, { title: 'New Title' });

        const { habits } = useHabitStore.getState();
        expect(habits[0].title).toBe('New Title');
    });

    it('should delete a habit', async () => {
        await useHabitStore.getState().createHabit({ title: 'To Delete' });
        const id = useHabitStore.getState().habits[0].id!;

        await useHabitStore.getState().removeHabit(id);

        const { habits } = useHabitStore.getState();
        expect(habits).toHaveLength(0);
    });
});

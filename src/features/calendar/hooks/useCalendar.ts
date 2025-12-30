import { useState, useMemo, useCallback } from 'react';

export const useCalendar = (initialDate: Date = new Date()) => {
    const [currentDate, setCurrentDate] = useState(initialDate);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // 1-indexed

    const daysInMonth = useMemo(() => {
        // month is 1-indexed, so we pass month (which is next month's 0 index) to get last day of current month
        const lastDay = new Date(year, month, 0).getDate();

        return Array.from({ length: lastDay }, (_, i) => {
            // month - 1 because Date constructor uses 0-indexed months
            return new Date(year, month - 1, i + 1);
        });
    }, [year, month]);

    const nextMonth = useCallback(() => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    }, []);

    const prevMonth = useCallback(() => {
        setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    }, []);

    return {
        currentDate,
        year,
        month,
        daysInMonth,
        nextMonth,
        prevMonth,
        setDate: setCurrentDate
    };
};

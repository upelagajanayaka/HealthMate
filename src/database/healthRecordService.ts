export type HealthRecord = {
    id: number;
    date: string;
    steps: number;
    calories: number;
    water: number;
};

export type NewHealthRecord = {
    date: string;
    steps: number;
    calories: number;
    water: number;
};

import { getDatabase } from './database';

export async function addHealthRecord(
    record: NewHealthRecord
): Promise<number> {
    const db = await getDatabase();

    const result = await db.runAsync(
        `INSERT INTO health_records (date, steps, calories, water)
     VALUES (?, ?, ?, ?)`,
        record.date,
        record.steps,
        record.calories,
        record.water
    );

    return result.lastInsertRowId;


}

export async function getAllHealthRecords(): Promise<HealthRecord[]> {
    const db = await getDatabase();

    const records = await db.getAllAsync<HealthRecord>(
        `SELECT id, date, steps, calories, water
     FROM health_records
     ORDER BY date DESC, id DESC`
    );

    return records;
}

export async function updateHealthRecord(
    id: number,
    record: NewHealthRecord
): Promise<void> {
    const db = await getDatabase();

    await db.runAsync(
        `UPDATE health_records
     SET date = ?, steps = ?, calories = ?, water = ?
     WHERE id = ?`,
        record.date,
        record.steps,
        record.calories,
        record.water,
        id
    );
}

export async function deleteHealthRecord(
    id: number
): Promise<void> {
    const db = await getDatabase();

    await db.runAsync(
        'DELETE FROM health_records WHERE id = ?',
        id
    );
}

export async function getTodayHealthRecords(): Promise<HealthRecord[]> {
    const db = await getDatabase();

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const todayDate = `${year}-${month}-${day}`;

    const records = await db.getAllAsync<HealthRecord>(
        `SELECT id, date, steps, calories, water
         FROM health_records
         WHERE date = ?
         ORDER BY id DESC`,
        todayDate
    );

    return records;
}

export async function getWeeklyHealthRecords(): Promise<HealthRecord[]> {
    const db = await getDatabase();

    const today = new Date();
    const endDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );

    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 6);

    const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    const startDateString = formatDate(startDate);
    const endDateString = formatDate(endDate);

    const records = await db.getAllAsync<HealthRecord>(
        `SELECT id, date, steps, calories, water
         FROM health_records
         WHERE date >= ? AND date <= ?
         ORDER BY date ASC, id ASC`,
        startDateString,
        endDateString
    );

    return records;
}



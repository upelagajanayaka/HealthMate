import { getDatabase } from './database';

export type DailyGoals = {
    steps_goal: number;
    calories_goal: number;
    water_goal: number;
};

const DEFAULT_GOALS: DailyGoals = {
    steps_goal: 8000,
    calories_goal: 500,
    water_goal: 2000,
};

export async function getDailyGoals(): Promise<DailyGoals> {
    const db = await getDatabase();

    const goals = await db.getFirstAsync<DailyGoals>(
        `SELECT steps_goal, calories_goal, water_goal
     FROM daily_goals
     WHERE id = 1`
    );

    return goals ?? DEFAULT_GOALS;
}

export async function updateDailyGoals(
    goals: DailyGoals
): Promise<void> {
    const db = await getDatabase();

    await db.runAsync(
        `UPDATE daily_goals
     SET steps_goal = ?, calories_goal = ?, water_goal = ?
     WHERE id = 1`,
        goals.steps_goal,
        goals.calories_goal,
        goals.water_goal
    );
}

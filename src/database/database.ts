import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'healthmate.db';

type HealthMateDatabase = Awaited<
  ReturnType<typeof SQLite.openDatabaseAsync>
>;

let databasePromise: Promise<HealthMateDatabase> | null = null;

export async function getDatabase(): Promise<HealthMateDatabase> {
  if (!databasePromise) {
    databasePromise = (async () => {
      console.log('[DB] Opening a fresh database connection...');

      const db = await SQLite.openDatabaseAsync(
        DATABASE_NAME,
        { useNewConnection: true }
      );

      try {
        await db.runAsync(`
                    CREATE TABLE IF NOT EXISTS health_records (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        date TEXT NOT NULL,
                        steps INTEGER NOT NULL,
                        calories INTEGER NOT NULL,
                        water INTEGER NOT NULL
                    );
                `);
        await db.runAsync(`
    CREATE TABLE IF NOT EXISTS daily_goals (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        steps_goal INTEGER NOT NULL DEFAULT 8000,
        calories_goal INTEGER NOT NULL DEFAULT 500,
        water_goal INTEGER NOT NULL DEFAULT 2000
    );
`);

        await db.runAsync(`
    INSERT OR IGNORE INTO daily_goals
        (id, steps_goal, calories_goal, water_goal)
    VALUES (1, 8000, 500, 2000);
`);

        console.log('[DB] Database ready.');
        return db;
      } catch (error) {
        console.error('[DB] Table setup failed:', error);
        throw error;
      }
    })().catch((error) => {
      databasePromise = null;
      throw error;
    });
  }

  return databasePromise;
}

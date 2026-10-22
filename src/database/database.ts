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

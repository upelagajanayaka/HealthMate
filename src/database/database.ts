import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
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
      console.log('[DB] Database path:', db.databasePath);
      console.log('[DB] Document directory:', FileSystem.documentDirectory);
      console.log('[DB] Cache directory:', FileSystem.cacheDirectory);

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
export async function exportHealthMateDatabase(): Promise<void> {
  const db = await getDatabase();

  // Make sure recent database changes are written to the main file.
  await db.execAsync('PRAGMA wal_checkpoint(FULL);');

  const sourcePath = db.databasePath.startsWith('file://')
    ? db.databasePath
    : `file://${db.databasePath}`;
  const exportPath = `${FileSystem.cacheDirectory}${DATABASE_NAME}`;

  if (!sourcePath) {
    throw new Error('Could not locate the HealthMate database.');
  }

  await FileSystem.copyAsync({
    from: sourcePath,
    to: exportPath,
  });

  const available = await Sharing.isAvailableAsync();

  if (!available) {
    throw new Error('Sharing is not available on this device.');
  }

  await Sharing.shareAsync(exportPath, {
    mimeType: 'application/vnd.sqlite3',
    dialogTitle: 'Export HealthMate Database',
  });
}

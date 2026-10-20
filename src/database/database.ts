import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'healthmate.db';

export async function getDatabase() {
    const db = await SQLite.openDatabaseAsync(DATABASE_NAME);

    await db.runAsync(`
    CREATE TABLE IF NOT EXISTS health_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      steps INTEGER NOT NULL,
      calories INTEGER NOT NULL,
      water INTEGER NOT NULL
    );
  `);

    return db;
}

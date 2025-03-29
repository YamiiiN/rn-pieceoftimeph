import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';

let db;

export const initDatabase = async () => {
  try {
    db = await SQLite.openDatabaseAsync('auth.db');

    console.log('Database path:', FileSystem.documentDirectory + 'SQLite/auth.db');
    await db.execAsync(
      'CREATE TABLE IF NOT EXISTS tokens (id INTEGER PRIMARY KEY NOT NULL, token TEXT, userId TEXT, expiresAt INTEGER);'
    );
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

export const storeToken = async (token, userId, expiresAt) => {
  try {
    await db.runAsync(
      'INSERT OR REPLACE INTO tokens (id, token, userId, expiresAt) VALUES (1, ?, ?, ?);',
      [token, userId, expiresAt]
    );
  } catch (error) {
    console.error('Failed to store token:', error);
    throw error;
  }
};

export const getToken = async () => {
  try {
    const result = await db.getAllAsync('SELECT * FROM tokens WHERE id = 1;');
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error('Failed to retrieve token:', error);
    throw error;
  }
};

export const deleteToken = async () => {
  try {
    await db.runAsync('DELETE FROM tokens WHERE id = 1;');
  } catch (error) {
    console.error('Failed to delete token:', error);
    throw error;
  }
};

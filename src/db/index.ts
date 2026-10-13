import Dexie, { type Table } from 'dexie';
import type { Recipe } from '../types/recipe';
import { INITIAL_RECIPES } from '../data/initialRecipes';

export class RecipeDatabase extends Dexie {
  recipes!: Table<Recipe, string>;

  constructor() {
    super('RecipeBookDB');
    this.version(1).stores({
      recipes: 'id, title, category, *tags, isFavorite, createdAt, updatedAt'
    });
  }
}

export const db = new RecipeDatabase();

const LOCAL_STORAGE_BACKUP_KEY = 'recipe_book_data_v1';

// Synchronize with LocalStorage as requested by user
export async function syncToLocalStorage(): Promise<void> {
  try {
    const all = await db.recipes.toArray();
    localStorage.setItem(LOCAL_STORAGE_BACKUP_KEY, JSON.stringify(all));
  } catch (err) {
    console.warn('Failed to mirror to localStorage:', err);
  }
}

export async function initializeDatabase(): Promise<void> {
  try {
    const count = await db.recipes.count();
    if (count === 0) {
      // Check if there is data in localStorage first
      const stored = localStorage.getItem(LOCAL_STORAGE_BACKUP_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            await db.recipes.bulkAdd(parsed);
            return;
          }
        } catch {
          // ignore parsing error and fallback
        }
      }
      // Populate with initial Keep recipes
      await db.recipes.bulkAdd(INITIAL_RECIPES);
      await syncToLocalStorage();
    }
  } catch (err) {
    console.error('Database initialization error:', err);
  }
}

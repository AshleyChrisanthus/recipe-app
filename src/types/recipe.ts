export interface Ingredient {
  id: string;
  name: string;
  amount?: string;
  notes?: string;
}

export interface InstructionStep {
  id: string;
  stepNumber: number;
  text: string;
}

export interface RecipeVariation {
  id: string;
  title: string;
  description?: string;
  steps: string[];
  tips?: string[];
}

export interface Recipe {
  id: string;
  title: string;
  emoji?: string;
  category: string; // e.g., 'Curry', 'Noodles', 'Rice', 'Breakfast', 'Dessert'
  cookTimeMinutes?: number;
  servings?: number;
  ingredients: Ingredient[];
  instructions: InstructionStep[];
  notes?: string;
  variations?: RecipeVariation[];
  citations?: string[];
  tags: string[];
  isFavorite?: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface ExportData {
  version: number;
  appName: string;
  exportedAt: string;
  recipes: Recipe[];
}

import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, Moon, Sun, Palette, Database, 
  ChefHat, Filter, Bookmark 
} from 'lucide-react';
import type { Recipe } from './types/recipe';
import type { ThemeMode } from './types/theme';
import { initTheme, toggleThemeMode } from './styles/theme';
import { db, initializeDatabase, syncToLocalStorage } from './db';
import { RecipeCard } from './components/RecipeCard';
import { RecipeDetailModal } from './components/RecipeDetailModal';
import { RecipeModal } from './components/RecipeModal';
import { ThemeModal } from './components/ThemeModal';
import { DataModal } from './components/DataModal';

export const App: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  // Modals state
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isDataOpen, setIsDataOpen] = useState(false);
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [selectedRecipeDetail, setSelectedRecipeDetail] = useState<Recipe | null>(null);

  // Initialize theme and database on mount
  useEffect(() => {
    const mode = initTheme();
    setThemeMode(mode);

    const loadData = async () => {
      await initializeDatabase();
      const all = await db.recipes.reverse().sortBy('updatedAt');
      setRecipes(all);
    };

    loadData();
  }, []);

  const refreshRecipes = async () => {
    const all = await db.recipes.reverse().sortBy('updatedAt');
    setRecipes(all);
    await syncToLocalStorage();
  };

  const handleToggleTheme = () => {
    const next = toggleThemeMode();
    setThemeMode(next);
  };

  const handleSaveRecipe = async (recipe: Recipe) => {
    await db.recipes.put(recipe);
    await refreshRecipes();
    // If the saved recipe was open in details, update it
    if (selectedRecipeDetail?.id === recipe.id) {
      setSelectedRecipeDetail(recipe);
    }
  };

  const handleDeleteRecipe = async (id: string) => {
    await db.recipes.delete(id);
    await refreshRecipes();
    if (selectedRecipeDetail?.id === id) {
      setSelectedRecipeDetail(null);
    }
  };

  const handleToggleFavorite = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const target = recipes.find(r => r.id === id);
    if (!target) return;

    const updated: Recipe = {
      ...target,
      isFavorite: !target.isFavorite,
      updatedAt: Date.now()
    };
    await db.recipes.put(updated);
    await refreshRecipes();

    if (selectedRecipeDetail?.id === id) {
      setSelectedRecipeDetail(updated);
    }
  };

  // Categories list
  const categories = ['All', ...Array.from(new Set(recipes.map(r => r.category).filter(Boolean)))];

  // Filtering
  const filteredRecipes = recipes.filter(r => {
    const matchesSearch = 
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.ingredients.some(i => i.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.notes && r.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory;
    const matchesFav = onlyFavorites ? r.isFavorite : true;

    return matchesSearch && matchesCategory && matchesFav;
  });

  return (
    <div className="min-h-screen pb-16 flex flex-col">
      {/* Top Navigation Bar with Translucent Glass */}
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-[var(--card-border)] backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--accent-bg)] border border-[var(--accent)]/30 flex items-center justify-center text-[var(--accent)] shadow-sm">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-base sm:text-lg text-[var(--text-primary)] leading-tight flex items-center gap-1.5">
                GlassCook
                <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[var(--accent-bg)] text-[var(--accent)]">
                  Offline
                </span>
              </h1>
              <p className="text-xs text-[var(--text-secondary)] hidden sm:block">
                Curated recipes & smart cooking notebook
              </p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setEditingRecipe(null);
                setIsRecipeModalOpen(true);
              }}
              className="glass-btn glass-btn-primary px-3 sm:px-4 py-2 text-xs sm:text-sm shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Recipe</span>
            </button>

            <button
              onClick={() => setIsDataOpen(true)}
              title="Import / Export Data"
              className="glass-btn p-2 sm:px-3 text-xs"
            >
              <Database className="w-4 h-4 text-[var(--accent)]" />
              <span className="hidden md:inline">Data</span>
            </button>

            <button
              onClick={() => setIsThemeOpen(true)}
              title="Theme Customizer"
              className="glass-btn p-2 sm:px-3 text-xs"
            >
              <Palette className="w-4 h-4" />
              <span className="hidden md:inline">Themes</span>
            </button>

            <button
              onClick={handleToggleTheme}
              title={`Switch to ${themeMode === 'dark' ? 'Light' : 'Dark'} Mode`}
              className="glass-btn p-2"
            >
              {themeMode === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-blue-400" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 w-full flex-1 pt-6 space-y-6">
        {/* Search & Filter Bar */}
        <section className="glass-panel p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search recipes, ingredients (e.g. dal, garlic, noodles), or tags..."
                className="w-full pl-10 glass-input text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setOnlyFavorites(!onlyFavorites)}
                className={`glass-btn text-xs px-3 py-2 flex items-center gap-1.5 ${
                  onlyFavorites ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : ''
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-amber-400 text-amber-400' : ''}`} />
                <span>Favorites</span>
              </button>
            </div>
          </div>

          {/* Categories Horizontal Scroller */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs text-[var(--text-tertiary)] flex items-center gap-1 mr-1 shrink-0">
              <Filter className="w-3 h-3" /> Filter:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 transition-all ${
                  selectedCategory === cat
                    ? 'bg-[var(--accent)] text-white shadow-sm'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* Recipe Grid */}
        <section>
          {filteredRecipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => setSelectedRecipeDetail(recipe)}
                  onToggleFavorite={(e) => handleToggleFavorite(recipe.id, e)}
                />
              ))}
            </div>
          ) : (
            <div className="glass-panel p-12 text-center max-w-md mx-auto space-y-4 my-8">
              <div className="w-14 h-14 mx-auto rounded-3xl bg-[var(--bg-secondary)] border border-[var(--card-border)] flex items-center justify-center text-3xl">
                🍲
              </div>
              <div>
                <h3 className="font-bold text-lg text-[var(--text-primary)]">No recipes found</h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  {searchQuery || selectedCategory !== 'All' || onlyFavorites
                    ? 'Try adjusting your filters or search keywords.'
                    : 'Get started by creating your first recipe or importing from JSON.'}
                </p>
              </div>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setOnlyFavorites(false);
                }}
                className="glass-btn text-xs px-4 py-2"
              >
                Reset Filters
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Modals */}
      <RecipeDetailModal
        recipe={selectedRecipeDetail}
        isOpen={Boolean(selectedRecipeDetail)}
        onClose={() => setSelectedRecipeDetail(null)}
        onEdit={(recipe) => {
          setSelectedRecipeDetail(null);
          setEditingRecipe(recipe);
          setIsRecipeModalOpen(true);
        }}
        onDelete={handleDeleteRecipe}
        onToggleFavorite={(id) => handleToggleFavorite(id)}
      />

      <RecipeModal
        isOpen={isRecipeModalOpen}
        editingRecipe={editingRecipe}
        onClose={() => {
          setIsRecipeModalOpen(false);
          setEditingRecipe(null);
        }}
        onSave={handleSaveRecipe}
      />

      <ThemeModal
        isOpen={isThemeOpen}
        onClose={() => setIsThemeOpen(false)}
        currentMode={themeMode}
        onToggleMode={handleToggleTheme}
      />

      <DataModal
        isOpen={isDataOpen}
        onClose={() => setIsDataOpen(false)}
        recipes={recipes}
        onDataImported={refreshRecipes}
      />
    </div>
  );
};

export default App;

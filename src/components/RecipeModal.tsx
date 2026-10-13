import React, { useState } from 'react';
import { X, Plus, Trash2, Clock, Users, Tag, Sparkles } from 'lucide-react';
import type { Recipe, Ingredient, InstructionStep, RecipeVariation } from '../types/recipe';

interface RecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (recipe: Recipe) => void;
  editingRecipe?: Recipe | null;
}

const CATEGORIES = ['Curry', 'Noodles', 'Rice', 'Breakfast', 'Soup & Salad', 'Snacks', 'Dessert', 'Other'];
const COMMON_EMOJIS = ['🍳', '🍲', '🍜', '🍚', '🍗', '🌾', '🥗', '🥘', '🍝', '🥩', '🥟', '🥪', '🍰'];

export const RecipeModal: React.FC<RecipeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingRecipe
}) => {
  const [title, setTitle] = useState(editingRecipe?.title || '');
  const [emoji, setEmoji] = useState(editingRecipe?.emoji || '🍳');
  const [category, setCategory] = useState(editingRecipe?.category || 'Curry');
  const [cookTime, setCookTime] = useState<number | undefined>(editingRecipe?.cookTimeMinutes || 20);
  const [servings, setServings] = useState<number | undefined>(editingRecipe?.servings || 2);
  const [notes, setNotes] = useState(editingRecipe?.notes || '');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(editingRecipe?.tags || []);
  const [citationsInput, setCitationsInput] = useState((editingRecipe?.citations || []).join('\n'));

  // Ingredients state
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    editingRecipe?.ingredients || [
      { id: '1', name: '', amount: '', notes: '' }
    ]
  );

  // Instructions state
  const [instructions, setInstructions] = useState<InstructionStep[]>(
    editingRecipe?.instructions || [
      { id: '1', stepNumber: 1, text: '' }
    ]
  );

  // Variations state
  const [variations, setVariations] = useState<RecipeVariation[]>(
    editingRecipe?.variations || []
  );

  // Update form if editingRecipe changes
  React.useEffect(() => {
    if (editingRecipe) {
      setTitle(editingRecipe.title);
      setEmoji(editingRecipe.emoji || '🍳');
      setCategory(editingRecipe.category);
      setCookTime(editingRecipe.cookTimeMinutes);
      setServings(editingRecipe.servings);
      setNotes(editingRecipe.notes || '');
      setTags(editingRecipe.tags || []);
      setIngredients(editingRecipe.ingredients.length > 0 ? editingRecipe.ingredients : [{ id: '1', name: '', amount: '', notes: '' }]);
      setInstructions(editingRecipe.instructions.length > 0 ? editingRecipe.instructions : [{ id: '1', stepNumber: 1, text: '' }]);
      setVariations(editingRecipe.variations || []);
      setCitationsInput((editingRecipe.citations || []).join('\n'));
    } else {
      setTitle('');
      setEmoji('🍳');
      setCategory('Curry');
      setCookTime(20);
      setServings(2);
      setNotes('');
      setTags([]);
      setIngredients([{ id: '1', name: '', amount: '', notes: '' }]);
      setInstructions([{ id: '1', stepNumber: 1, text: '' }]);
      setVariations([]);
      setCitationsInput('');
    }
  }, [editingRecipe, isOpen]);

  if (!isOpen) return null;

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { id: Date.now().toString(), name: '', amount: '', notes: '' }]);
  };

  const handleRemoveIngredient = (id: string) => {
    setIngredients(ingredients.filter(ing => ing.id !== id));
  };

  const handleUpdateIngredient = (id: string, field: keyof Ingredient, value: string) => {
    setIngredients(ingredients.map(ing => ing.id === id ? { ...ing, [field]: value } : ing));
  };

  const handleAddInstruction = () => {
    setInstructions([
      ...instructions,
      { id: Date.now().toString(), stepNumber: instructions.length + 1, text: '' }
    ]);
  };

  const handleRemoveInstruction = (id: string) => {
    const filtered = instructions.filter(ins => ins.id !== id);
    setInstructions(filtered.map((item, idx) => ({ ...item, stepNumber: idx + 1 })));
  };

  const handleUpdateInstruction = (id: string, text: string) => {
    setInstructions(instructions.map(ins => ins.id === id ? { ...ins, text } : ins));
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = tagInput.trim().replace(/^,/, '');
      if (trimmed && !tags.includes(trimmed)) {
        setTags([...tags, trimmed]);
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleAddVariation = () => {
    setVariations([
      ...variations,
      {
        id: Date.now().toString(),
        title: 'New Method / Variation',
        steps: [''],
        tips: []
      }
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const validIngredients = ingredients.filter(i => i.name.trim() !== '');
    const validInstructions = instructions
      .filter(ins => ins.text.trim() !== '')
      .map((ins, idx) => ({ ...ins, stepNumber: idx + 1 }));

    const parsedCitations = citationsInput
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('http'));

    const now = Date.now();
    const recipeToSave: Recipe = {
      id: editingRecipe ? editingRecipe.id : `recipe_${now}_${Math.random().toString(36).substring(2, 7)}`,
      title: title.trim(),
      emoji,
      category,
      cookTimeMinutes: cookTime,
      servings,
      ingredients: validIngredients,
      instructions: validInstructions,
      notes: notes.trim(),
      variations: variations.filter(v => v.title.trim() !== ''),
      citations: parsedCitations,
      tags,
      isFavorite: editingRecipe ? editingRecipe.isFavorite : false,
      createdAt: editingRecipe ? editingRecipe.createdAt : now,
      updatedAt: now
    };

    onSave(recipeToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="glass-modal w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl relative overflow-hidden"
        role="dialog"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--card-border)] bg-[var(--card-bg)]/80 backdrop-blur">
          <div className="flex items-center gap-3">
            <span className="text-2xl p-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--card-border)]">{emoji}</span>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">
                {editingRecipe ? 'Edit Recipe' : 'Add New Recipe'}
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">Organize ingredients, steps and variations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-5 sm:p-6 space-y-6 flex-1">
          {/* Main Info */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
            <div className="sm:col-span-8">
              <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
                Recipe Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Mushroom Stir-Fry Noodles"
                className="w-full glass-input text-base font-medium"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full glass-input"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat} className="bg-[var(--bg-secondary)] text-[var(--text-primary)]">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Emoji selector */}
          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
              Choose Icon / Emoji
            </label>
            <div className="flex flex-wrap gap-2">
              {COMMON_EMOJIS.map((e) => (
                <button
                  type="button"
                  key={e}
                  onClick={() => setEmoji(e)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all ${
                    emoji === e ? 'bg-[var(--accent)] text-white scale-110 shadow-md ring-2 ring-[var(--accent)]/30' : 'bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)]'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Stats: Time & Servings */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
                <Clock className="w-3.5 h-3.5" /> Prep/Cook Time (Mins)
              </label>
              <input
                type="number"
                min="0"
                value={cookTime ?? ''}
                onChange={(e) => setCookTime(e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="e.g. 20"
                className="w-full glass-input"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
                <Users className="w-3.5 h-3.5" /> Servings
              </label>
              <input
                type="number"
                min="1"
                value={servings ?? ''}
                onChange={(e) => setServings(e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="e.g. 2"
                className="w-full glass-input"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
              <Tag className="w-3.5 h-3.5" /> Tags (Press Enter to add)
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[var(--tag-bg)] text-[var(--tag-text)] border border-[var(--border-light)]"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-red-500 transition-colors ml-0.5"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="e.g. Quick, Vegetarian, One-Pot..."
              className="w-full glass-input text-sm"
            />
          </div>

          {/* Ingredients Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                Ingredients List
              </label>
              <button
                type="button"
                onClick={handleAddIngredient}
                className="glass-btn text-xs py-1 px-2.5"
              >
                <Plus className="w-3.5 h-3.5" /> Add Ingredient
              </button>
            </div>

            <div className="space-y-2">
              {ingredients.map((ing, idx) => (
                <div key={ing.id} className="flex items-center gap-2">
                  <span className="text-xs text-[var(--text-tertiary)] w-5 text-right">{idx + 1}.</span>
                  <input
                    type="text"
                    value={ing.amount || ''}
                    onChange={(e) => handleUpdateIngredient(ing.id, 'amount', e.target.value)}
                    placeholder="Amount (e.g. 2 cups)"
                    className="w-32 glass-input text-sm py-1.5"
                  />
                  <input
                    type="text"
                    value={ing.name}
                    onChange={(e) => handleUpdateIngredient(ing.id, 'name', e.target.value)}
                    placeholder="Ingredient Name (e.g. Rice)"
                    className="flex-1 glass-input text-sm py-1.5"
                  />
                  <input
                    type="text"
                    value={ing.notes || ''}
                    onChange={(e) => handleUpdateIngredient(ing.id, 'notes', e.target.value)}
                    placeholder="Notes (optional, e.g. soaked)"
                    className="w-36 glass-input text-sm py-1.5 hidden sm:block"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(ing.id)}
                    disabled={ingredients.length <= 1}
                    className="p-2 text-[var(--text-tertiary)] hover:text-red-400 disabled:opacity-30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                Cooking Steps / Instructions
              </label>
              <button
                type="button"
                onClick={handleAddInstruction}
                className="glass-btn text-xs py-1 px-2.5"
              >
                <Plus className="w-3.5 h-3.5" /> Add Step
              </button>
            </div>

            <div className="space-y-2.5">
              {instructions.map((ins) => (
                <div key={ins.id} className="flex items-start gap-2">
                  <span className="font-semibold text-xs text-[var(--accent)] bg-[var(--accent-bg)] w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-1">
                    {ins.stepNumber}
                  </span>
                  <textarea
                    rows={2}
                    value={ins.text}
                    onChange={(e) => handleUpdateInstruction(ins.id, e.target.value)}
                    placeholder="Describe this step..."
                    className="flex-1 glass-input text-sm resize-none py-1.5"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveInstruction(ins.id)}
                    disabled={instructions.length <= 1}
                    className="p-2 text-[var(--text-tertiary)] hover:text-red-400 disabled:opacity-30 transition-colors mt-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Variations Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Variations & Methods (Optional)
                </label>
                <p className="text-xs text-[var(--text-secondary)]">e.g. Scrambled Eggs method or vegan alternatives</p>
              </div>
              <button
                type="button"
                onClick={handleAddVariation}
                className="glass-btn text-xs py-1 px-2.5"
              >
                <Plus className="w-3.5 h-3.5" /> Add Method
              </button>
            </div>

            {variations.map((v, vIdx) => (
              <div key={v.id} className="p-3.5 rounded-xl border border-[var(--card-border)] bg-[var(--bg-secondary)]/50 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={v.title}
                    onChange={(e) => {
                      const updated = [...variations];
                      updated[vIdx].title = e.target.value;
                      setVariations(updated);
                    }}
                    placeholder="Variation title (e.g. Scrambled Eggs Method)"
                    className="glass-input text-sm font-semibold flex-1 py-1"
                  />
                  <button
                    type="button"
                    onClick={() => setVariations(variations.filter(item => item.id !== v.id))}
                    className="p-1.5 text-[var(--text-tertiary)] hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={v.steps.join('\n')}
                  onChange={(e) => {
                    const updated = [...variations];
                    updated[vIdx].steps = e.target.value.split('\n');
                    setVariations(updated);
                  }}
                  placeholder="Steps for this variation (one per line)..."
                  className="w-full glass-input text-xs py-1.5"
                />
              </div>
            ))}
          </div>

          {/* Notes & Citations */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
                Notes & Chef Tips
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special hints, serving recommendations or storage advice..."
                className="w-full glass-input text-sm resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-1.5">
                Source Links / Citations (one URL per line)
              </label>
              <textarea
                rows={2}
                value={citationsInput}
                onChange={(e) => setCitationsInput(e.target.value)}
                placeholder="https://greenbowl2soul.com/...&#10;https://budgetbytes.com/..."
                className="w-full glass-input text-xs font-mono resize-none"
              />
            </div>
          </div>

          {/* Footer Submit */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--card-border)]">
            <button
              type="button"
              onClick={onClose}
              className="glass-btn px-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="glass-btn glass-btn-primary px-6"
            >
              {editingRecipe ? 'Save Changes' : 'Create Recipe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

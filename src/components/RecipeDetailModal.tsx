import React, { useState } from 'react';
import { 
  X, Clock, Users, Bookmark, BookmarkCheck, Edit3, Trash2, 
  ExternalLink, Sparkles, CheckCircle2, ChevronRight, Share2 
} from 'lucide-react';
import type { Recipe } from '../types/recipe';

interface RecipeDetailModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (recipe: Recipe) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({
  recipe,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onToggleFavorite
}) => {
  const [activeVariationTab, setActiveVariationTab] = useState<number | null>(null);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  const [copiedAlert, setCopiedAlert] = useState(false);

  React.useEffect(() => {
    setCheckedIngredients({});
    setActiveVariationTab(null);
  }, [recipe?.id]);

  if (!isOpen || !recipe) return null;

  const toggleIngredientCheck = (id: string) => {
    setCheckedIngredients(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleShare = () => {
    const text = `${recipe.title} ${recipe.emoji || ''}\n\nIngredients:\n` +
      recipe.ingredients.map(i => `- ${i.amount ? i.amount + ' ' : ''}${i.name}`).join('\n') +
      `\n\nInstructions:\n` +
      recipe.instructions.map(ins => `${ins.stepNumber}. ${ins.text}`).join('\n');
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedAlert(true);
      setTimeout(() => setCopiedAlert(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="glass-modal w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl relative overflow-hidden"
        role="dialog"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[var(--card-border)] bg-[var(--card-bg)]/80 backdrop-blur">
          <div className="flex items-center gap-3.5">
            <div className="text-3xl p-2.5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--card-border)] shadow-sm">
              {recipe.emoji || '🍽️'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[var(--tag-bg)] text-[var(--tag-text)]">
                  {recipe.category}
                </span>
                {recipe.tags?.map(t => (
                  <span key={t} className="text-xs text-[var(--text-secondary)] hidden sm:inline">
                    #{t}
                  </span>
                ))}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mt-1">
                {recipe.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => onToggleFavorite(recipe.id)}
              title={recipe.isFavorite ? 'Remove Favorite' : 'Mark Favorite'}
              className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-amber-400 hover:bg-[var(--bg-hover)] transition-colors"
            >
              {recipe.isFavorite ? (
                <BookmarkCheck className="w-5 h-5 text-amber-400 fill-amber-400" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={handleShare}
              title="Copy to clipboard"
              className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => onEdit(recipe)}
              title="Edit Recipe"
              className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--bg-hover)] transition-colors"
            >
              <Edit3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                if (window.confirm(`Delete "${recipe.title}"?`)) {
                  onDelete(recipe.id);
                  onClose();
                }
              }}
              title="Delete Recipe"
              className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--danger)] hover:bg-[var(--bg-hover)] transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Copy Alert Banner */}
        {copiedAlert && (
          <div className="bg-[var(--accent)] text-white text-xs py-1.5 px-4 text-center font-medium transition-all animate-in slide-in-from-top">
            Recipe copied to clipboard!
          </div>
        )}

        {/* Content Body */}
        <div className="overflow-y-auto p-5 sm:p-7 space-y-7 flex-1">
          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center gap-3">
            {recipe.cookTimeMinutes && (
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--card-border)] text-xs text-[var(--text-primary)] font-medium">
                <Clock className="w-4 h-4 text-[var(--accent)]" />
                <span>{recipe.cookTimeMinutes} mins cook</span>
              </div>
            )}
            {recipe.servings && (
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--card-border)] text-xs text-[var(--text-primary)] font-medium">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Serves {recipe.servings} people</span>
              </div>
            )}
            <div className="text-xs text-[var(--text-tertiary)] ml-auto">
              Updated {new Date(recipe.updatedAt).toLocaleDateString()}
            </div>
          </div>

          {/* Notes Card */}
          {recipe.notes && (
            <div className="p-4 rounded-2xl bg-[var(--accent-bg)]/40 border border-[var(--accent)]/20 text-sm leading-relaxed text-[var(--text-primary)]">
              <span className="font-semibold text-[var(--accent)] block text-xs uppercase tracking-wider mb-1">Cook's Note</span>
              {recipe.notes}
            </div>
          )}

          {/* Ingredients Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                Ingredients <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--bg-secondary)] text-[var(--text-secondary)] font-normal">{recipe.ingredients.length} items</span>
              </h3>
              <span className="text-xs text-[var(--text-tertiary)]">Click to check off while cooking</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {recipe.ingredients.map((ing) => {
                const isChecked = checkedIngredients[ing.id];
                return (
                  <div
                    key={ing.id}
                    onClick={() => toggleIngredientCheck(ing.id)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isChecked
                        ? 'bg-[var(--bg-secondary)]/30 border-dashed border-[var(--border-light)] opacity-50'
                        : 'bg-[var(--card-bg)] border-[var(--card-border)] hover:border-[var(--accent)]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-4 h-4 rounded-md flex items-center justify-center border transition-colors ${
                        isChecked ? 'bg-[var(--accent)] border-[var(--accent)] text-white' : 'border-[var(--text-tertiary)]'
                      }`}>
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                      <div>
                        <span className={`text-sm font-medium ${isChecked ? 'line-through text-[var(--text-secondary)]' : 'text-[var(--text-primary)]'}`}>
                          {ing.name}
                        </span>
                        {ing.notes && (
                          <span className="block text-xs text-[var(--text-tertiary)]">{ing.notes}</span>
                        )}
                      </div>
                    </div>
                    {ing.amount && (
                      <span className="text-xs font-semibold px-2 py-1 rounded-lg bg-[var(--bg-secondary)] text-[var(--accent)] shrink-0 ml-2">
                        {ing.amount}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Instructions Step-by-Step */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              Step-by-Step Instructions
            </h3>

            <div className="space-y-3">
              {recipe.instructions.map((ins) => (
                <div
                  key={ins.id}
                  className="p-3.5 sm:p-4 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] flex items-start gap-3.5 hover:border-[var(--border)] transition-colors"
                >
                  <div className="w-7 h-7 rounded-xl bg-[var(--accent-bg)] text-[var(--accent)] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    {ins.stepNumber}
                  </div>
                  <div className="flex-1 text-sm sm:text-base leading-relaxed text-[var(--text-primary)]">
                    {ins.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recipe Variations */}
          {recipe.variations && recipe.variations.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-base font-bold text-[var(--text-primary)]">
                  Variations & Alternative Methods
                </h3>
              </div>

              {/* Variation Tabs */}
              <div className="flex flex-wrap gap-2">
                {recipe.variations.map((v, idx) => (
                  <button
                    key={v.id}
                    onClick={() => setActiveVariationTab(activeVariationTab === idx ? null : idx)}
                    className={`glass-btn text-xs px-3 py-1.5 ${
                      activeVariationTab === idx
                        ? 'bg-[var(--accent)] border-[var(--accent)] text-white'
                        : ''
                    }`}
                  >
                    <span>{v.title}</span>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${activeVariationTab === idx ? 'rotate-90' : ''}`} />
                  </button>
                ))}
              </div>

              {activeVariationTab !== null && recipe.variations[activeVariationTab] && (
                <div className="p-4 rounded-2xl bg-[var(--bg-secondary)]/80 border border-[var(--card-border)] space-y-3 animate-in fade-in duration-150">
                  <h4 className="font-semibold text-sm text-[var(--text-primary)]">
                    {recipe.variations[activeVariationTab].title}
                  </h4>
                  {recipe.variations[activeVariationTab].description && (
                    <p className="text-xs text-[var(--text-secondary)]">
                      {recipe.variations[activeVariationTab].description}
                    </p>
                  )}
                  <ul className="space-y-2 text-xs sm:text-sm text-[var(--text-primary)]">
                    {recipe.variations[activeVariationTab].steps.map((s, sIdx) => (
                      <li key={sIdx} className="flex items-start gap-2">
                        <span className="text-[var(--accent)] font-bold">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                  {recipe.variations[activeVariationTab].tips && recipe.variations[activeVariationTab].tips!.length > 0 && (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 space-y-1">
                      <span className="font-semibold block">Chef Tips:</span>
                      {recipe.variations[activeVariationTab].tips!.map((tip, tIdx) => (
                        <p key={tIdx}>- {tip}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Citations & Web Sources */}
          {recipe.citations && recipe.citations.length > 0 && (
            <div className="pt-2 border-t border-[var(--card-border)]">
              <span className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
                Recipe Citations & Web Sources
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {recipe.citations.map((cite, cIdx) => (
                  <a
                    key={cIdx}
                    href={cite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--card-border)] text-xs text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all truncate group"
                  >
                    <span className="truncate">{cite.replace(/^https?:\/\//, '')}</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

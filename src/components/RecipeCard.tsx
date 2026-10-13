import React from 'react';
import { Clock, Users, Bookmark, BookmarkCheck, ArrowRight, Tag } from 'lucide-react';
import type { Recipe } from '../types/recipe';

interface RecipeCardProps {
  recipe: Recipe;
  onClick: () => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({
  recipe,
  onClick,
  onToggleFavorite
}) => {
  return (
    <div
      onClick={onClick}
      className="glass-card p-5 cursor-pointer flex flex-col justify-between group relative overflow-hidden transition-all duration-300 hover:scale-[1.01]"
    >
      <div>
        {/* Top bar with category & favorite */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--tag-bg)] text-[var(--tag-text)] border border-[var(--border-light)]">
            {recipe.category}
          </span>
          <button
            onClick={onToggleFavorite}
            className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-amber-400 hover:bg-[var(--bg-hover)] transition-colors"
            title={recipe.isFavorite ? 'Remove Favorite' : 'Save as Favorite'}
          >
            {recipe.isFavorite ? (
              <BookmarkCheck className="w-4 h-4 text-amber-400 fill-amber-400" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Title and Icon */}
        <div className="flex items-start gap-3 mb-2.5">
          <div className="text-2xl p-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--card-border)] shrink-0 group-hover:scale-110 transition-transform">
            {recipe.emoji || '🍲'}
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors line-clamp-1">
              {recipe.title}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mt-0.5">
              {recipe.ingredients.length} ingredients • {recipe.instructions.length} steps
            </p>
          </div>
        </div>

        {/* Notes preview if any */}
        {recipe.notes && (
          <p className="text-xs text-[var(--text-secondary)] line-clamp-2 italic mb-3">
            "{recipe.notes}"
          </p>
        )}

        {/* Tags */}
        {recipe.tags && recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {recipe.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-0.5 text-[11px] px-2 py-0.5 rounded-md bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--card-border)]"
              >
                <Tag className="w-2.5 h-2.5 text-[var(--text-tertiary)]" />
                {tag}
              </span>
            ))}
            {recipe.tags.length > 3 && (
              <span className="text-[11px] px-1.5 py-0.5 rounded-md text-[var(--text-tertiary)]">
                +{recipe.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-[var(--card-border)] flex items-center justify-between text-xs text-[var(--text-secondary)]">
        <div className="flex items-center gap-3">
          {recipe.cookTimeMinutes && (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[var(--accent)]" />
              {recipe.cookTimeMinutes}m
            </span>
          )}
          {recipe.servings && (
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              {recipe.servings} serving{recipe.servings > 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 font-semibold text-[var(--accent)] opacity-80 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
          <span>View</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};

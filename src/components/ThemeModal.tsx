import React from 'react';
import { X, Check, RotateCcw, Palette, Moon, Sun } from 'lucide-react';
import type { ThemeMode } from '../types/theme';
import {
  THEME_PRESETS,
  ACTIVE_PRESET_KEY,
  CUSTOM_THEME_KEY,
  applyPresetPaletteForMode,
  getActivePreset
} from '../styles/theme';

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMode: ThemeMode;
  onToggleMode: () => void;
}

export const ThemeModal: React.FC<ThemeModalProps> = ({
  isOpen,
  onClose,
  currentMode,
  onToggleMode
}) => {
  const [activePresetId, setActivePresetId] = React.useState<string>(() => {
    return getActivePreset().id;
  });

  if (!isOpen) return null;

  const handleSelectPreset = (presetId: string) => {
    setActivePresetId(presetId);
    localStorage.setItem(ACTIVE_PRESET_KEY, presetId);
    localStorage.removeItem(CUSTOM_THEME_KEY);
    applyPresetPaletteForMode(currentMode);
  };

  const handleResetToDefault = () => {
    setActivePresetId('default');
    localStorage.setItem(ACTIVE_PRESET_KEY, 'default');
    localStorage.removeItem(CUSTOM_THEME_KEY);
    applyPresetPaletteForMode(currentMode);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="glass-modal w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--card-border)] mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[var(--accent-bg)] text-[var(--accent)]">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Theme & Glass Settings</h2>
              <p className="text-xs text-[var(--text-secondary)]">Customise visual appearance, glass effects and presets</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Mode Toggle */}
        <div className="flex items-center justify-between p-4 mb-6 rounded-2xl glass-card">
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Color Appearance</h3>
            <p className="text-xs text-[var(--text-secondary)]">Currently set to {currentMode} mode</p>
          </div>
          <button
            onClick={onToggleMode}
            className="glass-btn flex items-center gap-2 px-4 py-2"
          >
            {currentMode === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Switch to Light</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-blue-400" />
                <span>Switch to Dark</span>
              </>
            )}
          </button>
        </div>

        {/* Presets Grid */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-secondary)]">
              Apple Glass Presets ({THEME_PRESETS.length})
            </h3>
            <button
              onClick={handleResetToDefault}
              className="text-xs flex items-center gap-1.5 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {THEME_PRESETS.map((preset) => {
              const isSelected = activePresetId === preset.id;
              const swatches = preset.swatches[currentMode] || preset.swatches.dark;

              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset.id)}
                  className={`text-left p-3.5 rounded-2xl transition-all relative border flex flex-col justify-between ${
                    isSelected
                      ? 'border-[var(--accent)] bg-[var(--accent-bg)] shadow-md ring-2 ring-[var(--accent)]/30'
                      : 'border-[var(--card-border)] bg-[var(--card-bg)] hover:bg-[var(--bg-hover)]'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold text-sm text-[var(--text-primary)] flex items-center gap-1.5">
                        {preset.name}
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-[var(--accent)]"></span>
                        )}
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] line-clamp-1 mt-0.5">{preset.desc}</p>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-[var(--accent)] text-white flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>

                  {/* Swatches Preview */}
                  <div className="flex items-center gap-1.5 mt-2">
                    {swatches.map((color, idx) => (
                      <div
                        key={idx}
                        className="w-5 h-5 rounded-full border border-black/10 shadow-inner"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t border-[var(--card-border)]">
          <button
            onClick={onClose}
            className="glass-btn glass-btn-primary px-6"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

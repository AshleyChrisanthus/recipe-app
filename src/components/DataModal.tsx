import React, { useRef, useState } from 'react';
import { X, Download, Upload, Database, Check, AlertCircle, FileText } from 'lucide-react';
import type { Recipe, ExportData } from '../types/recipe';
import { db, syncToLocalStorage } from '../db';

interface DataModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipes: Recipe[];
  onDataImported: () => void;
}

export const DataModal: React.FC<DataModalProps> = ({
  isOpen,
  onClose,
  recipes,
  onDataImported
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  if (!isOpen) return null;

  const handleExportJSON = () => {
    try {
      const exportPayload: ExportData = {
        version: 1,
        appName: 'GlassRecipeBook',
        exportedAt: new Date().toISOString(),
        recipes: recipes
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `recipes_backup_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setStatusMessage({ text: `Successfully exported ${recipes.length} recipes to JSON file!`, type: 'success' });
    } catch (err) {
      console.error(err);
      setStatusMessage({ text: 'Failed to export recipes.', type: 'error' });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);

        let incomingRecipes: Recipe[] = [];

        if (Array.isArray(parsed)) {
          incomingRecipes = parsed;
        } else if (parsed && Array.isArray(parsed.recipes)) {
          incomingRecipes = parsed.recipes;
        } else {
          throw new Error('Invalid format. JSON must be a list of recipes or contain a "recipes" key.');
        }

        if (incomingRecipes.length === 0) {
          throw new Error('No recipes found in file.');
        }

        // Put into Dexie
        await db.recipes.bulkPut(incomingRecipes);
        await syncToLocalStorage();
        onDataImported();
        setStatusMessage({ text: `Successfully imported ${incomingRecipes.length} recipes!`, type: 'success' });
      } catch (err: any) {
        console.error(err);
        setStatusMessage({ text: err.message || 'Error parsing imported JSON file.', type: 'error' });
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };

    reader.readAsText(file);
  };

  const handleCopyLocalStorage = () => {
    const data = localStorage.getItem('recipe_book_data_v1') || '[]';
    navigator.clipboard.writeText(data);
    setStatusMessage({ text: 'Local storage JSON copied to clipboard!', type: 'success' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="glass-modal w-full max-w-lg p-6 shadow-2xl relative"
        role="dialog"
      >
        <div className="flex items-center justify-between pb-4 border-b border-[var(--card-border)] mb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[var(--accent-bg)] text-[var(--accent)]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Export & Import Data</h2>
              <p className="text-xs text-[var(--text-secondary)]">Backup, transfer or sync with browser storage</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {statusMessage && (
          <div className={`p-3.5 rounded-xl text-xs font-medium mb-5 flex items-center gap-2 border ${
            statusMessage.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
          }`}>
            {statusMessage.type === 'success' ? <Check className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <div className="space-y-4">
          {/* Export card */}
          <div className="p-4 rounded-2xl glass-card border border-[var(--card-border)] flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
                <Download className="w-4 h-4 text-[var(--accent)]" /> Export to JSON
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Save all {recipes.length} recipes to a standalone `.json` file
              </p>
            </div>
            <button
              onClick={handleExportJSON}
              className="glass-btn glass-btn-primary text-xs py-2 px-3.5"
            >
              Export JSON
            </button>
          </div>

          {/* Import card */}
          <div className="p-4 rounded-2xl glass-card border border-[var(--card-border)] flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-400" /> Import from JSON
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Load recipes from an existing backup JSON file
              </p>
            </div>
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileUpload}
                className="hidden"
                id="recipe-json-upload"
              />
              <label
                htmlFor="recipe-json-upload"
                className="glass-btn text-xs py-2 px-3.5 cursor-pointer inline-flex items-center gap-1.5"
              >
                Choose File
              </label>
            </div>
          </div>

          {/* LocalStorage sync status */}
          <div className="p-4 rounded-2xl bg-[var(--bg-secondary)]/70 border border-[var(--card-border)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-400" /> Offline / Local Storage
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Active & Synced
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Your recipes are saved offline in IndexedDB (Dexie) and mirrored in browser `localStorage`. No server connection is required.
            </p>
            <div className="pt-1">
              <button
                onClick={handleCopyLocalStorage}
                className="text-xs text-[var(--accent)] hover:underline flex items-center gap-1"
              >
                Copy raw LocalStorage JSON
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-5 border-t border-[var(--card-border)] mt-6">
          <button
            onClick={onClose}
            className="glass-btn px-6"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useRef, useState } from 'react';
import { ProjectState, CanvasItem, GridSlot, GridGroup } from '../../types/dota';
import {
  DOTA_HEROES,
  HEROES_BY_ID,
  ICON_LIBRARY,
  SYMBOL_CATEGORIES,
  DOTA_ASCII_PRESETS,
  FONT_OPTIONS,
  getHeroImageUrl,
  ATTR_COLORS
} from '../../data/dotaHeroes';
import { createDefaultMainGrid, createDefaultBanGrid, createCustomHeroBox } from '../../utils/gridUtils';
import {
  DOTA_SYMBOLS,
  DOTA_SYMBOL_CATEGORY_META,
  DotaSymbolCategory,
  analyzeDotaText,
  cleanKnownUnsupportedSymbols
} from '../../data/dotaSymbols';
import {
  Sliders,
  Grid,
  ShieldAlert,
  Type,
  Square,
  Sparkles,
  RotateCw,
  Eye,
  Trash2,
  Lock,
  Plus,
  Box,
  Layers,
  CheckCircle2,
  FileCode,
  Copy,
  Move,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

const DOTA_FAVORITES_STORAGE_KEY = 'dota-grid-studio:dota-symbol-favorites';
const DOTA_RECENTS_STORAGE_KEY = 'dota-grid-studio:dota-symbol-recents';

function loadStoredDotaSymbols(key: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) || '[]');
    return Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === 'string').slice(0, 12) : [];
  } catch {
    return [];
  }
}

function persistDotaSymbols(key: string, values: string[]) {
  try {
    window.localStorage.setItem(key, JSON.stringify(values));
  } catch {
    // localStorage can be unavailable in private browsing; the picker still works for this session.
  }
}

interface PropertiesPanelProps {
  project: ProjectState;
  onUpdateProject: (updater: (prev: ProjectState) => ProjectState) => void;
  selectedItemIds: string[];
  selectedSlotInfo: { gridId: string; slotId: string } | null;
  onAddCanvasItem: (item: CanvasItem) => void;
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  project,
  onUpdateProject,
  selectedItemIds,
  selectedSlotInfo,
  onAddCanvasItem
}) => {
  const [activeTab, setActiveTab] = useState<'properties' | 'grid' | 'symbols'>('symbols');
  const [selectedSymbolCategory, setSelectedSymbolCategory] = useState<string>('all');
  const [selectedDotaSymbolCategory, setSelectedDotaSymbolCategory] = useState<DotaSymbolCategory | 'all'>('all');
  const [dotaSafeOnly, setDotaSafeOnly] = useState(false);
  const [favoriteDotaSymbols, setFavoriteDotaSymbols] = useState<string[]>(() => loadStoredDotaSymbols(DOTA_FAVORITES_STORAGE_KEY));
  const [recentDotaSymbols, setRecentDotaSymbols] = useState<string[]>(() => loadStoredDotaSymbols(DOTA_RECENTS_STORAGE_KEY));
  const categoryNameInputRef = useRef<HTMLInputElement>(null);

  // Custom text generator state
  const [customBannerText, setCustomBannerText] = useState('S-TIER HEROES');
  const [bannerStyle, setBannerStyle] = useState<'stars' | 'box' | 'swords' | 'brackets' | 'double'>('stars');

  // Find active single selected item
  const selectedItem = selectedItemIds.length === 1 ? project.items.find((i) => i.id === selectedItemIds[0]) : null;

  // Find active selected slot
  const selectedSlot = selectedSlotInfo
    ? project.grids.find((g) => g.id === selectedSlotInfo.gridId)?.slots.find((s) => s.id === selectedSlotInfo.slotId)
    : null;

  const mainGrid = project.grids[0] || null;
  const banGrid = project.grids.find((g) => g.isBanGrid) || null;

  // Grid generator form state
  const [gridCols, setGridCols] = useState(mainGrid?.cols || 35);
  const [gridRows, setGridRows] = useState(mainGrid?.rows || 7);
  const [slotWidth, setSlotWidth] = useState(mainGrid?.slotWidth || 48);
  const [slotHeight, setSlotHeight] = useState(mainGrid?.slotHeight || 30);
  const [gapX, setGapX] = useState(mainGrid?.gapX || 4);
  const [gapY, setGapY] = useState(mainGrid?.gapY || 4);
  const [banCount, setBanCount] = useState(banGrid?.slots.length || 10);

  const categoryNameValue = selectedItem?.dotaCategoryName || selectedItem?.text || selectedItem?.name || '';
  const categoryAnalysis = analyzeDotaText(categoryNameValue);
  const visibleDotaSymbols = DOTA_SYMBOLS.filter((entry) =>
    (selectedDotaSymbolCategory === 'all' || entry.category === selectedDotaSymbolCategory) &&
    (!dotaSafeOnly || entry.compatibility === 'verified')
  );
  const favoriteDotaSymbolEntries = DOTA_SYMBOLS.filter((entry) => favoriteDotaSymbols.includes(entry.symbol));
  const recentDotaSymbolEntries = recentDotaSymbols
    .map((symbol) => DOTA_SYMBOLS.find((entry) => entry.symbol === symbol))
    .filter((entry): entry is typeof DOTA_SYMBOLS[number] => !!entry);

  const handleRegenerateMainGrid = () => {
    const newMain = createDefaultMainGrid(
      project.canvasWidth,
      project.canvasHeight,
      gridCols,
      gridRows,
      slotWidth,
      slotHeight,
      gapX,
      gapY
    );

    onUpdateProject((prev) => {
      const restGrids = prev.grids.filter((g) => g.id !== newMain.id && !g.isBanGrid);
      const bans = prev.grids.find((g) => g.isBanGrid) || createDefaultBanGrid(prev.canvasWidth, prev.canvasHeight, banCount);
      return {
        ...prev,
        grids: [newMain, bans, ...restGrids]
      };
    });
  };

  const handleRegenerateBans = () => {
    const newBan = createDefaultBanGrid(project.canvasWidth, project.canvasHeight, banCount, 52, 34, 6);
    onUpdateProject((prev) => {
      const filtered = prev.grids.filter((g) => !g.isBanGrid);
      return {
        ...prev,
        grids: [...filtered, newBan]
      };
    });
  };

  const rememberDotaSymbol = (symbol: string) => {
    const nextRecents = [symbol, ...recentDotaSymbols.filter((value) => value !== symbol)].slice(0, 12);
    setRecentDotaSymbols(nextRecents);
    persistDotaSymbols(DOTA_RECENTS_STORAGE_KEY, nextRecents);
  };

  const toggleDotaFavorite = (symbol: string) => {
    const nextFavorites = favoriteDotaSymbols.includes(symbol)
      ? favoriteDotaSymbols.filter((value) => value !== symbol)
      : [symbol, ...favoriteDotaSymbols].slice(0, 24);
    setFavoriteDotaSymbols(nextFavorites);
    persistDotaSymbols(DOTA_FAVORITES_STORAGE_KEY, nextFavorites);
  };

  const handleInsertDotaSymbol = (symbol: string) => {
    if (!selectedItem) return;
    const input = categoryNameInputRef.current;
    const start = input?.selectionStart ?? categoryNameValue.length;
    const end = input?.selectionEnd ?? categoryNameValue.length;
    const nextValue = categoryNameValue.slice(0, start) + symbol + categoryNameValue.slice(end);
    handleUpdateSelectedItem({ dotaCategoryName: nextValue });
    rememberDotaSymbol(symbol);

    window.requestAnimationFrame(() => {
      input?.focus();
      const nextCursorPosition = start + symbol.length;
      input?.setSelectionRange(nextCursorPosition, nextCursorPosition);
    });
  };

  const handleCleanUnsupportedDotaSymbols = () => {
    if (!selectedItem) return;
    const cleanedValue = cleanKnownUnsupportedSymbols(categoryNameValue);
    if (cleanedValue !== categoryNameValue) {
      handleUpdateSelectedItem({ dotaCategoryName: cleanedValue });
    }
  };

  const handleAddSymbol = (symbolChar: string, name: string) => {
    const newItem: CanvasItem = {
      id: 'icon_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      name: `Symbol ${symbolChar}`,
      type: 'icon',
      x: Math.round(project.canvasWidth / 2 - 24),
      y: Math.round(project.canvasHeight / 2 - 24),
      width: 48,
      height: 48,
      rotation: 0,
      opacity: 1,
      locked: false,
      visible: true,
      zIndex: project.items.length + 10,
      iconChar: symbolChar,
      fontSize: 32,
      textColor: '#F59E0B',
      textGlow: 'rgba(245, 158, 11, 0.4)',
      textGlowBlur: 10,
      exportToDota: true,
      dotaCategoryName: symbolChar
    };
    onAddCanvasItem(newItem);
  };

  const handleUncoupleGridToFreeHeroes = (grid: GridGroup) => {
    const occupiedSlots = grid.slots.filter((s) => s.heroId !== null);
    if (occupiedSlots.length === 0) return;

    const newHeroItems: CanvasItem[] = occupiedSlots.map((slot) => {
      const hero = HEROES_BY_ID.get(slot.heroId!);
      return {
        id: `hero_${slot.heroId}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        name: hero?.displayName || `Hero #${slot.heroId}`,
        type: 'hero',
        x: slot.x,
        y: slot.y,
        width: slot.width,
        height: slot.height,
        rotation: 0,
        opacity: 1,
        locked: false,
        visible: true,
        zIndex: project.items.length + 10,
        heroId: slot.heroId!,
        fill: '#0E1420',
        stroke: '#38BDF8',
        strokeWidth: 1,
        borderRadius: grid.slotBorderRadius || 4,
        exportToDota: true
      };
    });

    onUpdateProject((prev) => ({
      ...prev,
      grids: prev.grids.filter((g) => g.id !== grid.id),
      items: [...prev.items, ...newHeroItems]
    }));
  };

  const handleAddStraightLine = (style: 'double' | 'single' | 'heavy') => {
    const chars = style === 'double' ? '═══════════════════════════════' : style === 'heavy' ? '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━' : '───────────────────────────────';
    const newItem: CanvasItem = {
      id: 'line_' + Date.now(),
      name: `Stick (${style})`,
      type: 'line',
      x: Math.round(project.canvasWidth / 2 - 300),
      y: Math.round(project.canvasHeight / 2),
      width: 600,
      height: 24,
      rotation: 0,
      opacity: 1,
      locked: false,
      visible: true,
      zIndex: project.items.length + 10,
      text: chars,
      fontSize: 18,
      fontFamily: 'monospace',
      fontWeight: 'bold',
      textAlign: 'center',
      textColor: '#F59E0B',
      textGlow: 'rgba(245, 158, 11, 0.4)',
      textGlowBlur: 8,
      stroke: '#F59E0B',
      strokeWidth: 2,
      exportToDota: true,
      dotaCategoryName: chars
    };
    onAddCanvasItem(newItem);
  };

  const handleAddFreeHeroCard = (heroId: number) => {
    const hero = HEROES_BY_ID.get(heroId);
    const newItem: CanvasItem = {
      id: `hero_card_${heroId}_${Date.now()}`,
      name: hero?.displayName || `Hero #${heroId}`,
      type: 'hero',
      x: Math.round(project.canvasWidth / 2 - 27),
      y: Math.round(project.canvasHeight / 2 - 38),
      width: 54,
      height: 76,
      rotation: 0,
      opacity: 1,
      locked: false,
      visible: true,
      zIndex: project.items.length + 10,
      heroId,
      fill: '#0E1420',
      stroke: '#38BDF8',
      strokeWidth: 1,
      borderRadius: 4,
      exportToDota: true
    };
    onAddCanvasItem(newItem);
  };

  const handleAddAsciiPreset = (preset: typeof DOTA_ASCII_PRESETS[0]) => {
    const newItem: CanvasItem = {
      id: 'ascii_' + Date.now() + '_' + preset.id,
      name: preset.name,
      type: 'text',
      x: 960 - Math.round(preset.width / 2),
      y: 540 - Math.round(preset.height / 2),
      width: preset.width,
      height: preset.height,
      rotation: 0,
      opacity: 1,
      locked: false,
      visible: true,
      zIndex: project.items.length + 10,
      text: preset.text,
      fontSize: 18,
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
      fontWeight: 'bold',
      textAlign: 'center',
      textColor: '#F59E0B',
      textGlow: 'rgba(245, 158, 11, 0.35)',
      textGlowBlur: 8,
      exportToDota: true,
      dotaCategoryName: preset.text
    };
    onAddCanvasItem(newItem);
  };

  const handleCreateCustomBanner = () => {
    let formattedText = customBannerText.trim();
    if (bannerStyle === 'stars') {
      formattedText = `★ ★ ${formattedText.toUpperCase()} ★ ★`;
    } else if (bannerStyle === 'box') {
      formattedText = `┌─── ${formattedText.toUpperCase()} ───┐`;
    } else if (bannerStyle === 'double') {
      formattedText = `╔═══ ${formattedText.toUpperCase()} ═══╗`;
    } else if (bannerStyle === 'swords') {
      formattedText = `⚔ ── ${formattedText.toUpperCase()} ── ⚔`;
    } else if (bannerStyle === 'brackets') {
      formattedText = `[ ★ ${formattedText.toUpperCase()} ★ ]`;
    }

    const newItem: CanvasItem = {
      id: 'banner_' + Date.now(),
      name: `Banner: ${customBannerText}`,
      type: 'text',
      x: 960 - 250,
      y: 540 - 25,
      width: 500,
      height: 50,
      rotation: 0,
      opacity: 1,
      locked: false,
      visible: true,
      zIndex: project.items.length + 10,
      text: formattedText,
      fontSize: 20,
      fontFamily: 'Cinzel, Georgia, serif',
      fontWeight: 'bold',
      textAlign: 'center',
      textColor: '#F59E0B',
      textGlow: 'rgba(245, 158, 11, 0.5)',
      textGlowBlur: 12,
      exportToDota: true,
      dotaCategoryName: formattedText
    };
    onAddCanvasItem(newItem);
  };

  const handleConvertRectToHeroBox = (rectItem: CanvasItem) => {
    const cols = Math.max(1, Math.round(rectItem.width / 52));
    const rows = Math.max(1, Math.round(rectItem.height / 34));
    
    const newBox = createCustomHeroBox(
      rectItem.x,
      rectItem.y,
      cols,
      rows,
      48,
      30,
      4,
      4,
      rectItem.dotaCategoryName || rectItem.name || 'Hero Box'
    );

    onUpdateProject((prev) => ({
      ...prev,
      items: prev.items.filter((it) => it.id !== rectItem.id),
      grids: [...prev.grids, newBox]
    }));
  };

  const handleUpdateSelectedItem = (updates: Partial<CanvasItem>) => {
    if (!selectedItem) return;
    onUpdateProject((prev) => ({
      ...prev,
      items: prev.items.map((it) => (it.id === selectedItem.id ? { ...it, ...updates } : it))
    }));
  };

  const handleUpdateSelectedSlot = (updates: Partial<GridSlot>) => {
    if (!selectedSlotInfo) return;
    onUpdateProject((prev) => ({
      ...prev,
      grids: prev.grids.map((grid) => {
        if (grid.id === selectedSlotInfo.gridId) {
          return {
            ...grid,
            slots: grid.slots.map((s) => (s.id === selectedSlotInfo.slotId ? { ...s, ...updates } : s))
          };
        }
        return grid;
      })
    }));
  };

  return (
    <div className="flex flex-col h-full select-none font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Sub Tabs */}
      <div className="px-2 pt-2 border-b border-[#1E293B] flex gap-1 bg-[#0B0E15]">
        <button
          onClick={() => setActiveTab('symbols')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-t border-t border-x transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'symbols'
              ? 'bg-[#0E121A] text-[#F59E0B] border-[#2B3A52] border-b-transparent shadow-sm'
              : 'bg-transparent text-[#64748B] border-transparent hover:text-[#E2E8F0]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Символы & Дота</span>
        </button>

        <button
          onClick={() => setActiveTab('grid')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-t border-t border-x transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'grid'
              ? 'bg-[#0E121A] text-[#F59E0B] border-[#2B3A52] border-b-transparent shadow-sm'
              : 'bg-transparent text-[#64748B] border-transparent hover:text-[#E2E8F0]'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          <span>35×7 Grid</span>
        </button>

        <button
          onClick={() => setActiveTab('properties')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-t border-t border-x transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'properties'
              ? 'bg-[#0E121A] text-[#F59E0B] border-[#2B3A52] border-b-transparent shadow-sm'
              : 'bg-transparent text-[#64748B] border-transparent hover:text-[#E2E8F0]'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Properties</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3.5 custom-scrollbar bg-[#0E121A]">
        {/* SYMBOLS & DOTA ASCII TAB */}
        {activeTab === 'symbols' && (
          <>
            {/* Custom Banner Generator for Dota 2 */}
            <div className="bg-[#121824] border border-[#202B3D] rounded-lg p-3 space-y-2.5 shadow-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#F59E0B] flex items-center gap-1.5 font-['Cinzel']">
                  <FileCode className="w-3.5 h-3.5" />
                  ПЛАШКА / РАМКА ДЛЯ ДОТЫ
                </span>
                <span className="text-[9px] font-bold text-[#38BDF8] px-1.5 py-0.5 rounded bg-[#38BDF8]/10 border border-[#38BDF8]/30">
                  DOTA 2 JSON
                </span>
              </div>

              <div>
                <label className="text-[10px] text-[#94A3B8] block mb-1">Текст категории в Доте</label>
                <input
                  type="text"
                  value={customBannerText}
                  onChange={(e) => setCustomBannerText(e.target.value)}
                  placeholder="Например: PRIORITY PICKS"
                  className="w-full bg-[#0E121A] border border-[#202B3D] focus:border-[#F59E0B] text-xs text-white px-2 py-1 rounded outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-1 text-[10px]">
                <button
                  onClick={() => setBannerStyle('stars')}
                  className={`p-1 rounded border text-center truncate ${
                    bannerStyle === 'stars'
                      ? 'bg-[#F59E0B]/20 border-[#F59E0B] text-[#F59E0B]'
                      : 'bg-[#0E121A] border-[#202B3D] text-[#94A3B8]'
                  }`}
                >
                  ★ Звёзды ★
                </button>
                <button
                  onClick={() => setBannerStyle('box')}
                  className={`p-1 rounded border text-center truncate ${
                    bannerStyle === 'box'
                      ? 'bg-[#F59E0B]/20 border-[#F59E0B] text-[#F59E0B]'
                      : 'bg-[#0E121A] border-[#202B3D] text-[#94A3B8]'
                  }`}
                >
                  ┌ Рамка ┐
                </button>
                <button
                  onClick={() => setBannerStyle('double')}
                  className={`p-1 rounded border text-center truncate ${
                    bannerStyle === 'double'
                      ? 'bg-[#F59E0B]/20 border-[#F59E0B] text-[#F59E0B]'
                      : 'bg-[#0E121A] border-[#202B3D] text-[#94A3B8]'
                  }`}
                >
                  ╔ Двойная ╗
                </button>
                <button
                  onClick={() => setBannerStyle('swords')}
                  className={`p-1 rounded border text-center truncate ${
                    bannerStyle === 'swords'
                      ? 'bg-[#F59E0B]/20 border-[#F59E0B] text-[#F59E0B]'
                      : 'bg-[#0E121A] border-[#202B3D] text-[#94A3B8]'
                  }`}
                >
                  ⚔ Мечи ⚔
                </button>
                <button
                  onClick={() => setBannerStyle('brackets')}
                  className={`p-1 rounded border text-center truncate ${
                    bannerStyle === 'brackets'
                      ? 'bg-[#F59E0B]/20 border-[#F59E0B] text-[#F59E0B]'
                      : 'bg-[#0E121A] border-[#202B3D] text-[#94A3B8]'
                  }`}
                >
                  [ Скобки ]
                </button>
              </div>

              <button
                onClick={handleCreateCustomBanner}
                className="w-full py-1.5 bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:from-[#FBBF24] hover:to-[#E5A93C] text-black font-bold text-xs rounded transition-all flex items-center justify-center gap-1.5 shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Добавить плашку на холст</span>
              </button>
            </div>

            {/* Ready-to-use ASCII Templates & Sticks */}
            <div className="bg-[#121824] border border-[#202B3D] rounded-lg p-3 space-y-2.5">
              <span className="text-xs font-bold text-[#E2E8F0] block font-['Cinzel']">
                ПАЛОЧКИ И РАЗДЕЛИТЕЛИ ДЛЯ ДОТЫ
              </span>
              <p className="text-[11px] text-[#94A3B8]">
                Нажмите для создания линии/палочки на холсте (100% отображаются в Dota 2):
              </p>

              <div className="grid grid-cols-3 gap-1.5 pt-1">
                <button
                  onClick={() => handleAddStraightLine('double')}
                  className="p-2 bg-[#0E121A] hover:bg-[#1A2333] border border-[#202B3D] hover:border-[#F59E0B] rounded text-center transition-colors group"
                >
                  <span className="block text-[11px] font-bold text-[#E2E8F0] group-hover:text-[#F59E0B]">Двойная ══</span>
                  <span className="block font-mono text-[10px] text-[#F59E0B]/80 truncate">═════════</span>
                </button>
                <button
                  onClick={() => handleAddStraightLine('single')}
                  className="p-2 bg-[#0E121A] hover:bg-[#1A2333] border border-[#202B3D] hover:border-[#F59E0B] rounded text-center transition-colors group"
                >
                  <span className="block text-[11px] font-bold text-[#E2E8F0] group-hover:text-[#F59E0B]">Тонкая ──</span>
                  <span className="block font-mono text-[10px] text-[#CBD5E1]/80 truncate">─────────</span>
                </button>
                <button
                  onClick={() => handleAddStraightLine('heavy')}
                  className="p-2 bg-[#0E121A] hover:bg-[#1A2333] border border-[#202B3D] hover:border-[#F59E0B] rounded text-center transition-colors group"
                >
                  <span className="block text-[11px] font-bold text-[#E2E8F0] group-hover:text-[#F59E0B]">Толстая ━━</span>
                  <span className="block font-mono text-[10px] text-[#F59E0B]/80 truncate">━━━━━━━━━</span>
                </button>
              </div>

              <span className="text-[11px] font-bold text-[#CBD5E1] block pt-2">
                Шаблоны рамок и колонок:
              </span>
              <div className="space-y-1.5">
                {DOTA_ASCII_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => handleAddAsciiPreset(preset)}
                    className="w-full p-2 bg-[#0E121A] hover:bg-[#1A2333] border border-[#202B3D] hover:border-[#F59E0B] rounded-lg text-left transition-all flex items-center justify-between group"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-bold text-[#E2E8F0] block group-hover:text-[#F59E0B] transition-colors truncate">
                        {preset.name}
                      </span>
                      <span className="font-mono text-[11px] text-[#F59E0B]/90 block truncate mt-0.5">
                        {preset.preview.split('\n')[0]}
                      </span>
                    </div>
                    <Plus className="w-4 h-4 text-[#94A3B8] group-hover:text-[#F59E0B] shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>

            {/* Symbols Palette with Tabs */}
            <div className="bg-[#121824] border border-[#202B3D] rounded-lg p-3 space-y-2.5">
              <span className="text-xs font-bold text-[#F59E0B] block font-['Cinzel']">
                ПАЛИТРА СИМВОЛОВ (ПАЛОЧКИ, ЗВЕЗДЫ, БЛОКИ)
              </span>

              {/* Category selector */}
              <div className="flex gap-1 overflow-x-auto pb-1 custom-scrollbar text-[10px]">
                <button
                  onClick={() => setSelectedSymbolCategory('all')}
                  className={`px-2 py-1 rounded whitespace-nowrap ${
                    selectedSymbolCategory === 'all'
                      ? 'bg-[#F59E0B] text-black font-bold'
                      : 'bg-[#0E121A] text-[#94A3B8] hover:text-white'
                  }`}
                >
                  Все
                </button>
                {Object.entries(SYMBOL_CATEGORIES).map(([key, cat]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedSymbolCategory(key)}
                    className={`px-2 py-1 rounded whitespace-nowrap ${
                      selectedSymbolCategory === key
                        ? 'bg-[#F59E0B] text-black font-bold'
                        : 'bg-[#0E121A] text-[#94A3B8] hover:text-white'
                    }`}
                  >
                    {cat.name.split(' ')[0]}
                  </button>
                ))}
              </div>

              {/* Symbol Buttons Grid */}
              <div className="grid grid-cols-6 gap-1.5 max-h-60 overflow-y-auto custom-scrollbar p-1 bg-[#0E121A] rounded border border-[#202B3D]">
                {Object.entries(SYMBOL_CATEGORIES)
                  .filter(([key]) => selectedSymbolCategory === 'all' || selectedSymbolCategory === key)
                  .flatMap(([, cat]) => cat.symbols)
                  .map((sym, idx) => (
                    <button
                      key={sym.char + idx}
                      onClick={() => handleAddSymbol(sym.char, sym.name)}
                      title={`${sym.name} (${sym.char})`}
                      className="h-10 flex items-center justify-center bg-[#121824] hover:bg-[#1E293B] border border-[#202B3D] hover:border-[#F59E0B] rounded text-lg text-white hover:text-[#F59E0B] transition-all group active:scale-95"
                    >
                      <span className="group-hover:scale-125 transition-transform">{sym.char}</span>
                    </button>
                  ))}
              </div>
            </div>
          </>
        )}

        {/* GRID CONFIGURATION TAB */}
        {activeTab === 'grid' && (
          <>
            {/* 35x7 Main Grid Generator */}
            <div className="bg-[#121824] border border-[#202B3D] rounded-lg p-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#F59E0B] flex items-center gap-1.5 font-['Cinzel']">
                  <Grid className="w-3.5 h-3.5" />
                  HERO GRID GENERATOR
                </span>
                <span className="text-[10px] font-mono text-[#94A3B8] px-1.5 py-0.5 rounded bg-[#161F30] border border-[#2B3A52]">
                  {gridCols * gridRows} SLOTS
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-[#94A3B8] block mb-1">Columns</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={gridCols}
                    onChange={(e) => setGridCols(parseInt(e.target.value) || 35)}
                    className="w-full bg-[#0E121A] border border-[#202B3D] focus:border-[#F59E0B] text-xs text-white px-2 py-1 rounded outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#94A3B8] block mb-1">Rows</label>
                  <input
                    type="number"
                    min={1}
                    max={25}
                    value={gridRows}
                    onChange={(e) => setGridRows(parseInt(e.target.value) || 7)}
                    className="w-full bg-[#0E121A] border border-[#202B3D] focus:border-[#F59E0B] text-xs text-white px-2 py-1 rounded outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-[#94A3B8] block mb-1">Slot Width (px)</label>
                  <input
                    type="number"
                    min={20}
                    max={120}
                    value={slotWidth}
                    onChange={(e) => setSlotWidth(parseInt(e.target.value) || 48)}
                    className="w-full bg-[#0E121A] border border-[#202B3D] focus:border-[#F59E0B] text-xs text-white px-2 py-1 rounded outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#94A3B8] block mb-1">Slot Height (px)</label>
                  <input
                    type="number"
                    min={15}
                    max={80}
                    value={slotHeight}
                    onChange={(e) => setSlotHeight(parseInt(e.target.value) || 30)}
                    className="w-full bg-[#0E121A] border border-[#202B3D] focus:border-[#F59E0B] text-xs text-white px-2 py-1 rounded outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-[#94A3B8] block mb-1">Gap X (px)</label>
                  <input
                    type="number"
                    min={0}
                    max={30}
                    value={gapX}
                    onChange={(e) => setGapX(parseInt(e.target.value) || 4)}
                    className="w-full bg-[#0E121A] border border-[#202B3D] focus:border-[#F59E0B] text-xs text-white px-2 py-1 rounded outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#94A3B8] block mb-1">Gap Y (px)</label>
                  <input
                    type="number"
                    min={0}
                    max={30}
                    value={gapY}
                    onChange={(e) => setGapY(parseInt(e.target.value) || 4)}
                    className="w-full bg-[#0E121A] border border-[#202B3D] focus:border-[#F59E0B] text-xs text-white px-2 py-1 rounded outline-none"
                  />
                </div>
              </div>

              <button
                onClick={handleRegenerateMainGrid}
                className="w-full py-2 bg-gradient-to-r from-[#F59E0B] to-[#D97706] hover:from-[#FBBF24] hover:to-[#E5A93C] text-black font-bold text-xs rounded shadow-md shadow-amber-950/40 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Применить сетку {gridCols}×{gridRows} ({gridCols * gridRows} слотов)</span>
              </button>
            </div>

            {/* Freeform Movement / Uncouple Columns */}
            {mainGrid && (
              <div className="bg-[#121824] border border-[#38BDF8]/40 rounded-lg p-3 space-y-2.5 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#38BDF8] flex items-center gap-1.5 font-['Cinzel']">
                    <Sparkles className="w-3.5 h-3.5" />
                    СВОБОДНОЕ ПЕРЕМЕЩЕНИЕ (FREEFORM)
                  </span>
                </div>
                <p className="text-[11px] text-[#94A3B8]">
                  Уберите привязку столбцов и строк: сетка превратится в отдельные карточки героев, которые можно свободно переносить в любую точку холста, двигать группами и дублировать.
                </p>
                <button
                  onClick={() => handleUncoupleGridToFreeHeroes(mainGrid)}
                  className="w-full py-2 bg-[#0E1A29] hover:bg-[#15273F] border border-[#38BDF8]/50 text-[#38BDF8] font-bold text-xs rounded transition-all flex items-center justify-center gap-2 shadow"
                >
                  <Move className="w-4 h-4" />
                  <span>Убрать привязку: Разбить сетку на свободные карточки</span>
                </button>
              </div>
            )}

            {/* Ban Slots Generator */}
            <div className="bg-[#121824] border border-[#202B3D] rounded-lg p-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-400 flex items-center gap-1.5 font-['Cinzel']">
                  <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                  SEPARATE BAN SLOTS
                </span>
                <span className="text-[10px] font-mono text-red-400 px-1.5 py-0.5 rounded bg-red-950/50 border border-red-800/50">
                  {banCount} BANS
                </span>
              </div>

              <div>
                <label className="text-[10px] text-[#94A3B8] block mb-1">Number of Ban Slots</label>
                <input
                  type="number"
                  min={0}
                  max={20}
                  value={banCount}
                  onChange={(e) => setBanCount(parseInt(e.target.value) || 10)}
                  className="w-full bg-[#0E121A] border border-[#202B3D] focus:border-red-400 text-xs text-white px-2 py-1 rounded outline-none"
                />
              </div>

              <button
                onClick={handleRegenerateBans}
                className="w-full py-1.5 bg-[#2E1215] hover:bg-[#3D181D] text-[#FCA5A5] border border-[#7F1D1D] font-semibold text-xs rounded transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Re-create {banCount} Ban Slots</span>
              </button>
            </div>
          </>
        )}

        {/* PROPERTIES TAB */}
        {activeTab === 'properties' && (
          <>
            {/* Slot Inspector if a slot is selected */}
            {selectedSlot && (
              <div className="bg-[#121824] border border-[#F59E0B]/60 rounded-lg p-3 space-y-2.5 shadow-lg shadow-amber-950/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F59E0B]">
                    SELECTED SLOT ({selectedSlot.isBan ? 'BAN' : 'HERO'})
                  </span>
                  <span className="text-[10px] font-mono text-[#94A3B8]">
                    Col {selectedSlot.col + 1}, Row {selectedSlot.row + 1}
                  </span>
                </div>

                {selectedSlot.heroId ? (
                  <div className="flex items-center gap-2 bg-[#0E121A] p-2 rounded border border-[#202B3D]">
                    {(() => {
                      const h = HEROES_BY_ID.get(selectedSlot.heroId);
                      if (!h) return null;
                      const attr = ATTR_COLORS[h.primaryAttr];
                      return (
                        <>
                          <img
                            src={getHeroImageUrl(h.shortName)}
                            alt={h.displayName}
                            className="w-12 h-8 object-cover rounded border border-[#334155]"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="block text-xs font-bold text-white truncate">
                              {h.displayName}
                            </span>
                            <span className="block text-[10px]" style={{ color: attr.text }}>
                              {attr.name} • {h.roles.slice(0, 2).join(', ')}
                            </span>
                          </div>
                          <button
                            onClick={() => handleUpdateSelectedSlot({ heroId: null })}
                            title="Remove Hero from Slot"
                            className="p-1 hover:bg-red-950/40 text-red-400 rounded"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="text-[11px] text-[#94A3B8] bg-[#0E121A] p-2.5 rounded border border-[#202B3D] text-center">
                    Slot is empty. Click any hero from the left roster or drag into this slot.
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <label className="text-[11px] text-[#CBD5E1]">Ban Slot State</label>
                  <input
                    type="checkbox"
                    checked={!!selectedSlot.isBan}
                    onChange={(e) => handleUpdateSelectedSlot({ isBan: e.target.checked })}
                    className="accent-red-500 rounded"
                  />
                </div>
              </div>
            )}

            {/* Selected Canvas Item Inspector */}
            {selectedItem ? (
              <div className="bg-[#121824] border border-[#2B3A52] rounded-lg p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#38BDF8]">ITEM PROPERTIES</span>
                  <span className="text-[10px] font-mono uppercase text-[#94A3B8]">
                    {selectedItem.type}
                  </span>
                </div>

                {/* Dota 2 Native Export Integration Box */}
                <div className="bg-[#0B0E15] border border-[#F59E0B]/40 rounded p-2.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#F59E0B] flex items-center gap-1">
                      <FileCode className="w-3.5 h-3.5" />
                      Dota 2 Export
                    </span>
                    <label className="flex items-center gap-1.5 text-[10px] text-[#94A3B8] cursor-pointer">
                      <span>Include in JSON:</span>
                      <input
                        type="checkbox"
                        checked={selectedItem.exportToDota !== false}
                        onChange={(e) => handleUpdateSelectedItem({ exportToDota: e.target.checked })}
                        className="accent-[#F59E0B] rounded"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="text-[10px] text-[#94A3B8] block mb-1">Dota Category Title</label>
                    <input
                      ref={categoryNameInputRef}
                      type="text"
                      value={categoryNameValue}
                      onChange={(e) => handleUpdateSelectedItem({ dotaCategoryName: e.target.value })}
                      placeholder="Category name in Dota 2"
                      className="w-full bg-[#121824] border border-[#202B3D] focus:border-[#F59E0B] text-xs text-white px-2 py-1 rounded outline-none"
                    />
                  </div>

                  <div className="bg-[#0B0E15] border border-[#38BDF8]/30 rounded p-2.5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#38BDF8]">Dota Symbols</span>
                      <label className="flex items-center gap-1 text-[10px] text-[#94A3B8] cursor-pointer">
                        <input type="checkbox" checked={dotaSafeOnly} onChange={(e) => setDotaSafeOnly(e.target.checked)} className="accent-[#38BDF8] rounded" />
                        Dota Safe
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      <select
                        value={selectedDotaSymbolCategory}
                        onChange={(e) => setSelectedDotaSymbolCategory(e.target.value as DotaSymbolCategory | 'all')}
                        className="bg-[#121824] border border-[#202B3D] text-[10px] text-white px-1.5 py-1 rounded outline-none"
                      >
                        <option value="all">All categories</option>
                        {Object.entries(DOTA_SYMBOL_CATEGORY_META).map(([key, meta]) => (
                          <option key={key} value={key}>{meta.label}</option>
                        ))}
                      </select>
                      <span className="text-[10px] text-[#64748B] flex items-center justify-end px-1">{visibleDotaSymbols.length} symbols</span>
                    </div>
                    {favoriteDotaSymbolEntries.length > 0 && (
                      <div>
                        <span className="text-[9px] uppercase tracking-wide text-[#F59E0B]">Favorites</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {favoriteDotaSymbolEntries.map((entry) => (
                            <div key={"favorite-" + entry.symbol} className="flex items-stretch">
                              <button type="button" onClick={() => handleInsertDotaSymbol(entry.symbol)} title={entry.name} className="w-7 h-7 bg-[#121824] hover:bg-[#1E293B] border border-[#F59E0B]/40 rounded-l text-base text-white hover:text-[#F59E0B]">{entry.symbol}</button>
                              <button type="button" onClick={() => toggleDotaFavorite(entry.symbol)} title="Remove from favorites" className="px-1 bg-[#121824] border-y border-r border-[#F59E0B]/40 rounded-r text-[10px] text-[#F59E0B]">★</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {recentDotaSymbolEntries.length > 0 && (
                      <div>
                        <span className="text-[9px] uppercase tracking-wide text-[#94A3B8]">Recently used</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {recentDotaSymbolEntries.map((entry) => (
                            <button key={"recent-" + entry.symbol} type="button" onClick={() => handleInsertDotaSymbol(entry.symbol)} title={entry.name} className="w-7 h-7 bg-[#121824] hover:bg-[#1E293B] border border-[#202B3D] rounded text-base text-white hover:text-[#38BDF8]">{entry.symbol}</button>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-6 gap-1 max-h-36 overflow-y-auto custom-scrollbar p-1 bg-[#121824] rounded border border-[#202B3D]">
                      {visibleDotaSymbols.map((entry) => (
                        <div key={entry.category + "-" + entry.symbol} className="flex items-stretch min-w-0">
                          <button type="button" onClick={() => handleInsertDotaSymbol(entry.symbol)} title={entry.name + " — " + entry.compatibility} className="flex-1 min-w-0 h-8 bg-[#0E121A] hover:bg-[#1E293B] border border-[#202B3D] rounded-l text-base text-white">{entry.symbol}</button>
                          <button type="button" onClick={() => toggleDotaFavorite(entry.symbol)} title={favoriteDotaSymbols.includes(entry.symbol) ? "Remove from favorites" : "Add to favorites"} className="px-0.5 bg-[#0E121A] border-y border-r border-[#202B3D] rounded-r text-[9px] text-[#64748B] hover:text-[#F59E0B]">{favoriteDotaSymbols.includes(entry.symbol) ? '★' : '☆'}</button>
                        </div>
                      ))}
                    </div>
                    <div className="bg-[#121824] border border-[#202B3D] rounded p-2 space-y-1">
                      <span className="text-[9px] uppercase tracking-wide text-[#94A3B8]">Editor:</span>
                      <div className="font-mono text-xs text-white break-all">{categoryNameValue || '─── ｡.:*♡*:.｡ ───'}</div>
                      <span className="text-[9px] uppercase tracking-wide text-[#94A3B8] block pt-1">Dota compatibility:</span>
                      <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-[9px]">
                        <span className="text-[#22C55E]">✓ verified ({categoryAnalysis.verifiedSymbols.length})</span>
                        <span className="text-[#FBBF24]">⚠ unknown ({categoryAnalysis.unknownSymbols.length})</span>
                        <span className="text-[#EF4444]">✕ unsupported ({categoryAnalysis.unsupportedSymbols.length})</span>
                      </div>
                      {categoryAnalysis.hasWarning && <p className="text-[10px] text-[#FBBF24] leading-snug pt-1">⚠ Этот символ может не отображаться в Dota 2.</p>}
                      <button type="button" onClick={handleCleanUnsupportedDotaSymbols} disabled={categoryAnalysis.unsupportedSymbols.length === 0} className="w-full mt-1 py-1 text-[10px] rounded border border-[#7F1D1D] text-[#FCA5A5] hover:bg-[#2E1215] disabled:opacity-40 disabled:cursor-not-allowed">Clean unsupported symbols</button>
                    </div>
                  </div>

                  {/* If Rectangle: Convert to Hero Grid Slots option! */}
                  {selectedItem.type === 'rect' && (
                    <div className="pt-1.5 border-t border-[#202B3D] space-y-2">
                      <div className="flex items-center justify-between text-[10px] text-[#CBD5E1]">
                        <span>Capture heroes inside box:</span>
                        <input
                          type="checkbox"
                          checked={selectedItem.autoCaptureHeroes !== false}
                          onChange={(e) => handleUpdateSelectedItem({ autoCaptureHeroes: e.target.checked })}
                          className="accent-[#38BDF8] rounded"
                        />
                      </div>

                      <button
                        onClick={() => handleConvertRectToHeroBox(selectedItem)}
                        className="w-full py-1.5 bg-[#1E293B] hover:bg-[#2B3A52] text-[#38BDF8] border border-[#38BDF8]/40 font-semibold text-xs rounded transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Grid className="w-3.5 h-3.5" />
                        <span>Convert Box to Hero Grid Slots</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Transform */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-[#94A3B8] block mb-1">X Position</label>
                    <input
                      type="number"
                      value={Math.round(selectedItem.x)}
                      onChange={(e) => handleUpdateSelectedItem({ x: parseInt(e.target.value) || 0 })}
                      className="w-full bg-[#0E121A] border border-[#202B3D] focus:border-[#38BDF8] text-xs text-white px-2 py-1 rounded outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#94A3B8] block mb-1">Y Position</label>
                    <input
                      type="number"
                      value={Math.round(selectedItem.y)}
                      onChange={(e) => handleUpdateSelectedItem({ y: parseInt(e.target.value) || 0 })}
                      className="w-full bg-[#0E121A] border border-[#202B3D] focus:border-[#38BDF8] text-xs text-white px-2 py-1 rounded outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-[#94A3B8] block mb-1">Width</label>
                    <input
                      type="number"
                      value={Math.round(selectedItem.width)}
                      onChange={(e) => handleUpdateSelectedItem({ width: parseInt(e.target.value) || 10 })}
                      className="w-full bg-[#0E121A] border border-[#202B3D] focus:border-[#38BDF8] text-xs text-white px-2 py-1 rounded outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#94A3B8] block mb-1">Height</label>
                    <input
                      type="number"
                      value={Math.round(selectedItem.height)}
                      onChange={(e) => handleUpdateSelectedItem({ height: parseInt(e.target.value) || 10 })}
                      className="w-full bg-[#0E121A] border border-[#202B3D] focus:border-[#38BDF8] text-xs text-white px-2 py-1 rounded outline-none"
                    />
                  </div>
                </div>

                {/* Text specific props */}
                {selectedItem.type === 'text' && (
                  <>
                    <div>
                      <label className="text-[10px] text-[#94A3B8] block mb-1">Text Content</label>
                      <input
                        type="text"
                        value={selectedItem.text || ''}
                        onChange={(e) => handleUpdateSelectedItem({ text: e.target.value })}
                        className="w-full bg-[#0E121A] border border-[#202B3D] focus:border-[#38BDF8] text-xs text-white px-2 py-1 rounded outline-none font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-[#94A3B8] block mb-1">Font Family</label>
                        <select
                          value={selectedItem.fontFamily}
                          onChange={(e) => handleUpdateSelectedItem({ fontFamily: e.target.value })}
                          className="w-full bg-[#0E121A] border border-[#202B3D] focus:border-[#38BDF8] text-xs text-white px-2 py-1 rounded outline-none"
                        >
                          {FONT_OPTIONS.map((f) => (
                            <option key={f.label} value={f.value}>
                              {f.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] text-[#94A3B8] block mb-1">Font Size</label>
                        <input
                          type="number"
                          min={8}
                          max={120}
                          value={selectedItem.fontSize || 24}
                          onChange={(e) => handleUpdateSelectedItem({ fontSize: parseInt(e.target.value) || 24 })}
                          className="w-full bg-[#0E121A] border border-[#202B3D] focus:border-[#38BDF8] text-xs text-white px-2 py-1 rounded outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-[#94A3B8] block mb-1">Text Color</label>
                        <input
                          type="color"
                          value={selectedItem.textColor || '#ffffff'}
                          onChange={(e) => handleUpdateSelectedItem({ textColor: e.target.value })}
                          className="w-full h-7 bg-[#0E121A] border border-[#202B3D] rounded cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#94A3B8] block mb-1">Glow Color</label>
                        <input
                          type="color"
                          value={selectedItem.textGlow || '#F59E0B'}
                          onChange={(e) => handleUpdateSelectedItem({ textGlow: e.target.value })}
                          className="w-full h-7 bg-[#0E121A] border border-[#202B3D] rounded cursor-pointer"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Shape specific props */}
                {(selectedItem.type === 'rect' || selectedItem.type === 'circle') && (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-[#94A3B8] block mb-1">Fill Color</label>
                        <input
                          type="color"
                          value={selectedItem.fill || '#F59E0B'}
                          onChange={(e) => handleUpdateSelectedItem({ fill: e.target.value })}
                          className="w-full h-7 bg-[#0E121A] border border-[#202B3D] rounded cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#94A3B8] block mb-1">Stroke Color</label>
                        <input
                          type="color"
                          value={selectedItem.stroke || '#FBBF24'}
                          onChange={(e) => handleUpdateSelectedItem({ stroke: e.target.value })}
                          className="w-full h-7 bg-[#0E121A] border border-[#202B3D] rounded cursor-pointer"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] text-[#94A3B8] block mb-1">Stroke Width ({selectedItem.strokeWidth || 1}px)</label>
                      <input
                        type="range"
                        min={0}
                        max={16}
                        value={selectedItem.strokeWidth || 1}
                        onChange={(e) => handleUpdateSelectedItem({ strokeWidth: parseInt(e.target.value) || 0 })}
                        className="w-full accent-[#F59E0B]"
                      />
                    </div>
                  </>
                )}
              </div>
            ) : null}

            {/* Multi-Selection Batch Controls */}
            {selectedItemIds.length > 1 && (
              <div className="bg-[#121824] border border-[#38BDF8]/60 rounded-lg p-3 space-y-3 shadow-lg shadow-sky-950/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#38BDF8] flex items-center gap-1.5 font-['Cinzel']">
                    <Layers className="w-3.5 h-3.5 text-[#38BDF8]" />
                    МНОЖЕСТВЕННОЕ ВЫДЕЛЕНИЕ
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#38BDF8] px-1.5 py-0.5 rounded bg-[#38BDF8]/10 border border-[#38BDF8]/30">
                    {selectedItemIds.length} ОБЪЕКТОВ
                  </span>
                </div>

                <p className="text-[11px] text-[#94A3B8]">
                  Перетаскивайте мышью, нажимайте <kbd className="px-1 py-0.5 bg-[#0E121A] text-white rounded text-[10px] font-mono">Ctrl+C</kbd> / <kbd className="px-1 py-0.5 bg-[#0E121A] text-white rounded text-[10px] font-mono">Ctrl+V</kbd> или используйте кнопки ниже:
                </p>

                {/* Batch Move / Nudge Controls */}
                <div className="space-y-1.5 bg-[#0E121A] p-2.5 rounded border border-[#202B3D]">
                  <span className="text-[10px] font-bold text-[#CBD5E1] block flex items-center gap-1">
                    <Move className="w-3 h-3 text-[#38BDF8]" />
                    СДВИГ ВСЕХ ОБЪЕКТОВ ВМЕСТЕ (ПЕРЕНОС)
                  </span>
                  <div className="grid grid-cols-4 gap-1 pt-1">
                    <button
                      onClick={() =>
                        onUpdateProject((prev) => ({
                          ...prev,
                          items: prev.items.map((it) =>
                            selectedItemIds.includes(it.id) ? { ...it, x: it.x - 10 } : it
                          )
                        }))
                      }
                      className="py-1 px-1 bg-[#1E293B] hover:bg-[#2B3A52] text-white text-[10px] font-semibold rounded flex items-center justify-center gap-0.5 transition-colors"
                      title="Сдвиг влево на 10px"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      <span>-10px</span>
                    </button>
                    <button
                      onClick={() =>
                        onUpdateProject((prev) => ({
                          ...prev,
                          items: prev.items.map((it) =>
                            selectedItemIds.includes(it.id) ? { ...it, x: it.x + 10 } : it
                          )
                        }))
                      }
                      className="py-1 px-1 bg-[#1E293B] hover:bg-[#2B3A52] text-white text-[10px] font-semibold rounded flex items-center justify-center gap-0.5 transition-colors"
                      title="Сдвиг вправо на 10px"
                    >
                      <span>+10px</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() =>
                        onUpdateProject((prev) => ({
                          ...prev,
                          items: prev.items.map((it) =>
                            selectedItemIds.includes(it.id) ? { ...it, y: it.y - 10 } : it
                          )
                        }))
                      }
                      className="py-1 px-1 bg-[#1E293B] hover:bg-[#2B3A52] text-white text-[10px] font-semibold rounded flex items-center justify-center gap-0.5 transition-colors"
                      title="Сдвиг вверх на 10px"
                    >
                      <ArrowUp className="w-3 h-3" />
                      <span>-10px</span>
                    </button>
                    <button
                      onClick={() =>
                        onUpdateProject((prev) => ({
                          ...prev,
                          items: prev.items.map((it) =>
                            selectedItemIds.includes(it.id) ? { ...it, y: it.y + 10 } : it
                          )
                        }))
                      }
                      className="py-1 px-1 bg-[#1E293B] hover:bg-[#2B3A52] text-white text-[10px] font-semibold rounded flex items-center justify-center gap-0.5 transition-colors"
                      title="Сдвиг вниз на 10px"
                    >
                      <ArrowDown className="w-3 h-3" />
                      <span>+10px</span>
                    </button>
                  </div>
                </div>

                {/* Batch Alignments */}
                <div className="space-y-1.5 bg-[#0E121A] p-2.5 rounded border border-[#202B3D]">
                  <span className="text-[10px] font-bold text-[#CBD5E1] block">
                    ВЫРАВНИВАНИЕ ВЫБРАННЫХ ОБЪЕКТОВ
                  </span>
                  <div className="grid grid-cols-3 gap-1 pt-1">
                    <button
                      onClick={() => {
                        const selected = project.items.filter((it) => selectedItemIds.includes(it.id));
                        if (selected.length === 0) return;
                        const minX = Math.min(...selected.map((it) => it.x));
                        onUpdateProject((prev) => ({
                          ...prev,
                          items: prev.items.map((it) =>
                            selectedItemIds.includes(it.id) ? { ...it, x: minX } : it
                          )
                        }));
                      }}
                      className="py-1 px-1 bg-[#1E293B] hover:bg-[#2B3A52] text-[#CBD5E1] text-[10px] rounded flex items-center justify-center gap-1 transition-colors"
                    >
                      <AlignLeft className="w-3 h-3" />
                      <span>По левому</span>
                    </button>
                    <button
                      onClick={() => {
                        const selected = project.items.filter((it) => selectedItemIds.includes(it.id));
                        if (selected.length === 0) return;
                        const minX = Math.min(...selected.map((it) => it.x));
                        const maxX = Math.max(...selected.map((it) => it.x + it.width));
                        const midX = (minX + maxX) / 2;
                        onUpdateProject((prev) => ({
                          ...prev,
                          items: prev.items.map((it) =>
                            selectedItemIds.includes(it.id)
                              ? { ...it, x: Math.round(midX - it.width / 2) }
                              : it
                          )
                        }));
                      }}
                      className="py-1 px-1 bg-[#1E293B] hover:bg-[#2B3A52] text-[#CBD5E1] text-[10px] rounded flex items-center justify-center gap-1 transition-colors"
                    >
                      <AlignCenter className="w-3 h-3" />
                      <span>По центру</span>
                    </button>
                    <button
                      onClick={() => {
                        const selected = project.items.filter((it) => selectedItemIds.includes(it.id));
                        if (selected.length === 0) return;
                        const maxX = Math.max(...selected.map((it) => it.x + it.width));
                        onUpdateProject((prev) => ({
                          ...prev,
                          items: prev.items.map((it) =>
                            selectedItemIds.includes(it.id) ? { ...it, x: maxX - it.width } : it
                          )
                        }));
                      }}
                      className="py-1 px-1 bg-[#1E293B] hover:bg-[#2B3A52] text-[#CBD5E1] text-[10px] rounded flex items-center justify-center gap-1 transition-colors"
                    >
                      <AlignRight className="w-3 h-3" />
                      <span>По правому</span>
                    </button>
                  </div>
                </div>

                {/* Batch Actions: Duplicate / Delete */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => {
                      const newClones: CanvasItem[] = [];
                      project.items.forEach((it) => {
                        if (selectedItemIds.includes(it.id)) {
                          newClones.push({
                            ...it,
                            id: `${it.type}_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
                            x: it.x + 20,
                            y: it.y + 20,
                            name: `${it.name} (Копия)`
                          });
                        }
                      });
                      onUpdateProject((prev) => ({ ...prev, items: [...prev.items, ...newClones] }));
                    }}
                    className="py-1.5 bg-[#1E293B] hover:bg-[#2B3A52] text-[#38BDF8] border border-[#38BDF8]/40 font-semibold text-xs rounded transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Дублировать (Ctrl+D)</span>
                  </button>
                  <button
                    onClick={() => {
                      onUpdateProject((prev) => ({
                        ...prev,
                        items: prev.items.filter((it) => !selectedItemIds.includes(it.id))
                      }));
                    }}
                    className="py-1.5 bg-[#2E1215] hover:bg-[#3D181D] text-[#FCA5A5] border border-[#7F1D1D] font-semibold text-xs rounded transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Удалить все ({selectedItemIds.length})</span>
                  </button>
                </div>
              </div>
            )}

            {/* Canvas Global Properties */}
            <div className="bg-[#121824] border border-[#202B3D] rounded-lg p-3 space-y-3">
              <span className="text-xs font-bold text-[#E2E8F0] block font-['Cinzel']">РАЗРЕШЕНИЕ И ХОЛСТ (2K DEFAULT)</span>

              <div>
                <label className="text-[10px] text-[#94A3B8] block mb-1">Пресеты разрешения экрана</label>
                <select
                  value={`${project.canvasWidth}x${project.canvasHeight}`}
                  onChange={(e) => {
                    const [w, h] = e.target.value.split('x').map(Number);
                    if (w && h) {
                      onUpdateProject((prev) => ({
                        ...prev,
                        canvasWidth: w,
                        canvasHeight: h
                      }));
                    }
                  }}
                  className="w-full bg-[#0E121A] border border-[#202B3D] focus:border-[#F59E0B] text-xs text-white px-2 py-1.5 rounded outline-none"
                >
                  <option value="2560x1440">2K Quad HD (2560 × 1440) — Стандарт / Рекомендуется</option>
                  <option value="1920x1080">Full HD (1920 × 1080)</option>
                  <option value="3840x2160">4K Ultra HD (3840 × 2160)</option>
                  <option value="3440x1440">2K Ultrawide (3440 × 1440)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-[#94A3B8] block mb-1">Ширина (px)</label>
                  <input
                    type="number"
                    value={project.canvasWidth}
                    onChange={(e) =>
                      onUpdateProject((prev) => ({
                        ...prev,
                        canvasWidth: parseInt(e.target.value) || 2560
                      }))
                    }
                    className="w-full bg-[#0E121A] border border-[#202B3D] focus:border-[#F59E0B] text-xs text-white px-2 py-1 rounded outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#94A3B8] block mb-1">Высота (px)</label>
                  <input
                    type="number"
                    value={project.canvasHeight}
                    onChange={(e) =>
                      onUpdateProject((prev) => ({
                        ...prev,
                        canvasHeight: parseInt(e.target.value) || 1440
                      }))
                    }
                    className="w-full bg-[#0E121A] border border-[#202B3D] focus:border-[#F59E0B] text-xs text-white px-2 py-1 rounded outline-none"
                  />
                </div>
              </div>

              {/* Dota 2 Layout Mode */}
              <div className="pt-2 border-t border-[#202B3D]">
                <label className="text-[10px] text-[#94A3B8] block mb-1">Режим экспорта в Dota 2 (Колонки/Сетка)</label>
                <select
                  value={project.exportMode || 'column_preserve'}
                  onChange={(e) =>
                    onUpdateProject((prev) => ({
                      ...prev,
                      exportMode: e.target.value as 'column_preserve' | 'single_category'
                    }))
                  }
                  className="w-full bg-[#0E121A] border border-[#202B3D] focus:border-[#F59E0B] text-xs text-white px-2 py-1.5 rounded outline-none"
                >
                  <option value="column_preserve">Сохранять точные колонки (Без кривизны и сжатия)</option>
                  <option value="single_category">Единая категория Dota 2</option>
                </select>
              </div>

              {/* Background controls */}
              {project.background.imageUrl && (
                <div className="space-y-2 pt-2 border-t border-[#202B3D]">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#CBD5E1]">Background Image</span>
                    <button
                      onClick={() =>
                        onUpdateProject((prev) => ({
                          ...prev,
                          background: { ...prev.background, imageUrl: null }
                        }))
                      }
                      className="text-[10px] text-red-400 hover:underline"
                    >
                      Remove
                    </button>
                  </div>

                  <div>
                    <label className="text-[10px] text-[#94A3B8] block mb-1">
                      Opacity ({Math.round((project.background.opacity || 0.6) * 100)}%)
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.05}
                      value={project.background.opacity ?? 0.6}
                      onChange={(e) =>
                        onUpdateProject((prev) => ({
                          ...prev,
                          background: { ...prev.background, opacity: parseFloat(e.target.value) }
                        }))
                      }
                      className="w-full accent-[#F59E0B]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-[#94A3B8] block mb-1">Scale Fitting Mode</label>
                    <select
                      value={project.background.scaleMode}
                      onChange={(e) =>
                        onUpdateProject((prev) => ({
                          ...prev,
                          background: { ...prev.background, scaleMode: e.target.value as any }
                        }))
                      }
                      className="w-full bg-[#0E121A] border border-[#202B3D] focus:border-[#F59E0B] text-xs text-white px-2 py-1 rounded outline-none"
                    >
                      <option value="fit">Fit to Canvas (Aspect Preserved)</option>
                      <option value="fill">Fill Canvas (Cover)</option>
                      <option value="stretch">Stretch to Bounds</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

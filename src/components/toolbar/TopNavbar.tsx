import React, { useRef, useState } from 'react';
import { ProjectState } from '../../types/dota';
import {
  Image as ImageIcon,
  Lock,
  Unlock,
  Undo2,
  Redo2,
  Save,
  FolderOpen,
  Camera,
  FileCode,
  Download,
  HelpCircle,
  Eye,
  EyeOff,
  Sparkles,
  LayoutGrid,
  ChevronDown,
  Award,
  Tag,
  Swords,
  Layers,
  HeartHandshake,
  Trash2
} from 'lucide-react';
import { createAnimeAestheticProject, createRoleProProject } from '../../utils/presets';
import { createDefaultProject } from '../../utils/gridUtils';

interface TopNavbarProps {
  project: ProjectState;
  onUpdateProject: (updater: (prev: ProjectState) => ProjectState) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onOpenExportDota: () => void;
  onOpenExportPng: () => void;
  onOpenShortcuts: () => void;
  onDownloadStandaloneHtml: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  project,
  onUpdateProject,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onOpenExportDota,
  onOpenExportPng,
  onOpenShortcuts,
  onDownloadStandaloneHtml
}) => {
  const bgInputRef = useRef<HTMLInputElement>(null);
  const projInputRef = useRef<HTMLInputElement>(null);
  const [showPresetsMenu, setShowPresetsMenu] = useState(false);
  const [showViewMenu, setShowViewMenu] = useState(false);

  const handleApplyPreset = (type: 'anime' | 'roles' | 'classic' | 'blank') => {
    if (type === 'anime') {
      onUpdateProject(() => createAnimeAestheticProject());
    } else if (type === 'roles') {
      onUpdateProject(() => createRoleProProject());
    } else if (type === 'classic') {
      onUpdateProject(() => createDefaultProject());
    } else if (type === 'blank') {
      onUpdateProject((prev) => ({
        ...prev,
        grids: [],
        items: []
      }));
    }
    setShowPresetsMenu(false);
  };

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      onUpdateProject((prev) => ({
        ...prev,
        background: {
          ...prev.background,
          imageUrl: dataUrl,
          visible: true
        }
      }));
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleToggleBgLock = () => {
    onUpdateProject((prev) => ({
      ...prev,
      background: {
        ...prev.background,
        locked: !prev.background.locked
      }
    }));
  };

  const handleToggleBgVisible = () => {
    onUpdateProject((prev) => ({
      ...prev,
      background: {
        ...prev.background,
        visible: !prev.background.visible
      }
    }));
  };

  const handleSaveProject = () => {
    const jsonStr = JSON.stringify(project, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(project.title || 'dota_grid_project').toLowerCase().replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLoadProject = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const loadedProject = JSON.parse(event.target?.result as string) as ProjectState;
        if (loadedProject && loadedProject.grids) {
          onUpdateProject(() => loadedProject);
        } else {
          alert('Invalid project JSON structure.');
        }
      } catch (err) {
        alert('Failed to parse project JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const assignedHeroesCount = project.grids.reduce((acc, g) => {
    return acc + g.slots.filter((s) => s.heroId !== null).length;
  }, 0);

  const totalSlotsCount = project.grids.reduce((acc, g) => acc + g.slots.length, 0);

  return (
    <header className="h-14 bg-[#0E121A] border-b border-[#1E293B] flex items-center justify-between px-3 md:px-4 z-40 select-none shadow-md shadow-black/40">
      {/* Left: Branding & Status Pill */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-[#334155] flex items-center justify-center shadow-inner relative group">
            <span className="text-base text-[#F59E0B] font-bold group-hover:scale-110 transition-transform">⚔️</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-['Cinzel'] font-bold text-sm tracking-wider text-[#F1F5F9]">
                DOTA GRID STUDIO
              </span>
              <span className="hidden lg:inline-flex items-center gap-1 text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-[#161F30] text-[#F59E0B] border border-[#2B3A52]">
                {project.grids.length} Grids • {assignedHeroesCount} Heroes
              </span>
            </div>
            <span className="text-[10px] text-[#94A3B8] font-mono hidden sm:block">
              {assignedHeroesCount} / {totalSlotsCount} Heroes Active
            </span>
          </div>
        </div>

        {/* Presets / Templates Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowPresetsMenu(!showPresetsMenu);
              setShowViewMenu(false);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#F1F5F9] bg-[#161F30] hover:bg-[#202B3D] border border-[#3B82F6]/50 hover:border-[#38BDF8] rounded-lg shadow-sm transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Шаблоны Макетов</span>
            <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
          </button>

          {showPresetsMenu && (
            <div className="absolute left-0 top-full mt-1.5 w-72 bg-[#0F1420] border border-[#2B3A52] rounded-xl shadow-2xl shadow-black/95 p-1.5 z-50 animate-in fade-in zoom-in-95">
              <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] border-b border-[#1E293B]">
                Готовые макеты как на скриншотах
              </div>

              <button
                onClick={() => handleApplyPreset('anime')}
                className="w-full text-left px-3 py-2 text-xs text-[#E2E8F0] hover:bg-[#1E293B] rounded-lg flex items-start gap-2.5 transition-colors group mt-1"
              >
                <span className="text-base">🌸</span>
                <div>
                  <div className="font-semibold text-[#F1F5F9] group-hover:text-[#38BDF8]">Японский Аниме Макет</div>
                  <div className="text-[10px] text-[#94A3B8] leading-tight">Колонны )()(, иероглифы, рамки и карточки персонажей</div>
                </div>
              </button>

              <button
                onClick={() => handleApplyPreset('roles')}
                className="w-full text-left px-3 py-2 text-xs text-[#E2E8F0] hover:bg-[#1E293B] rounded-lg flex items-start gap-2.5 transition-colors group"
              >
                <span className="text-base">⚔️</span>
                <div>
                  <div className="font-semibold text-[#F1F5F9] group-hover:text-[#F59E0B]">Позиции 1-5 (Pro Roles)</div>
                  <div className="text-[10px] text-[#94A3B8] leading-tight">&lt;KERRY&gt; &lt;MID&gt; &lt;OFF&gt; &lt;SUPPORT&gt; с разделителями</div>
                </div>
              </button>

              <button
                onClick={() => handleApplyPreset('classic')}
                className="w-full text-left px-3 py-2 text-xs text-[#E2E8F0] hover:bg-[#1E293B] rounded-lg flex items-start gap-2.5 transition-colors group"
              >
                <span className="text-base">🛡️</span>
                <div>
                  <div className="font-semibold text-[#F1F5F9] group-hover:text-[#4ADE80]">Классический 35×7 + 10 Bans</div>
                  <div className="text-[10px] text-[#94A3B8] leading-tight">Полная таблица атрибутов со всеми 126+ героями</div>
                </div>
              </button>

              <button
                onClick={() => handleApplyPreset('blank')}
                className="w-full text-left px-3 py-2 text-xs text-[#EF4444] hover:bg-[#2B1114] rounded-lg flex items-start gap-2.5 transition-colors group border-t border-[#1E293B] mt-1"
              >
                <Trash2 className="w-4 h-4 mt-0.5" />
                <div>
                  <div className="font-semibold">Чистый холст (Blank)</div>
                  <div className="text-[10px] text-[#94A3B8] leading-tight">Очистить всё для рисования с нуля</div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* View / Display Settings Dropdown */}
        <div className="relative hidden md:block">
          <button
            onClick={() => {
              setShowViewMenu(!showViewMenu);
              setShowPresetsMenu(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[#CBD5E1] hover:text-white bg-[#121824] hover:bg-[#1E293B] border border-[#202B3D] rounded-lg transition-all"
          >
            <Eye className="w-3.5 h-3.5 text-[#A855F7]" />
            <span>Вид</span>
            <ChevronDown className="w-3 h-3 text-[#64748B]" />
          </button>

          {showViewMenu && (
            <div className="absolute left-0 top-full mt-1.5 w-64 bg-[#0F1420] border border-[#2B3A52] rounded-xl shadow-2xl shadow-black/95 p-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] border-b border-[#1E293B] mb-1">
                Отображение на карточках
              </div>

              {/* Dota Plus Tier Badges */}
              <label className="flex items-center justify-between px-2 py-1.5 hover:bg-[#1E293B] rounded-lg cursor-pointer text-xs text-[#E2E8F0]">
                <div className="flex items-center gap-2">
                  <Award className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <span>Уровни Dota Plus (1-30)</span>
                </div>
                <input
                  type="checkbox"
                  checked={project.showHeroTiers ?? true}
                  onChange={(e) =>
                    onUpdateProject((prev) => ({
                      ...prev,
                      showHeroTiers: e.target.checked
                    }))
                  }
                  className="rounded border-[#2B3A52] text-[#F59E0B] focus:ring-0 accent-[#F59E0B]"
                />
              </label>

              {/* Hero Names */}
              <label className="flex items-center justify-between px-2 py-1.5 hover:bg-[#1E293B] rounded-lg cursor-pointer text-xs text-[#E2E8F0]">
                <div className="flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>Имена героев снизу</span>
                </div>
                <input
                  type="checkbox"
                  checked={project.showHeroNames ?? false}
                  onChange={(e) =>
                    onUpdateProject((prev) => ({
                      ...prev,
                      showHeroNames: e.target.checked
                    }))
                  }
                  className="rounded border-[#2B3A52] text-[#38BDF8] focus:ring-0 accent-[#38BDF8]"
                />
              </label>

              {/* Grid Lines */}
              <label className="flex items-center justify-between px-2 py-1.5 hover:bg-[#1E293B] rounded-lg cursor-pointer text-xs text-[#E2E8F0]">
                <div className="flex items-center gap-2">
                  <LayoutGrid className="w-3.5 h-3.5 text-[#4ADE80]" />
                  <span>Сетка холста (40px)</span>
                </div>
                <input
                  type="checkbox"
                  checked={project.showGridLines}
                  onChange={(e) =>
                    onUpdateProject((prev) => ({
                      ...prev,
                      showGridLines: e.target.checked
                    }))
                  }
                  className="rounded border-[#2B3A52] text-[#4ADE80] focus:ring-0 accent-[#4ADE80]"
                />
              </label>
            </div>
          )}
        </div>

        {/* Project Title Input */}
        <div className="hidden xl:flex items-center ml-2 pl-3 border-l border-[#1E293B]">
          <input
            type="text"
            value={project.title}
            onChange={(e) =>
              onUpdateProject((prev) => ({
                ...prev,
                title: e.target.value
              }))
            }
            placeholder="Layout Title..."
            className="bg-[#121824] border border-[#202B3D] hover:border-[#3B82F6]/50 focus:border-[#F59E0B] text-xs text-[#E2E8F0] px-2.5 py-1 rounded outline-none w-44 transition-colors font-medium"
          />
        </div>
      </div>

      {/* Center/Right: Actions & Tools */}
      <div className="flex items-center gap-1.5 md:gap-2">
        {/* Background Controls Group */}
        <div className="flex items-center bg-[#121824] border border-[#202B3D] rounded p-0.5">
          <input
            type="file"
            ref={bgInputRef}
            onChange={handleBgUpload}
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="hidden"
          />
          <button
            onClick={() => bgInputRef.current?.click()}
            title="Upload Custom PNG/JPG Background"
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-[#CBD5E1] hover:text-white hover:bg-[#1E293B] rounded transition-colors"
          >
            <ImageIcon className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span className="hidden sm:inline">Фон</span>
          </button>

          {project.background.imageUrl && (
            <>
              <button
                onClick={handleToggleBgVisible}
                title={project.background.visible ? 'Hide Background' : 'Show Background'}
                className="p-1 text-[#94A3B8] hover:text-white hover:bg-[#1E293B] rounded transition-colors"
              >
                {project.background.visible ? (
                  <Eye className="w-3.5 h-3.5 text-[#38BDF8]" />
                ) : (
                  <EyeOff className="w-3.5 h-3.5 text-[#64748B]" />
                )}
              </button>
              <button
                onClick={handleToggleBgLock}
                title={project.background.locked ? 'Unlock Background' : 'Lock Background'}
                className={`p-1 rounded transition-colors ${
                  project.background.locked
                    ? 'text-[#F59E0B] bg-[#F59E0B]/15'
                    : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]'
                }`}
              >
                {project.background.locked ? (
                  <Lock className="w-3.5 h-3.5" />
                ) : (
                  <Unlock className="w-3.5 h-3.5" />
                )}
              </button>
            </>
          )}
        </div>

        {/* Undo / Redo */}
        <div className="flex items-center bg-[#121824] border border-[#202B3D] rounded p-0.5">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className="p-1.5 text-[#CBD5E1] hover:text-white hover:bg-[#1E293B] disabled:opacity-25 disabled:hover:bg-transparent rounded transition-colors"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            className="p-1.5 text-[#CBD5E1] hover:text-white hover:bg-[#1E293B] disabled:opacity-25 disabled:hover:bg-transparent rounded transition-colors"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Project Save / Load */}
        <div className="flex items-center bg-[#121824] border border-[#202B3D] rounded p-0.5">
          <input
            type="file"
            ref={projInputRef}
            onChange={handleLoadProject}
            accept=".json,application/json"
            className="hidden"
          />
          <button
            onClick={() => projInputRef.current?.click()}
            title="Open/Load Project JSON"
            className="flex items-center gap-1 px-2 py-1 text-xs text-[#CBD5E1] hover:text-white hover:bg-[#1E293B] rounded transition-colors"
          >
            <FolderOpen className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span className="hidden md:inline">Open</span>
          </button>
          <button
            onClick={handleSaveProject}
            title="Save Entire Project File (.json)"
            className="flex items-center gap-1 px-2 py-1 text-xs text-[#CBD5E1] hover:text-white hover:bg-[#1E293B] rounded transition-colors"
          >
            <Save className="w-3.5 h-3.5 text-[#4ADE80]" />
            <span className="hidden md:inline">Save</span>
          </button>
        </div>

        {/* Standalone HTML Exporter */}
        <button
          onClick={onDownloadStandaloneHtml}
          title="Download single self-contained HTML file (Dota_Grid_Studio.html) to run offline anywhere!"
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-[#E2E8F0] bg-[#161F30] hover:bg-[#1E293B] border border-[#2B3A52] hover:border-[#38BDF8] rounded shadow-sm transition-all"
        >
          <Download className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span className="hidden lg:inline">Single .HTML</span>
        </button>

        {/* Export PNG */}
        <button
          onClick={onOpenExportPng}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-[#E2E8F0] bg-[#161F30] hover:bg-[#1E293B] border border-[#2B3A52] hover:border-[#F59E0B] rounded shadow-sm transition-all"
        >
          <Camera className="w-3.5 h-3.5 text-[#F59E0B]" />
          <span className="hidden sm:inline">PNG</span>
        </button>

        {/* Export Dota 2 hero_grid_config.json */}
        <button
          onClick={onOpenExportDota}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-black bg-gradient-to-r from-[#F59E0B] via-[#E5A93C] to-[#D97706] hover:from-[#FBBF24] hover:to-[#E5A93C] border border-[#F59E0B] rounded shadow-md shadow-amber-950/40 hover:shadow-amber-500/20 transition-all cursor-pointer"
        >
          <FileCode className="w-3.5 h-3.5 text-black" />
          <span>Dota 2 JSON</span>
        </button>

        {/* Shortcuts Help */}
        <button
          onClick={onOpenShortcuts}
          title="Keyboard Shortcuts & Help"
          className="p-1.5 text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#1E293B] rounded transition-colors ml-1"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};


import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ProjectState, Transform, ToolType, DotaHero, CanvasItem } from './types/dota';
import { createDefaultProject } from './utils/gridUtils';
import { generateStandaloneHtml } from './utils/standaloneHtmlGenerator';
import { TopNavbar } from './components/toolbar/TopNavbar';
import { FloatingTools } from './components/toolbar/FloatingTools';
import { HeroSidebar } from './components/sidebar/HeroSidebar';
import { LayersPanel } from './components/sidebar/LayersPanel';
import { PropertiesPanel } from './components/sidebar/PropertiesPanel';
import { GridCanvas } from './components/canvas/GridCanvas';
import { ExportDotaModal } from './components/modals/ExportDotaModal';
import { ExportPngModal } from './components/modals/ExportPngModal';
import { ShortcutsModal } from './components/modals/ShortcutsModal';

const LOCAL_STORAGE_KEY = 'dota_grid_studio_project_v1';

export default function App() {
  // Initialize project state from LocalStorage or default 35x7 grid
  const [project, setProject] = useState<ProjectState>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.grids && parsed.grids.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load saved project', e);
    }
    return createDefaultProject();
  });

  // History stack for Undo / Redo
  const [history, setHistory] = useState<ProjectState[]>([]);
  const [redoStack, setRedoStack] = useState<ProjectState[]>([]);

  // Canvas Viewport Transform (Pan & Zoom)
  const [transform, setTransform] = useState<Transform>({
    x: 0,
    y: 0,
    zoom: 0.65
  });

  // Active Tool & Selection State
  const [currentTool, setCurrentTool] = useState<ToolType>('select');
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [selectedSlotInfo, setSelectedSlotInfo] = useState<{ gridId: string; slotId: string } | null>(null);
  const [draggingHeroFromSidebar, setDraggingHeroFromSidebar] = useState<DotaHero | null>(null);
  const [rightPanelTab, setRightPanelTab] = useState<'properties' | 'layers'>('properties');

  // Modals
  const [isExportDotaOpen, setIsExportDotaOpen] = useState(false);
  const [isExportPngOpen, setIsExportPngOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Auto-save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(project));
    } catch (e) {
      // Quota exceeded if heavy base64 images
    }
  }, [project]);

  // Centering canvas on first load
  const hasCenteredRef = useRef(false);
  useEffect(() => {
    if (!hasCenteredRef.current) {
      const width = window.innerWidth;
      const height = window.innerHeight - 52; // Minus navbar
      const canvasW = project.canvasWidth || 1920;
      const canvasH = project.canvasHeight || 1080;

      const scale = Math.min((width - 640) / canvasW, (height - 80) / canvasH);
      const initialZoom = Math.max(0.35, Math.min(1.0, scale));

      const initialX = (width - 300 - canvasW * initialZoom) / 2;
      const initialY = (height - canvasH * initialZoom) / 2;

      setTransform({
        x: Math.max(10, initialX),
        y: Math.max(10, initialY),
        zoom: initialZoom
      });
      hasCenteredRef.current = true;
    }
  }, [project.canvasWidth, project.canvasHeight]);

  // Project state updater with Undo history recording
  const updateProjectWithHistory = useCallback((updater: (prev: ProjectState) => ProjectState) => {
    setProject((prev) => {
      const next = updater(prev);
      if (next !== prev) {
        setHistory((h) => [...h.slice(-25), prev]);
        setRedoStack([]);
      }
      return next;
    });
  }, []);

  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setRedoStack((r) => [...r, project]);
    setProject(prev);
  }, [history, project]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack((r) => r.slice(0, -1));
    setHistory((h) => [...h, project]);
    setProject(next);
  }, [redoStack, project]);

  // Keyboard Undo/Redo Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      } else if (e.key.toLowerCase() === 'v') {
        setCurrentTool('select');
      } else if (e.key.toLowerCase() === 'h') {
        setCurrentTool('pan');
      } else if (e.key.toLowerCase() === 't') {
        setCurrentTool('text');
      } else if (e.key.toLowerCase() === 'r') {
        setCurrentTool('rect');
      } else if (e.key.toLowerCase() === 'o') {
        setCurrentTool('circle');
      } else if (e.key.toLowerCase() === 'l') {
        setCurrentTool('line');
      } else if (e.key.toLowerCase() === 'p') {
        setCurrentTool('brush');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  // Assign Hero to Selected Slot
  const handleAssignHeroToSelectedSlot = (heroId: number) => {
    if (!selectedSlotInfo) return;
    updateProjectWithHistory((prev) => ({
      ...prev,
      grids: prev.grids.map((grid) => {
        if (grid.id === selectedSlotInfo.gridId) {
          return {
            ...grid,
            slots: grid.slots.map((s) => (s.id === selectedSlotInfo.slotId ? { ...s, heroId } : s))
          };
        }
        return grid;
      })
    }));
  };

  // Add Item
  const handleAddCanvasItem = (item: CanvasItem) => {
    updateProjectWithHistory((prev) => ({
      ...prev,
      items: [...prev.items, item]
    }));
    setSelectedItemIds([item.id]);
    setSelectedSlotInfo(null);
  };

  // Fit to screen helper
  const handleFitToScreen = () => {
    const width = window.innerWidth;
    const height = window.innerHeight - 52;
    const canvasW = project.canvasWidth || 1920;
    const canvasH = project.canvasHeight || 1080;

    const scale = Math.min((width - 640) / canvasW, (height - 80) / canvasH);
    const fitZoom = Math.max(0.2, Math.min(2.0, scale));

    setTransform({
      x: (width - 300 - canvasW * fitZoom) / 2,
      y: (height - canvasH * fitZoom) / 2,
      zoom: fitZoom
    });
  };

  // Reset Zoom
  const handleResetZoom = () => {
    setTransform((prev) => ({
      ...prev,
      zoom: 1
    }));
  };

  // Download Standalone HTML file (Dota_Grid_Studio.html)
  const handleDownloadStandaloneHtml = () => {
    const htmlContent = generateStandaloneHtml(project);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Dota_Grid_Studio.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0B0B0B] text-[#E0E0E0] overflow-hidden font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navbar */}
      <TopNavbar
        project={project}
        onUpdateProject={updateProjectWithHistory}
        canUndo={history.length > 0}
        canRedo={redoStack.length > 0}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onOpenExportDota={() => setIsExportDotaOpen(true)}
        onOpenExportPng={() => setIsExportPngOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onDownloadStandaloneHtml={handleDownloadStandaloneHtml}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex relative overflow-hidden bg-[#0B0B0B]">
        {/* Left Sidebar: Hero Roster */}
        <HeroSidebar
          project={project}
          onUpdateProject={updateProjectWithHistory}
          selectedSlotInfo={selectedSlotInfo}
          onAssignHeroToSelectedSlot={handleAssignHeroToSelectedSlot}
          onDragStartHero={(hero) => setDraggingHeroFromSidebar(hero)}
        />

        {/* Central Canvas Viewport */}
        <main className="flex-1 relative h-full overflow-hidden bg-[#080808]">
          <FloatingTools
            currentTool={currentTool}
            onSelectTool={setCurrentTool}
            transform={transform}
            onUpdateTransform={setTransform}
            snapToGrid={project.snapToGrid}
            onToggleSnap={() =>
              updateProjectWithHistory((prev) => ({ ...prev, snapToGrid: !prev.snapToGrid }))
            }
            showRulers={project.showRulers}
            onToggleRulers={() =>
              updateProjectWithHistory((prev) => ({ ...prev, showRulers: !prev.showRulers }))
            }
            showGridLines={project.showGridLines}
            onToggleGridLines={() =>
              updateProjectWithHistory((prev) => ({ ...prev, showGridLines: !prev.showGridLines }))
            }
            onFitToScreen={handleFitToScreen}
            onResetZoom={handleResetZoom}
          />

          <GridCanvas
            project={project}
            onUpdateProject={updateProjectWithHistory}
            transform={transform}
            onUpdateTransform={setTransform}
            currentTool={currentTool}
            selectedItemIds={selectedItemIds}
            onSelectItemId={(id, multi) => {
              if (!id) {
                setSelectedItemIds([]);
              } else if (multi) {
                setSelectedItemIds((prev) =>
                  prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
                );
              } else {
                setSelectedItemIds([id]);
              }
            }}
            onSelectMultipleItemIds={(ids, additive) => {
              if (additive) {
                setSelectedItemIds((prev) => Array.from(new Set([...prev, ...ids])));
              } else {
                setSelectedItemIds(ids);
              }
              setSelectedSlotInfo(null);
            }}
            selectedSlotInfo={selectedSlotInfo}
            onSelectSlot={setSelectedSlotInfo}
            draggingHeroFromSidebar={draggingHeroFromSidebar}
            onClearDraggingHero={() => setDraggingHeroFromSidebar(null)}
          />
        </main>

        {/* Right Sidebar: Properties & Layers Panel */}
        <aside className="w-80 bg-[#111111] border-l border-[#242424] flex flex-col h-full z-20 select-none">
          <div className="p-2 border-b border-[#242424] flex gap-1 bg-[#0E0E0E]">
            <button
              onClick={() => setRightPanelTab('properties')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded transition-all ${
                rightPanelTab === 'properties'
                  ? 'bg-[#1C1C1C] text-[#A4E044] border border-[#333333] shadow-sm'
                  : 'text-[#888888] hover:text-[#E0E0E0] hover:bg-[#161616]'
              }`}
            >
              Properties & Grid
            </button>
            <button
              onClick={() => setRightPanelTab('layers')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded transition-all ${
                rightPanelTab === 'layers'
                  ? 'bg-[#1C1C1C] text-[#A4E044] border border-[#333333] shadow-sm'
                  : 'text-[#888888] hover:text-[#E0E0E0] hover:bg-[#161616]'
              }`}
            >
              Layers ({project.items.length + project.grids.length})
            </button>
          </div>

          <div className="flex-1 overflow-hidden bg-[#111111]">
            {rightPanelTab === 'properties' ? (
              <PropertiesPanel
                project={project}
                onUpdateProject={updateProjectWithHistory}
                selectedItemIds={selectedItemIds}
                selectedSlotInfo={selectedSlotInfo}
                onAddCanvasItem={handleAddCanvasItem}
              />
            ) : (
              <LayersPanel
                project={project}
                onUpdateProject={updateProjectWithHistory}
                selectedItemIds={selectedItemIds}
                onSelectItemId={(id, multi) => {
                  if (multi) {
                    setSelectedItemIds((prev) =>
                      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
                    );
                  } else {
                    setSelectedItemIds([id]);
                  }
                  setSelectedSlotInfo(null);
                }}
              />
            )}
          </div>
        </aside>
      </div>

      {/* Export & Shortcuts Modals */}
      {isExportDotaOpen && (
        <ExportDotaModal project={project} onClose={() => setIsExportDotaOpen(false)} />
      )}

      {isExportPngOpen && (
        <ExportPngModal project={project} onClose={() => setIsExportPngOpen(false)} />
      )}

      {isShortcutsOpen && (
        <ShortcutsModal onClose={() => setIsShortcutsOpen(false)} />
      )}
    </div>
  );
}

import React from 'react';
import { ToolType, Transform } from '../../types/dota';
import {
  MousePointer,
  Hand,
  Type,
  Square,
  Circle,
  ArrowUpRight,
  PenTool,
  Smile,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Magnet,
  Ruler,
  Grid,
  RotateCcw
} from 'lucide-react';

interface FloatingToolsProps {
  currentTool: ToolType;
  onSelectTool: (tool: ToolType) => void;
  transform: Transform;
  onUpdateTransform: (updater: (prev: Transform) => Transform) => void;
  snapToGrid: boolean;
  onToggleSnap: () => void;
  showRulers: boolean;
  onToggleRulers: () => void;
  showGridLines: boolean;
  onToggleGridLines: () => void;
  onFitToScreen: () => void;
  onResetZoom: () => void;
}

export const FloatingTools: React.FC<FloatingToolsProps> = ({
  currentTool,
  onSelectTool,
  transform,
  onUpdateTransform,
  snapToGrid,
  onToggleSnap,
  showRulers,
  onToggleRulers,
  showGridLines,
  onToggleGridLines,
  onFitToScreen,
  onResetZoom
}) => {
  const tools: { id: ToolType; label: string; icon: React.ReactNode; shortcut: string }[] = [
    { id: 'select', label: 'Выбор (V)', icon: <MousePointer className="w-4 h-4" />, shortcut: 'V' },
    { id: 'pan', label: 'Рука (H)', icon: <Hand className="w-4 h-4" />, shortcut: 'H' },
    { id: 'rect', label: 'Квадрат / Рамка Доты', icon: <Square className="w-4 h-4" />, shortcut: 'R' },
    { id: 'line', label: 'Палочка / Линия', icon: <ArrowUpRight className="w-4 h-4" />, shortcut: 'L' },
    { id: 'text', label: 'Текст / Плашка', icon: <Type className="w-4 h-4" />, shortcut: 'T' },
    { id: 'icon', label: 'Символы & Звёзды', icon: <Smile className="w-4 h-4" />, shortcut: 'S' },
    { id: 'circle', label: 'Круг', icon: <Circle className="w-4 h-4" />, shortcut: 'O' },
    { id: 'brush', label: 'Карандаш', icon: <PenTool className="w-4 h-4" />, shortcut: 'P' }
  ];

  const zoomPercent = Math.round(transform.zoom * 100);

  const handleZoomIn = () => {
    onUpdateTransform((prev) => ({
      ...prev,
      zoom: Math.min(4, prev.zoom * 1.15)
    }));
  };

  const handleZoomOut = () => {
    onUpdateTransform((prev) => ({
      ...prev,
      zoom: Math.max(0.2, prev.zoom / 1.15)
    }));
  };

  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 p-1 bg-[#101522]/95 backdrop-blur-md border border-[#232F42] rounded-lg shadow-2xl shadow-black/90 select-none">
      {/* Tool Selection Buttons */}
      <div className="flex items-center gap-0.5">
        {tools.map((t) => {
          const isActive = currentTool === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onSelectTool(t.id)}
              title={`${t.label} (${t.shortcut})`}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-black shadow-md shadow-amber-950/40'
                  : 'text-[#94A3B8] hover:text-white hover:bg-[#1E293B]'
              }`}
            >
              {t.icon}
              <span className="hidden sm:inline">{t.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      <div className="w-px h-5 bg-[#232F42] mx-1" />

      {/* Snap & Helpers */}
      <div className="flex items-center gap-0.5">
        <button
          onClick={onToggleSnap}
          title={snapToGrid ? 'Snap to Slots: ON' : 'Snap to Slots: OFF'}
          className={`p-1.5 rounded transition-colors ${
            snapToGrid
              ? 'text-[#38BDF8] bg-[#38BDF8]/15 border border-[#38BDF8]/40 shadow-sm'
              : 'text-[#64748B] hover:text-white hover:bg-[#1E293B]'
          }`}
        >
          <Magnet className="w-4 h-4" />
        </button>

        <button
          onClick={onToggleGridLines}
          title={showGridLines ? 'Canvas Grid: ON' : 'Canvas Grid: OFF'}
          className={`p-1.5 rounded transition-colors ${
            showGridLines
              ? 'text-[#38BDF8] bg-[#38BDF8]/15 border border-[#38BDF8]/40 shadow-sm'
              : 'text-[#64748B] hover:text-white hover:bg-[#1E293B]'
          }`}
        >
          <Grid className="w-4 h-4" />
        </button>

        <button
          onClick={onToggleRulers}
          title={showRulers ? 'Rulers: ON' : 'Rulers: OFF'}
          className={`p-1.5 rounded transition-colors ${
            showRulers
              ? 'text-[#38BDF8] bg-[#38BDF8]/15 border border-[#38BDF8]/40 shadow-sm'
              : 'text-[#64748B] hover:text-white hover:bg-[#1E293B]'
          }`}
        >
          <Ruler className="w-4 h-4" />
        </button>
      </div>

      <div className="w-px h-5 bg-[#232F42] mx-1" />

      {/* Zoom Controls */}
      <div className="flex items-center gap-1 text-[#94A3B8]">
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="p-1.5 hover:text-white hover:bg-[#1E293B] rounded transition-colors"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onResetZoom}
          title="Reset Zoom to 100%"
          className="px-1.5 py-0.5 text-[11px] font-mono hover:text-white hover:bg-[#1E293B] rounded transition-colors"
        >
          {zoomPercent}%
        </button>

        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="p-1.5 hover:text-white hover:bg-[#1E293B] rounded transition-colors"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onFitToScreen}
          title="Fit Canvas to Screen (F)"
          className="p-1.5 hover:text-[#F59E0B] hover:bg-[#1E293B] rounded transition-colors"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

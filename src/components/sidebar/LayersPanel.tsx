import React from 'react';
import { ProjectState, CanvasItem } from '../../types/dota';
import {
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Type,
  Square,
  Circle,
  ArrowUpRight,
  PenTool,
  Image as ImageIcon,
  Grid,
  ShieldAlert,
  Smile
} from 'lucide-react';

interface LayersPanelProps {
  project: ProjectState;
  onUpdateProject: (updater: (prev: ProjectState) => ProjectState) => void;
  selectedItemIds: string[];
  onSelectItemId: (id: string, multi?: boolean) => void;
}

export const LayersPanel: React.FC<LayersPanelProps> = ({
  project,
  onUpdateProject,
  selectedItemIds,
  onSelectItemId
}) => {
  const getItemIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <Type className="w-3.5 h-3.5 text-amber-400" />;
      case 'rect':
        return <Square className="w-3.5 h-3.5 text-blue-400" />;
      case 'circle':
        return <Circle className="w-3.5 h-3.5 text-emerald-400" />;
      case 'line':
        return <ArrowUpRight className="w-3.5 h-3.5 text-rose-400" />;
      case 'brush':
        return <PenTool className="w-3.5 h-3.5 text-purple-400" />;
      case 'icon':
        return <Smile className="w-3.5 h-3.5 text-yellow-400" />;
      case 'image':
        return <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />;
      default:
        return <Square className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const handleToggleVisible = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateProject((prev) => ({
      ...prev,
      items: prev.items.map((it) => (it.id === itemId ? { ...it, visible: !it.visible } : it))
    }));
  };

  const handleToggleLock = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateProject((prev) => ({
      ...prev,
      items: prev.items.map((it) => (it.id === itemId ? { ...it, locked: !it.locked } : it))
    }));
  };

  const handleDeleteItem = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateProject((prev) => ({
      ...prev,
      items: prev.items.filter((it) => it.id !== itemId)
    }));
  };

  const handleDuplicateItem = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const item = project.items.find((it) => it.id === itemId);
    if (!item) return;

    const newItem: CanvasItem = {
      ...item,
      id: 'item_' + Date.now(),
      name: `${item.name} (Copy)`,
      x: item.x + 20,
      y: item.y + 20,
      zIndex: (item.zIndex || 0) + 1
    };

    onUpdateProject((prev) => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
    onSelectItemId(newItem.id);
  };

  const handleMoveZIndex = (itemId: string, direction: 'up' | 'down', e: React.MouseEvent) => {
    e.stopPropagation();
    const index = project.items.findIndex((it) => it.id === itemId);
    if (index === -1) return;

    const newItems = [...project.items];
    if (direction === 'up' && index < newItems.length - 1) {
      const temp = newItems[index];
      newItems[index] = newItems[index + 1];
      newItems[index + 1] = temp;
    } else if (direction === 'down' && index > 0) {
      const temp = newItems[index];
      newItems[index] = newItems[index - 1];
      newItems[index - 1] = temp;
    }

    onUpdateProject((prev) => ({
      ...prev,
      items: newItems
    }));
  };

  return (
    <div className="flex flex-col h-full select-none font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="px-3 py-2 border-b border-[#1E293B] flex items-center justify-between text-xs font-semibold text-[#F1F5F9] bg-[#0B0E15] font-['Cinzel']">
        <span>LAYERS ({project.items.length + project.grids.length + (project.background.imageUrl ? 1 : 0)})</span>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1.5 custom-scrollbar bg-[#0E121A]">
        {/* Grids Fixed Layers */}
        {project.grids.map((grid) => (
          <div
            key={grid.id}
            className="flex items-center justify-between px-2.5 py-1.5 rounded bg-[#121824] border border-[#202B3D] text-xs text-[#E2E8F0]"
          >
            <div className="flex items-center gap-2 truncate">
              {grid.isBanGrid ? (
                <ShieldAlert className="w-3.5 h-3.5 text-red-400 shrink-0" />
              ) : (
                <Grid className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
              )}
              <span className="truncate font-medium">{grid.name}</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  onUpdateProject((prev) => ({
                    ...prev,
                    grids: prev.grids.map((g) => (g.id === grid.id ? { ...g, visible: !g.visible } : g))
                  }))
                }
                className="p-1 hover:bg-[#1E293B] text-[#94A3B8] hover:text-white rounded"
              >
                {grid.visible ? <Eye className="w-3 h-3 text-[#38BDF8]" /> : <EyeOff className="w-3 h-3 text-[#64748B]" />}
              </button>
              <button
                onClick={() =>
                  onUpdateProject((prev) => ({
                    ...prev,
                    grids: prev.grids.map((g) => (g.id === grid.id ? { ...g, locked: !g.locked } : g))
                  }))
                }
                className={`p-1 rounded ${grid.locked ? 'text-[#F59E0B]' : 'text-[#94A3B8] hover:text-white'}`}
              >
                {grid.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
              </button>
            </div>
          </div>
        ))}

        {/* Dynamic Vector/Text Items (Reversed to show top on top) */}
        {[...project.items].reverse().map((item) => {
          const isSelected = selectedItemIds.includes(item.id);
          return (
            <div
              key={item.id}
              onClick={(e) => onSelectItemId(item.id, e.shiftKey || e.ctrlKey)}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded border text-xs cursor-pointer transition-colors ${
                isSelected
                  ? 'bg-[#1A2333] border-[#F59E0B] text-white shadow-sm'
                  : 'bg-[#121824] border-[#202B3D] text-[#CBD5E1] hover:bg-[#1A2333]'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                {getItemIcon(item.type)}
                <span className="truncate font-medium">
                  {item.name || (item.type === 'text' ? item.text?.slice(0, 16) : item.type)}
                </span>
              </div>

              <div className="flex items-center gap-0.5 shrink-0">
                <button
                  onClick={(e) => handleMoveZIndex(item.id, 'up', e)}
                  title="Bring Forward"
                  className="p-1 hover:bg-[#1E293B] text-[#94A3B8] hover:text-white rounded"
                >
                  <ChevronUp className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => handleMoveZIndex(item.id, 'down', e)}
                  title="Send Backward"
                  className="p-1 hover:bg-[#1E293B] text-[#94A3B8] hover:text-white rounded"
                >
                  <ChevronDown className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => handleToggleVisible(item.id, e)}
                  className="p-1 hover:bg-[#1E293B] text-[#94A3B8] hover:text-white rounded"
                >
                  {item.visible ? <Eye className="w-3 h-3 text-[#38BDF8]" /> : <EyeOff className="w-3 h-3 text-[#64748B]" />}
                </button>
                <button
                  onClick={(e) => handleToggleLock(item.id, e)}
                  className={`p-1 rounded ${item.locked ? 'text-[#F59E0B]' : 'text-[#94A3B8] hover:text-white'}`}
                >
                  {item.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                </button>
                <button
                  onClick={(e) => handleDuplicateItem(item.id, e)}
                  title="Duplicate (Ctrl+D)"
                  className="p-1 hover:bg-[#1E293B] text-[#94A3B8] hover:text-white rounded"
                >
                  <Copy className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => handleDeleteItem(item.id, e)}
                  title="Delete"
                  className="p-1 hover:bg-red-950/40 text-red-400 hover:text-red-300 rounded"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}

        {/* Background Layer */}
        {project.background.imageUrl && (
          <div className="flex items-center justify-between px-2.5 py-1.5 rounded bg-[#0E121A] border border-[#1E293B] text-xs text-[#94A3B8]">
            <div className="flex items-center gap-2 truncate">
              <ImageIcon className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span className="truncate">Background Image</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  onUpdateProject((prev) => ({
                    ...prev,
                    background: { ...prev.background, visible: !prev.background.visible }
                  }))
                }
                className="p-1 text-[#94A3B8] hover:text-white rounded"
              >
                {project.background.visible ? <Eye className="w-3 h-3 text-[#38BDF8]" /> : <EyeOff className="w-3 h-3 text-[#64748B]" />}
              </button>
              <button
                onClick={() =>
                  onUpdateProject((prev) => ({
                    ...prev,
                    background: { ...prev.background, locked: !prev.background.locked }
                  }))
                }
                className={`p-1 rounded ${project.background.locked ? 'text-[#F59E0B]' : 'text-[#94A3B8]'}`}
              >
                {project.background.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { DotaHero, ProjectState, HeroAttribute } from '../../types/dota';
import { DOTA_HEROES, ATTR_COLORS, getHeroImageUrl } from '../../data/dotaHeroes';
import { autoFillGrid } from '../../utils/gridUtils';
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Sparkles,
  Trash2,
  ArrowUpDown,
  Layers,
  ChevronDown
} from 'lucide-react';

interface HeroSidebarProps {
  project: ProjectState;
  onUpdateProject: (updater: (prev: ProjectState) => ProjectState) => void;
  selectedSlotInfo: { gridId: string; slotId: string } | null;
  onAssignHeroToSelectedSlot: (heroId: number) => void;
  onDragStartHero: (hero: DotaHero) => void;
}

export const HeroSidebar: React.FC<HeroSidebarProps> = ({
  project,
  onUpdateProject,
  selectedSlotInfo,
  onAssignHeroToSelectedSlot,
  onDragStartHero
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAttr, setSelectedAttr] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unassigned' | 'assigned'>('all');
  const [showAutoFillMenu, setShowAutoFillMenu] = useState(false);

  // Set of currently assigned hero IDs across all grids
  const assignedHeroIds = useMemo(() => {
    const ids = new Set<number>();
    project.grids.forEach((grid) => {
      grid.slots.forEach((slot) => {
        if (slot.heroId) ids.add(slot.heroId);
      });
    });
    return ids;
  }, [project.grids]);

  // Filtered heroes list
  const filteredHeroes = useMemo(() => {
    return DOTA_HEROES.filter((hero) => {
      // Attribute filter
      if (selectedAttr !== 'all') {
        if (selectedAttr === 'uni' && hero.primaryAttr !== 'all') return false;
        if (selectedAttr !== 'uni' && hero.primaryAttr !== selectedAttr) return false;
      }

      // Role filter
      if (selectedRole !== 'all' && !hero.roles.includes(selectedRole)) {
        return false;
      }

      // Status filter
      if (statusFilter === 'unassigned' && assignedHeroIds.has(hero.id)) return false;
      if (statusFilter === 'assigned' && !assignedHeroIds.has(hero.id)) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = hero.displayName.toLowerCase().includes(q);
        const matchesShort = hero.shortName.toLowerCase().includes(q);
        const matchesRoles = hero.roles.some((r) => r.toLowerCase().includes(q));
        return matchesName || matchesShort || matchesRoles;
      }

      return true;
    });
  }, [searchQuery, selectedAttr, selectedRole, statusFilter, assignedHeroIds]);

  const handleAutoFill = (type: 'alphabetical' | 'attribute' | 'clear' | 'roles') => {
    onUpdateProject((prev) => {
      const nextGrids = prev.grids.map((grid, idx) => {
        if (idx === 0) {
          // Main Grid
          return {
            ...grid,
            slots: autoFillGrid(grid, type)
          };
        }
        return grid;
      });
      return { ...prev, grids: nextGrids };
    });
    setShowAutoFillMenu(false);
  };

  const handleFillBans = () => {
    // Fill ban slots with popular meta disruptors (e.g. Tinker, Arc Warden, Meepo, Broodmother, Techies, Pudge, etc.)
    const banMetaHeroIds = [34, 113, 82, 61, 105, 14, 10, 74, 1, 88];
    onUpdateProject((prev) => {
      const nextGrids = prev.grids.map((grid) => {
        if (grid.isBanGrid) {
          const slots = grid.slots.map((s, i) => ({
            ...s,
            heroId: i < banMetaHeroIds.length ? banMetaHeroIds[i] : null
          }));
          return { ...grid, slots };
        }
        return grid;
      });
      return { ...prev, grids: nextGrids };
    });
    setShowAutoFillMenu(false);
  };

  return (
    <aside className="w-72 bg-[#0E121A] border-r border-[#1E293B] flex flex-col h-full select-none z-20 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <div className="p-3 border-b border-[#1E293B] flex items-center justify-between bg-[#0B0E15]">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-xs text-[#F1F5F9] tracking-wider font-['Cinzel']">HERO ROSTER</span>
          <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-[#161F30] text-[#F59E0B] border border-[#2B3A52]">
            {filteredHeroes.length} / {DOTA_HEROES.length}
          </span>
        </div>

        {/* Auto Fill Quick Menu */}
        <div className="relative">
          <button
            onClick={() => setShowAutoFillMenu(!showAutoFillMenu)}
            className="flex items-center gap-1 text-[11px] font-medium px-2 py-1 bg-[#161F30] hover:bg-[#202B3D] text-[#E2E8F0] border border-[#2B3A52] rounded transition-colors"
          >
            <Sparkles className="w-3 h-3 text-[#F59E0B]" />
            <span>Auto-Fill</span>
            <ChevronDown className="w-3 h-3 text-[#64748B]" />
          </button>

          {showAutoFillMenu && (
            <div className="absolute right-0 top-full mt-1 w-52 bg-[#121824] border border-[#2B3A52] rounded-lg shadow-2xl shadow-black/95 py-1 z-50">
              <button
                onClick={() => handleAutoFill('alphabetical')}
                className="w-full text-left px-3 py-1.5 text-xs text-[#E2E8F0] hover:bg-[#1E293B] flex items-center gap-2"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Fill Alphabetical (A-Z)</span>
              </button>
              <button
                onClick={() => handleAutoFill('attribute')}
                className="w-full text-left px-3 py-1.5 text-xs text-[#E2E8F0] hover:bg-[#1E293B] flex items-center gap-2"
              >
                <Layers className="w-3.5 h-3.5 text-[#4ADE80]" />
                <span>Fill by Attribute (STR/AGI/INT/UNI)</span>
              </button>
              <button
                onClick={() => handleAutoFill('roles')}
                className="w-full text-left px-3 py-1.5 text-xs text-[#E2E8F0] hover:bg-[#1E293B] flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C084FC]" />
                <span>Fill by Role Priority</span>
              </button>
              <button
                onClick={handleFillBans}
                className="w-full text-left px-3 py-1.5 text-xs text-red-400 hover:bg-red-950/40 flex items-center gap-2 border-t border-[#1E293B]"
              >
                <span className="text-red-400 font-bold">🚫</span>
                <span>Auto-Fill 10 Meta Bans</span>
              </button>
              <button
                onClick={() => handleAutoFill('clear')}
                className="w-full text-left px-3 py-1.5 text-xs text-red-400 hover:bg-red-950/40 flex items-center gap-2 border-t border-[#1E293B]"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All Slots</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-2.5 border-b border-[#1E293B] bg-[#0E121A]">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hero or role..."
            className="w-full bg-[#121824] border border-[#202B3D] focus:border-[#F59E0B] text-xs text-[#E2E8F0] pl-8 pr-7 py-1.5 rounded outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#E2E8F0]"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Attribute Pill Filters */}
      <div className="px-2.5 py-2 border-b border-[#1E293B] flex gap-1 bg-[#0B0E15]">
        <button
          onClick={() => setSelectedAttr('all')}
          className={`flex-1 py-1 text-[11px] font-semibold rounded border transition-all ${
            selectedAttr === 'all'
              ? 'bg-[#1E293B] text-[#F59E0B] border-[#F59E0B]/50 shadow-sm'
              : 'bg-[#121824] text-[#94A3B8] border-[#202B3D] hover:text-[#E2E8F0]'
          }`}
        >
          ALL
        </button>
        <button
          onClick={() => setSelectedAttr('str')}
          className={`flex-1 py-1 text-[11px] font-semibold rounded border transition-all ${
            selectedAttr === 'str'
              ? 'bg-[#3A1418] text-[#FCA5A5] border-[#EF4444] shadow-sm shadow-red-950/50'
              : 'bg-[#121824] text-[#E07A7A]/70 border-[#202B3D] hover:text-[#FCA5A5]'
          }`}
        >
          STR
        </button>
        <button
          onClick={() => setSelectedAttr('agi')}
          className={`flex-1 py-1 text-[11px] font-semibold rounded border transition-all ${
            selectedAttr === 'agi'
              ? 'bg-[#12301A] text-[#86EFAC] border-[#22C55E] shadow-sm shadow-green-950/50'
              : 'bg-[#121824] text-[#4ADE80]/70 border-[#202B3D] hover:text-[#86EFAC]'
          }`}
        >
          AGI
        </button>
        <button
          onClick={() => setSelectedAttr('int')}
          className={`flex-1 py-1 text-[11px] font-semibold rounded border transition-all ${
            selectedAttr === 'int'
              ? 'bg-[#102D3D] text-[#7DD3FC] border-[#06B6D4] shadow-sm shadow-cyan-950/50'
              : 'bg-[#121824] text-[#38BDF8]/70 border-[#202B3D] hover:text-[#7DD3FC]'
          }`}
        >
          INT
        </button>
        <button
          onClick={() => setSelectedAttr('uni')}
          className={`flex-1 py-1 text-[11px] font-semibold rounded border transition-all ${
            selectedAttr === 'uni'
              ? 'bg-[#2E1538] text-[#D8B4FE] border-[#A855F7] shadow-sm shadow-purple-950/50'
              : 'bg-[#121824] text-[#C084FC]/70 border-[#202B3D] hover:text-[#D8B4FE]'
          }`}
        >
          UNI
        </button>
      </div>

      {/* Role Filter & Status Bar */}
      <div className="px-2.5 py-1.5 border-b border-[#1E293B] flex items-center justify-between text-[10px] text-[#94A3B8] bg-[#0E121A]">
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="bg-[#121824] border border-[#202B3D] text-[#CBD5E1] rounded px-1.5 py-0.5 outline-none text-[10px]"
        >
          <option value="all">All Roles</option>
          <option value="Carry">Carry</option>
          <option value="Support">Support</option>
          <option value="Initiator">Initiator</option>
          <option value="Disabler">Disabler</option>
          <option value="Durable">Durable / Tank</option>
          <option value="Nuker">Nuker</option>
          <option value="Escape">Escape</option>
          <option value="Pusher">Pusher</option>
        </select>

        <div className="flex items-center gap-1">
          <button
            onClick={() =>
              setStatusFilter((prev) =>
                prev === 'all' ? 'unassigned' : prev === 'unassigned' ? 'assigned' : 'all'
              )
            }
            className="hover:text-[#F59E0B] underline decoration-[#334155]"
          >
            {statusFilter === 'all'
              ? 'All State'
              : statusFilter === 'unassigned'
              ? 'Unassigned Only'
              : 'Assigned Only'}
          </button>
        </div>
      </div>

      {/* Hero Grid Cards List */}
      <div className="flex-1 overflow-y-auto p-2 grid grid-cols-4 gap-1.5 content-start custom-scrollbar bg-[#0E121A]">
        {filteredHeroes.map((hero) => {
          const isAssigned = assignedHeroIds.has(hero.id);
          const attr = ATTR_COLORS[hero.primaryAttr];

          return (
            <div
              key={hero.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', hero.id.toString());
                onDragStartHero(hero);
              }}
              onClick={() => {
                if (selectedSlotInfo) {
                  onAssignHeroToSelectedSlot(hero.id);
                }
              }}
              title={`${hero.displayName} (${attr.name})\nRoles: ${hero.roles.join(', ')}\nDrag to canvas slot or click to assign!`}
              className={`group relative aspect-[16/10] bg-[#121824] border rounded overflow-hidden cursor-grab active:cursor-grabbing hover:scale-105 hover:z-20 transition-all shadow-sm ${
                isAssigned
                  ? 'border-[#334155] opacity-75'
                  : 'border-[#202B3D] hover:border-[#F59E0B]'
              }`}
            >
              <img
                src={getHeroImageUrl(hero.shortName)}
                alt={hero.displayName}
                className="w-full h-full object-cover pointer-events-none"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />

              {/* Attribute Color Pip */}
              <div
                className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full shadow-sm"
                style={{ backgroundColor: attr.bg }}
              />

              {/* Hero Label Overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent pt-3 pb-0.5 px-0.5 text-center">
                <span className="block text-[8px] font-medium text-[#F1F5F9] truncate leading-tight">
                  {hero.displayName}
                </span>
              </div>

              {/* Assigned Checkmark Badge */}
              {isAssigned && (
                <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-[#22C55E] text-black flex items-center justify-center text-[7px] font-bold shadow">
                  ✓
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};

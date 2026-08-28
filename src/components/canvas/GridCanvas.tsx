import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  ProjectState,
  Transform,
  ToolType,
  CanvasItem,
  GridSlot,
  DotaHero
} from '../../types/dota';
import { CanvasRenderer } from '../../utils/canvasRenderer';
import { findSnapSlot } from '../../utils/gridUtils';
import { HEROES_BY_ID } from '../../data/dotaHeroes';

interface GridCanvasProps {
  project: ProjectState;
  onUpdateProject: (updater: (prev: ProjectState) => ProjectState) => void;
  transform: Transform;
  onUpdateTransform: (updater: (prev: Transform) => Transform) => void;
  currentTool: ToolType;
  selectedItemIds: string[];
  onSelectItemId: (id: string | null, multi?: boolean) => void;
  onSelectMultipleItemIds?: (ids: string[], additive?: boolean) => void;
  selectedSlotInfo: { gridId: string; slotId: string } | null;
  onSelectSlot: (slotInfo: { gridId: string; slotId: string } | null) => void;
  draggingHeroFromSidebar: DotaHero | null;
  onClearDraggingHero: () => void;
}

export const GridCanvas: React.FC<GridCanvasProps> = ({
  project,
  onUpdateProject,
  transform,
  onUpdateTransform,
  currentTool,
  selectedItemIds,
  onSelectItemId,
  onSelectMultipleItemIds,
  selectedSlotInfo,
  onSelectSlot,
  draggingHeroFromSidebar,
  onClearDraggingHero
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<CanvasRenderer>(new CanvasRenderer());

  // Global clipboard for items
  const clipboardRef = useRef<CanvasItem[]>([]);
  const lastMouseCanvasPos = useRef<{ x: number; y: number }>({ x: 960, y: 540 });

  // Floating feedback Toast
  const [toast, setToast] = useState<{ text: string; icon?: string } | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);

  const showBriefToast = useCallback((text: string, icon?: string) => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast({ text, icon });
    toastTimeoutRef.current = window.setTimeout(() => {
      setToast(null);
    }, 2200);
  }, []);

  const [hoveredSlot, setHoveredSlot] = useState<{ gridId: string; slot: GridSlot } | null>(null);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [isCtrlPressed, setIsCtrlPressed] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  // Dragging state
  const interactionState = useRef<{
    mode: 'none' | 'pan' | 'move_item' | 'resize_item' | 'rotate_item' | 'draw' | 'marquee' | 'drag_slot_hero';
    startX: number;
    startY: number;
    canvasStartX: number;
    canvasStartY: number;
    activeHandle?: string;
    itemInitialProps?: { [id: string]: { x: number; y: number; width: number; height: number; rotation: number } };
    drawingItem?: CanvasItem | null;
    sourceSlot?: { gridId: string; slot: GridSlot } | null;
    draggingHero?: DotaHero | null;
  }>({
    mode: 'none',
    startX: 0,
    startY: 0,
    canvasStartX: 0,
    canvasStartY: 0
  });

  const [marqueeBox, setMarqueeBox] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);
  const [activeDraggingHero, setActiveDraggingHero] = useState<{ hero: DotaHero; mouseX: number; mouseY: number } | null>(null);

  // Re-render loop trigger
  const requestRender = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    rendererRef.current.render(
      ctx,
      project,
      transform,
      canvas.width,
      canvas.height,
      selectedItemIds,
      selectedSlotInfo,
      hoveredSlot,
      activeDraggingHero,
      marqueeBox,
      () => requestRender()
    );
  }, [project, transform, selectedItemIds, selectedSlotInfo, hoveredSlot, activeDraggingHero, marqueeBox]);

  useEffect(() => {
    requestRender();
  }, [requestRender]);

  // Handle Canvas Resize
  useEffect(() => {
    const updateSize = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      requestRender();
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [requestRender]);

  // Keyboard Copy / Paste / Cut / Duplicate / Delete / Arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      if (e.code === 'Space' && !isSpacePressed) {
        setIsSpacePressed(true);
      }

      if ((e.key === 'Control' || e.key === 'Meta') && !isCtrlPressed) {
        setIsCtrlPressed(true);
      }

      const isCtrlOrMeta = e.ctrlKey || e.metaKey;

      // 1. CTRL + C (Copy selected items)
      if (isCtrlOrMeta && e.key.toLowerCase() === 'c') {
        if (selectedItemIds.length > 0) {
          e.preventDefault();
          const itemsToCopy = project.items
            .filter((it) => selectedItemIds.includes(it.id))
            .map((it) => JSON.parse(JSON.stringify(it)));

          clipboardRef.current = itemsToCopy;

          // Copy plain text if single text/symbol
          try {
            const textContent = itemsToCopy
              .map((it) => it.text || it.iconChar || it.name)
              .filter(Boolean)
              .join('\n');
            if (textContent) {
              navigator.clipboard?.writeText(textContent);
            }
          } catch (err) {
            // Ignored if permissions blocked
          }

          showBriefToast(`📋 Скопировано ${itemsToCopy.length} объектов (Ctrl+V для вставки)`);
          return;
        }
      }

      // 2. CTRL + V (Paste copied items)
      if (isCtrlOrMeta && e.key.toLowerCase() === 'v') {
        if (clipboardRef.current.length > 0) {
          e.preventDefault();
          const newItems: CanvasItem[] = [];
          const newIds: string[] = [];

          // Compute center or offset
          const offset = 24;
          clipboardRef.current.forEach((item, index) => {
            const newId = 'item_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7) + '_' + index;
            const pastedItem: CanvasItem = {
              ...item,
              id: newId,
              name: `${item.name} (Копия)`,
              x: item.x + offset,
              y: item.y + offset,
              zIndex: (item.zIndex || project.items.length) + 10
            };
            newItems.push(pastedItem);
            newIds.push(newId);
          });

          // Update clipboard with shifted coordinates for repeated pasting
          clipboardRef.current = newItems.map((it) => JSON.parse(JSON.stringify(it)));

          onUpdateProject((prev) => ({
            ...prev,
            items: [...prev.items, ...newItems]
          }));

          if (onSelectMultipleItemIds) {
            onSelectMultipleItemIds(newIds, false);
          } else if (newIds[0]) {
            onSelectItemId(newIds[0]);
          }

          showBriefToast(`📥 Вставлено ${newItems.length} объектов`);
          return;
        }
      }

      // 3. CTRL + X (Cut selected items)
      if (isCtrlOrMeta && e.key.toLowerCase() === 'x') {
        if (selectedItemIds.length > 0) {
          e.preventDefault();
          const itemsToCut = project.items
            .filter((it) => selectedItemIds.includes(it.id))
            .map((it) => JSON.parse(JSON.stringify(it)));

          clipboardRef.current = itemsToCut;
          onUpdateProject((prev) => ({
            ...prev,
            items: prev.items.filter((it) => !selectedItemIds.includes(it.id))
          }));
          onSelectItemId(null);
          showBriefToast(`✂️ Вырезано ${itemsToCut.length} объектов`);
          return;
        }
      }

      // 4. CTRL + A (Select All Canvas Items)
      if (isCtrlOrMeta && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        const allItemIds = project.items.filter((it) => it.visible && !it.locked).map((it) => it.id);
        if (allItemIds.length > 0) {
          if (onSelectMultipleItemIds) {
            onSelectMultipleItemIds(allItemIds, false);
          } else {
            onSelectItemId(allItemIds[0]);
          }
          showBriefToast(`Выделены все объекты (${allItemIds.length})`);
        }
        return;
      }

      // 5. CTRL + D (Duplicate selected items)
      if (isCtrlOrMeta && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        if (selectedItemIds.length > 0) {
          const newItems: CanvasItem[] = [];
          const newIds: string[] = [];

          project.items.forEach((item) => {
            if (selectedItemIds.includes(item.id)) {
              const duplicated: CanvasItem = {
                ...item,
                id: 'item_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
                name: `${item.name} (Копия)`,
                x: item.x + 20,
                y: item.y + 20,
                zIndex: (item.zIndex || 0) + 1
              };
              newItems.push(duplicated);
              newIds.push(duplicated.id);
            }
          });

          onUpdateProject((prev) => ({
            ...prev,
            items: [...prev.items, ...newItems]
          }));

          if (onSelectMultipleItemIds) {
            onSelectMultipleItemIds(newIds, false);
          } else if (newIds[0]) {
            onSelectItemId(newIds[0]);
          }
          showBriefToast(`📑 Продублировано ${newItems.length} объектов`);
          return;
        }
      }

      // 6. Delete / Backspace
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedItemIds.length > 0) {
          e.preventDefault();
          const count = selectedItemIds.length;
          onUpdateProject((prev) => ({
            ...prev,
            items: prev.items.filter((it) => !selectedItemIds.includes(it.id))
          }));
          onSelectItemId(null);
          showBriefToast(`🗑️ Удалено ${count} объектов`);
        } else if (selectedSlotInfo) {
          e.preventDefault();
          onUpdateProject((prev) => ({
            ...prev,
            grids: prev.grids.map((g) =>
              g.id === selectedSlotInfo.gridId
                ? { ...g, slots: g.slots.map((s) => (s.id === selectedSlotInfo.slotId ? { ...s, heroId: null } : s)) }
                : g
            )
          }));
        }
        return;
      }

      // 7. Arrow keys for collective shifting
      if (
        (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') &&
        selectedItemIds.length > 0
      ) {
        e.preventDefault();
        const step = e.ctrlKey && e.shiftKey ? 50 : e.shiftKey ? 10 : 1;
        let dx = 0;
        let dy = 0;
        if (e.key === 'ArrowUp') dy = -step;
        if (e.key === 'ArrowDown') dy = step;
        if (e.key === 'ArrowLeft') dx = -step;
        if (e.key === 'ArrowRight') dx = step;

        onUpdateProject((prev) => ({
          ...prev,
          items: prev.items.map((it) => {
            if (selectedItemIds.includes(it.id) && !it.locked) {
              return { ...it, x: it.x + dx, y: it.y + dy };
            }
            return it;
          })
        }));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
      }
      if (e.key === 'Control' || e.key === 'Meta') {
        setIsCtrlPressed(false);
      }
    };

    const handleWindowBlur = () => {
      setIsSpacePressed(false);
      setIsCtrlPressed(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleWindowBlur);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [
    isSpacePressed,
    isCtrlPressed,
    selectedItemIds,
    selectedSlotInfo,
    project.items,
    onUpdateProject,
    onSelectItemId,
    onSelectMultipleItemIds,
    showBriefToast
  ]);

  // Coordinate Conversion Helpers
  const screenToCanvas = (screenX: number, screenY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const x = (screenX - rect.left - transform.x) / transform.zoom;
    const y = (screenY - rect.top - transform.y) / transform.zoom;
    return { x, y };
  };

  // Mouse Wheel Zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseScreenX = e.clientX - rect.left;
    const mouseScreenY = e.clientY - rect.top;

    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.89;
    const newZoom = Math.max(0.15, Math.min(5, transform.zoom * zoomFactor));

    // Zoom centered around mouse position
    const newX = mouseScreenX - (mouseScreenX - transform.x) * (newZoom / transform.zoom);
    const newY = mouseScreenY - (mouseScreenY - transform.y) * (newZoom / transform.zoom);

    onUpdateTransform(() => ({
      x: newX,
      y: newY,
      zoom: newZoom
    }));
  };

  // Pointer Down Handler
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 2) return; // Right click handled separately

    const { x: cX, y: cY } = screenToCanvas(e.clientX, e.clientY);
    const isPanAction =
      currentTool === 'pan' ||
      isSpacePressed ||
      isCtrlPressed ||
      e.ctrlKey ||
      e.metaKey ||
      e.button === 1;

    if (isPanAction) {
      interactionState.current = {
        mode: 'pan',
        startX: e.clientX - transform.x,
        startY: e.clientY - transform.y,
        canvasStartX: cX,
        canvasStartY: cY
      };
      setIsInteracting(true);
      return;
    }

    // Check if clicked inside a hero slot
    const snapResult = findSnapSlot(project.grids, cX, cY, 0);
    if (snapResult) {
      const { gridId, slot } = snapResult;
      onSelectSlot({ gridId, slotId: slot.id });
      onSelectItemId(null);

      // If slot has hero, initiate slot drag / swap
      if (slot.heroId) {
        const hero = HEROES_BY_ID.get(slot.heroId);
        if (hero) {
          interactionState.current = {
            mode: 'drag_slot_hero',
            startX: e.clientX,
            startY: e.clientY,
            canvasStartX: cX,
            canvasStartY: cY,
            sourceSlot: { gridId, slot },
            draggingHero: hero
          };
          setActiveDraggingHero({ hero, mouseX: cX, mouseY: cY });
          setIsInteracting(true);
          return;
        }
      }
      return;
    }

    // Check if clicked a canvas vector item
    const clickedItem = [...project.items]
      .reverse()
      .find((it) => it.visible && !it.locked && cX >= it.x && cX <= it.x + it.width && cY >= it.y && cY <= it.y + it.height);

    if (clickedItem && currentTool === 'select') {
      const isMulti = e.shiftKey || e.ctrlKey;
      let targetIds: string[] = [];

      if (isMulti) {
        // Toggle clicked item in multi selection
        if (selectedItemIds.includes(clickedItem.id)) {
          targetIds = selectedItemIds.filter((id) => id !== clickedItem.id);
          onSelectItemId(clickedItem.id, true);
        } else {
          targetIds = [...selectedItemIds, clickedItem.id];
          if (onSelectMultipleItemIds) {
            onSelectMultipleItemIds(targetIds, false);
          } else {
            onSelectItemId(clickedItem.id, true);
          }
        }
      } else {
        // If item is already selected among others, keep full multi-selection so we can drag all of them together!
        if (selectedItemIds.includes(clickedItem.id)) {
          targetIds = selectedItemIds;
        } else {
          targetIds = [clickedItem.id];
          if (onSelectMultipleItemIds) {
            onSelectMultipleItemIds([clickedItem.id], false);
          } else {
            onSelectItemId(clickedItem.id, false);
          }
        }
      }
      onSelectSlot(null);

      if (targetIds.length > 0) {
        const initialProps: { [id: string]: { x: number; y: number; width: number; height: number; rotation: number } } = {};
        targetIds.forEach((id) => {
          const it = project.items.find((i) => i.id === id);
          if (it) {
            initialProps[id] = {
              x: it.x,
              y: it.y,
              width: it.width,
              height: it.height,
              rotation: it.rotation || 0
            };
          }
        });

        interactionState.current = {
          mode: 'move_item',
          startX: e.clientX,
          startY: e.clientY,
          canvasStartX: cX,
          canvasStartY: cY,
          itemInitialProps: initialProps
        };
        setIsInteracting(true);
        return;
      }
    }

    // If drawing tools active (rect, circle, line, brush, text)
    if (currentTool === 'text') {
      const newItem: CanvasItem = {
        id: 'text_' + Date.now(),
        name: 'Custom Text',
        type: 'text',
        x: cX - 100,
        y: cY - 20,
        width: 200,
        height: 40,
        rotation: 0,
        opacity: 1,
        locked: false,
        visible: true,
        zIndex: project.items.length + 10,
        text: 'DOTA 2 GRID',
        fontSize: 28,
        fontFamily: 'Cinzel, Georgia, serif',
        fontWeight: 'bold',
        textAlign: 'center',
        textColor: '#f59e0b',
        textGlow: 'rgba(245, 158, 11, 0.4)',
        textGlowBlur: 10
      };
      onUpdateProject((prev) => ({ ...prev, items: [...prev.items, newItem] }));
      onSelectItemId(newItem.id);
      return;
    }

    if (currentTool === 'rect' || currentTool === 'circle' || currentTool === 'line') {
      const isRect = currentTool === 'rect';
      const newItem: CanvasItem = {
        id: `${currentTool}_${Date.now()}`,
        name: isRect ? 'Dota Hero Box' : `New ${currentTool.toUpperCase()}`,
        type: currentTool,
        x: cX,
        y: cY,
        width: 1,
        height: 1,
        rotation: 0,
        opacity: 1,
        locked: false,
        visible: true,
        zIndex: project.items.length + 10,
        fill: currentTool === 'line' ? 'transparent' : 'rgba(245, 158, 11, 0.08)',
        stroke: '#F59E0B',
        strokeWidth: 2,
        borderRadius: 4,
        isArrow: currentTool === 'line',
        exportToDota: true,
        dotaCategoryName: isRect ? '[ HERO GROUP ]' : undefined,
        autoCaptureHeroes: isRect ? true : undefined,
        text: isRect ? '┌────────────────────────┐' : currentTool === 'line' ? '────────────────────────────' : undefined
      };

      interactionState.current = {
        mode: 'draw',
        startX: e.clientX,
        startY: e.clientY,
        canvasStartX: cX,
        canvasStartY: cY,
        drawingItem: newItem
      };
      setIsInteracting(true);
      return;
    }

    if (currentTool === 'brush') {
      const newItem: CanvasItem = {
        id: `brush_${Date.now()}`,
        name: 'Freehand Sketch',
        type: 'brush',
        x: cX,
        y: cY,
        width: 1,
        height: 1,
        rotation: 0,
        opacity: 1,
        locked: false,
        visible: true,
        zIndex: project.items.length + 10,
        stroke: '#ef4444',
        strokeWidth: 4,
        path: [{ x: cX, y: cY }]
      };

      interactionState.current = {
        mode: 'draw',
        startX: e.clientX,
        startY: e.clientY,
        canvasStartX: cX,
        canvasStartY: cY,
        drawingItem: newItem
      };
      setIsInteracting(true);
      return;
    }

    // Otherwise, click background: deselect
    onSelectItemId(null);
    onSelectSlot(null);

    // Start Marquee Selection Box
    interactionState.current = {
      mode: 'marquee',
      startX: e.clientX,
      startY: e.clientY,
      canvasStartX: cX,
      canvasStartY: cY
    };
    setMarqueeBox({ x1: cX, y1: cY, x2: cX, y2: cY });
    setIsInteracting(true);
  };

  // Pointer Move Handler
  const handleMouseMove = (e: React.MouseEvent) => {
    const { x: cX, y: cY } = screenToCanvas(e.clientX, e.clientY);
    lastMouseCanvasPos.current = { x: cX, y: cY };

    // Update hovered slot for instant feedback
    const snap = findSnapSlot(project.grids, cX, cY, project.snapThreshold || 18);
    if (snap) {
      if (hoveredSlot?.slot.id !== snap.slot.id) {
        setHoveredSlot(snap);
      }
    } else if (hoveredSlot) {
      setHoveredSlot(null);
    }

    if (!isInteracting) return;

    const state = interactionState.current;

    // 1. Pan
    if (state.mode === 'pan') {
      onUpdateTransform((prev) => ({
        ...prev,
        x: e.clientX - state.startX,
        y: e.clientY - state.startY
      }));
      return;
    }

    // 2. Dragging slot hero
    if (state.mode === 'drag_slot_hero' && state.draggingHero) {
      setActiveDraggingHero({
        hero: state.draggingHero,
        mouseX: cX,
        mouseY: cY
      });
      return;
    }

    // 3. Move items (Collective drag for all selected items)
    if (state.mode === 'move_item' && state.itemInitialProps) {
      const deltaX = cX - state.canvasStartX;
      const deltaY = cY - state.canvasStartY;

      onUpdateProject((prev) => ({
        ...prev,
        items: prev.items.map((it) => {
          const init = state.itemInitialProps?.[it.id];
          if (init) {
            let newX = init.x + deltaX;
            let newY = init.y + deltaY;

            if (project.snapToGrid) {
              newX = Math.round(newX / 8) * 8;
              newY = Math.round(newY / 8) * 8;
            } else {
              newX = Math.round(newX);
              newY = Math.round(newY);
            }

            return {
              ...it,
              x: newX,
              y: newY
            };
          }
          return it;
        })
      }));
      return;
    }

    // 4. Drawing dynamic shapes
    if (state.mode === 'draw' && state.drawingItem) {
      if (state.drawingItem.type === 'brush') {
        state.drawingItem.path?.push({ x: cX, y: cY });
      } else {
        const minX = Math.min(state.canvasStartX, cX);
        const minY = Math.min(state.canvasStartY, cY);
        const w = Math.max(5, Math.abs(cX - state.canvasStartX));
        const h = Math.max(5, Math.abs(cY - state.canvasStartY));

        state.drawingItem.x = minX;
        state.drawingItem.y = minY;
        state.drawingItem.width = w;
        state.drawingItem.height = h;
      }
      requestRender();
      return;
    }

    // 5. Marquee selection
    if (state.mode === 'marquee') {
      setMarqueeBox({
        x1: state.canvasStartX,
        y1: state.canvasStartY,
        x2: cX,
        y2: cY
      });
    }
  };

  // Pointer Up Handler
  const handleMouseUp = (e: React.MouseEvent) => {
    const { x: cX, y: cY } = screenToCanvas(e.clientX, e.clientY);
    const state = interactionState.current;

    // Complete slot hero swap / move or release to freeform card
    if (state.mode === 'drag_slot_hero' && state.sourceSlot && state.draggingHero) {
      const targetSnap = findSnapSlot(project.grids, cX, cY, project.snapThreshold || 20);

      if (targetSnap && targetSnap.slot.id !== state.sourceSlot.slot.id) {
        // Swap or move between slots
        const sourceGridId = state.sourceSlot.gridId;
        const sourceSlotId = state.sourceSlot.slot.id;
        const targetGridId = targetSnap.gridId;
        const targetSlotId = targetSnap.slot.id;

        onUpdateProject((prev) => {
          let sourceHeroId: number | null = null;
          let targetHeroId: number | null = null;

          prev.grids.forEach((g) => {
            if (g.id === sourceGridId) {
              const s = g.slots.find((slot) => slot.id === sourceSlotId);
              if (s) sourceHeroId = s.heroId;
            }
            if (g.id === targetGridId) {
              const s = g.slots.find((slot) => slot.id === targetSlotId);
              if (s) targetHeroId = s.heroId;
            }
          });

          const newGrids = prev.grids.map((grid) => {
            const newSlots = grid.slots.map((slot) => {
              if (grid.id === sourceGridId && slot.id === sourceSlotId) {
                return { ...slot, heroId: targetHeroId };
              }
              if (grid.id === targetGridId && slot.id === targetSlotId) {
                return { ...slot, heroId: sourceHeroId };
              }
              return slot;
            });
            return { ...grid, slots: newSlots };
          });

          return { ...prev, grids: newGrids };
        });
      } else if (!targetSnap) {
        // Dragged outside slot bounds: convert to freeform draggable hero card!
        const sourceGridId = state.sourceSlot.gridId;
        const sourceSlotId = state.sourceSlot.slot.id;
        const hero = state.draggingHero;

        const newFreeHero: CanvasItem = {
          id: `hero_card_${hero.id}_${Date.now()}`,
          name: hero.displayName,
          type: 'hero',
          x: Math.round(cX - 27),
          y: Math.round(cY - 38),
          width: 54,
          height: 76,
          rotation: 0,
          opacity: 1,
          locked: false,
          visible: true,
          zIndex: project.items.length + 10,
          heroId: hero.id,
          fill: '#0E1420',
          stroke: '#38BDF8',
          strokeWidth: 1,
          borderRadius: 4,
          exportToDota: true
        };

        onUpdateProject((prev) => ({
          ...prev,
          grids: prev.grids.map((g) =>
            g.id === sourceGridId
              ? { ...g, slots: g.slots.map((s) => (s.id === sourceSlotId ? { ...s, heroId: null } : s)) }
              : g
          ),
          items: [...prev.items, newFreeHero]
        }));
        onSelectItemId(newFreeHero.id);
        showBriefToast(`✨ Герой ${hero.displayName} перемещён в свободную карточку`);
      }
      setActiveDraggingHero(null);
    }

    // Complete drawing shape
    if (state.mode === 'draw' && state.drawingItem) {
      const item = state.drawingItem;
      onUpdateProject((prev) => ({
        ...prev,
        items: [...prev.items, item]
      }));
      onSelectItemId(item.id);
    }

    // Complete marquee selection
    if (state.mode === 'marquee' && marqueeBox) {
      const mx = Math.min(marqueeBox.x1, marqueeBox.x2);
      const my = Math.min(marqueeBox.y1, marqueeBox.y2);
      const mw = Math.abs(marqueeBox.x2 - marqueeBox.x1);
      const mh = Math.abs(marqueeBox.y2 - marqueeBox.y1);

      if (mw > 4 || mh > 4) {
        const intersectedIds = project.items
          .filter(
            (it) =>
              it.visible &&
              !it.locked &&
              it.x < mx + mw &&
              it.x + it.width > mx &&
              it.y < my + mh &&
              it.y + it.height > my
          )
          .map((it) => it.id);

        if (intersectedIds.length > 0) {
          if (e.shiftKey) {
            if (onSelectMultipleItemIds) {
              onSelectMultipleItemIds(intersectedIds, true);
            } else {
              onSelectItemId(intersectedIds[0], true);
            }
          } else {
            if (onSelectMultipleItemIds) {
              onSelectMultipleItemIds(intersectedIds, false);
            } else {
              onSelectItemId(intersectedIds[0]);
            }
          }
          showBriefToast(`🎯 Выделено ${intersectedIds.length} объектов (переносите вместе или Ctrl+C)`);
        } else if (!e.shiftKey) {
          onSelectItemId(null);
        }
      }
      setMarqueeBox(null);
    }

    interactionState.current = {
      mode: 'none',
      startX: 0,
      startY: 0,
      canvasStartX: 0,
      canvasStartY: 0
    };
    setIsInteracting(false);
  };

  // HTML5 Drag & Drop from Sidebar
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    const { x: cX, y: cY } = screenToCanvas(e.clientX, e.clientY);
    const snap = findSnapSlot(project.grids, cX, cY, 25);
    setHoveredSlot(snap);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const heroIdStr = e.dataTransfer.getData('text/plain');
    const heroId = parseInt(heroIdStr, 10);
    if (isNaN(heroId)) return;

    const { x: cX, y: cY } = screenToCanvas(e.clientX, e.clientY);
    const snap = findSnapSlot(project.grids, cX, cY, 30);

    if (snap) {
      // Assign to snapped slot
      onUpdateProject((prev) => ({
        ...prev,
        grids: prev.grids.map((grid) => {
          if (grid.id === snap.gridId) {
            return {
              ...grid,
              slots: grid.slots.map((s) => (s.id === snap.slot.id ? { ...s, heroId } : s))
            };
          }
          return grid;
        })
      }));
      onSelectSlot({ gridId: snap.gridId, slotId: snap.slot.id });
    } else {
      // Freeform placement: create a freeform movable hero card at drop location!
      const hero = HEROES_BY_ID.get(heroId);
      const newFreeHero: CanvasItem = {
        id: `hero_card_${heroId}_${Date.now()}`,
        name: hero?.displayName || `Hero #${heroId}`,
        type: 'hero',
        x: Math.round(cX - 27),
        y: Math.round(cY - 38),
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

      onUpdateProject((prev) => ({
        ...prev,
        items: [...prev.items, newFreeHero]
      }));
      onSelectItemId(newFreeHero.id);
      showBriefToast(`✨ Свободная карточка героя ${hero?.displayName || heroId} создана на холсте`);
    }
    setHoveredSlot(null);
    onClearDraggingHero();
  };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`relative w-full h-full overflow-hidden bg-[#0B0E14] select-none ${
        currentTool === 'pan' || isSpacePressed || isCtrlPressed
          ? isInteracting
            ? 'cursor-grabbing'
            : 'cursor-grab'
          : 'cursor-default'
      }`}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />

      {/* Floating Action Toast */}
      {toast && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-[#0F172A]/95 backdrop-blur-md border border-[#38BDF8]/60 text-[#38BDF8] px-4 py-2 rounded-full text-xs font-semibold shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-150 pointer-events-none">
          <span>{toast.text}</span>
        </div>
      )}
    </div>
  );
};

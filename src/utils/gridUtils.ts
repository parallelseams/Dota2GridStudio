import { GridGroup, GridSlot, ProjectState, DotaHeroGridConfigFile, CanvasItem } from '../types/dota';
import { DOTA_HEROES, HEROES_BY_ID } from '../data/dotaHeroes';

export function createDefaultMainGrid(
  canvasWidth = 2560,
  canvasHeight = 1440,
  cols = 35,
  rows = 7,
  slotWidth = 54,
  slotHeight = 76,
  gapX = 6,
  gapY = 6
): GridGroup {
  const totalGridWidth = cols * slotWidth + (cols - 1) * gapX;
  const totalGridHeight = rows * slotHeight + (rows - 1) * gapY;
  
  // Center horizontally, positioned in upper/mid region
  const startX = Math.round((canvasWidth - totalGridWidth) / 2);
  const startY = 200;

  const slots: GridSlot[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const index = r * cols + c;
      const x = startX + c * (slotWidth + gapX);
      const y = startY + r * (slotHeight + gapY);

      // Pre-fill default heroes for immediate visual delight if available
      const assignedHero = index < DOTA_HEROES.length ? DOTA_HEROES[index].id : null;

      slots.push({
        id: `main_slot_${r}_${c}`,
        col: c,
        row: r,
        x,
        y,
        width: slotWidth,
        height: slotHeight,
        heroId: assignedHero,
        isBan: false,
        label: undefined,
        locked: false
      });
    }
  }

  return {
    id: 'main_35x7_grid',
    name: `Main Hero Grid (${cols}×${rows} = ${cols * rows} slots)`,
    cols,
    rows,
    slotWidth,
    slotHeight,
    gapX,
    gapY,
    x: startX,
    y: startY,
    slotBorderColor: '#3b4252',
    slotBgColor: '#161922',
    slotBorderRadius: 4,
    isBanGrid: false,
    locked: false,
    visible: true,
    slots
  };
}

export function createDefaultBanGrid(
  canvasWidth = 2560,
  canvasHeight = 1440,
  banCount = 10,
  slotWidth = 58,
  slotHeight = 44,
  gapX = 8
): GridGroup {
  const totalWidth = banCount * slotWidth + (banCount - 1) * gapX;
  const startX = Math.round((canvasWidth - totalWidth) / 2);
  const startY = 1200; // Bottom region in 2K space

  const slots: GridSlot[] = [];

  for (let i = 0; i < banCount; i++) {
    const x = startX + i * (slotWidth + gapX);
    slots.push({
      id: `ban_slot_${i}`,
      col: i,
      row: 0,
      x,
      y: startY,
      width: slotWidth,
      height: slotHeight,
      heroId: null,
      isBan: true,
      label: `BAN ${i + 1}`,
      locked: false
    });
  }

  return {
    id: 'ban_grid_default',
    name: `Ban Slots (${banCount} Slots)`,
    cols: banCount,
    rows: 1,
    slotWidth,
    slotHeight,
    gapX,
    gapY: 0,
    x: startX,
    y: startY,
    slotBorderColor: '#dc2626',
    slotBgColor: '#2b1114',
    slotBorderRadius: 4,
    isBanGrid: true,
    locked: false,
    visible: true,
    slots
  };
}

export function createDefaultProject(): ProjectState {
  const canvasWidth = 2560; // 2K Quad HD Standard
  const canvasHeight = 1440; // 2K Quad HD Standard

  const mainGrid = createDefaultMainGrid(canvasWidth, canvasHeight, 35, 7, 54, 76, 6, 6);
  const banGrid = createDefaultBanGrid(canvasWidth, canvasHeight, 10, 58, 44, 8);

  const defaultItems: CanvasItem[] = [
    {
      id: 'title_header',
      name: 'Studio Header Title',
      type: 'text',
      x: 1280,
      y: 75,
      width: 1000,
      height: 70,
      rotation: 0,
      opacity: 1,
      locked: false,
      visible: true,
      zIndex: 10,
      text: 'DOTA 2 HERO GRID STUDIO',
      fontSize: 38,
      fontFamily: 'Cinzel, Georgia, serif',
      fontWeight: 'bold',
      fontStyle: 'normal',
      textAlign: 'center',
      textColor: '#f59e0b',
      textGlow: 'rgba(245, 158, 11, 0.45)',
      textGlowBlur: 16
    },
    {
      id: 'subtitle_text',
      name: 'Category Tagline',
      type: 'text',
      x: 1280,
      y: 135,
      width: 800,
      height: 34,
      rotation: 0,
      opacity: 0.85,
      locked: false,
      visible: true,
      zIndex: 11,
      text: '2K STANDARD STRATEGY LAYOUT (245 SLOTS)',
      fontSize: 15,
      fontFamily: 'Inter, system-ui, sans-serif',
      fontWeight: '600',
      fontStyle: 'normal',
      textAlign: 'center',
      textColor: '#94a3b8'
    },
    {
      id: 'ban_header_text',
      name: 'Ban Section Label',
      type: 'text',
      x: 1280,
      y: 1145,
      width: 500,
      height: 36,
      rotation: 0,
      opacity: 1,
      locked: false,
      visible: true,
      zIndex: 12,
      text: '🚫 PRIORITY BANS & DISRUPTORS',
      fontSize: 18,
      fontFamily: 'Cinzel, Georgia, serif',
      fontWeight: 'bold',
      textAlign: 'center',
      textColor: '#ef4444',
      textGlow: 'rgba(239, 68, 68, 0.5)',
      textGlowBlur: 12
    }
  ];

  return {
    id: 'project_' + Date.now(),
    title: 'Dota 2 2K Strategy Hero Grid',
    canvasWidth,
    canvasHeight,
    canvasBgColor: '#0c0e14',
    background: {
      imageUrl: null,
      opacity: 0.6,
      scaleMode: 'fit',
      locked: false,
      visible: true,
      x: 0,
      y: 0,
      width: canvasWidth,
      height: canvasHeight,
      brightness: 100,
      blur: 0
    },
    grids: [mainGrid, banGrid],
    items: defaultItems,
    snapToGrid: true,
    snapThreshold: 18,
    showRulers: true,
    showGridLines: true,
    showHeroNames: false,
    showHeroTiers: true,
    cardStyle: 'portrait',
    exportMode: 'column_preserve'
  };
}

// Find closest slot within snap radius
export function findSnapSlot(
  grids: GridGroup[],
  canvasX: number,
  canvasY: number,
  threshold = 20
): { gridId: string; slot: GridSlot; distance: number } | null {
  let closest: { gridId: string; slot: GridSlot; distance: number } | null = null;
  let minDistance = threshold;

  for (const grid of grids) {
    if (!grid.visible || grid.locked) continue;

    for (const slot of grid.slots) {
      if (slot.locked) continue;
      
      const slotCenterX = slot.x + slot.width / 2;
      const slotCenterY = slot.y + slot.height / 2;

      // Check if point is inside slot bounds
      if (
        canvasX >= slot.x &&
        canvasX <= slot.x + slot.width &&
        canvasY >= slot.y &&
        canvasY <= slot.y + slot.height
      ) {
        return { gridId: grid.id, slot, distance: 0 };
      }

      // Check center distance
      const dist = Math.hypot(canvasX - slotCenterX, canvasY - slotCenterY);
      if (dist < minDistance) {
        minDistance = dist;
        closest = { gridId: grid.id, slot, distance: dist };
      }
    }
  }

  return closest;
}

// Helper to generate custom Hero Grid Box (e.g. 3x3, 4x2, or custom dimension)
export function createCustomHeroBox(
  startX: number,
  startY: number,
  cols = 3,
  rows = 3,
  slotWidth = 48,
  slotHeight = 30,
  gapX = 4,
  gapY = 4,
  name = 'Custom Hero Box'
): GridGroup {
  const slots: GridSlot[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = startX + c * (slotWidth + gapX);
      const y = startY + r * (slotHeight + gapY);

      slots.push({
        id: `box_slot_${Date.now()}_${r}_${c}`,
        col: c,
        row: r,
        x,
        y,
        width: slotWidth,
        height: slotHeight,
        heroId: null,
        isBan: false,
        locked: false
      });
    }
  }

  return {
    id: 'grid_box_' + Date.now(),
    name,
    cols,
    rows,
    slotWidth,
    slotHeight,
    gapX,
    gapY,
    x: startX,
    y: startY,
    slotBorderColor: '#38BDF8',
    slotBgColor: '#121824',
    slotBorderRadius: 4,
    isBanGrid: false,
    locked: false,
    visible: true,
    slots
  };
}

// Helper to sanitize Dota 2 category names so Source 2 / Panorama fonts display cleanly
function sanitizeDotaCategoryName(name: string): string {
  if (!name) return ' ';
  // Strip variation selectors (\uFE0F) and zero-width codes
  const cleaned = name.replace(/[\uFE00-\uFE0F\u200B-\u200D\uFFF0-\uFFFF]/g, '');
  return cleaned.length > 0 ? cleaned : ' ';
}

// Export to exact native Dota 2 hero_grid_config.json
export function exportToDotaGridConfig(project: ProjectState): DotaHeroGridConfigFile {
  const categories: Array<{
    category_name: string;
    x_position: number;
    y_position: number;
    width: number;
    height: number;
    hero_ids: number[];
  }> = [];

  // Dota 2 standard hero selection layout viewport coordinates (1200 x 700)
  const scaleX = 1200 / project.canvasWidth;
  const scaleY = 700 / project.canvasHeight;

  // 1. Export all Grid Groups (Main 35x7, Bans, and any Custom Hero Boxes)
  project.grids.forEach((grid) => {
    if (!grid.visible) return;

    const assignedSlots = grid.slots.filter((s) => s.heroId !== null);
    if (assignedSlots.length === 0 && !grid.isBanGrid) return;

    // Check if multi-column grid needs column preservation (prevents Dota 2 auto-wrapping rows)
    const isMultiColMatrix = grid.cols > 1 && grid.rows > 1;

    if (isMultiColMatrix && project.exportMode !== 'single_category') {
      // Export each column as a precise vertical column category so Dota 2 NEVER squishes or wraps into unwanted rows
      for (let c = 0; c < grid.cols; c++) {
        const colSlots = grid.slots
          .filter((s) => s.col === c && s.heroId !== null)
          .sort((a, b) => a.row - b.row);

        if (colSlots.length === 0) continue;

        const colX = grid.x + c * (grid.slotWidth + grid.gapX);
        const colHeroIds = colSlots.map((s) => s.heroId!);

        // Only first column gets the category title (or empty space for subsequent columns)
        const catName = c === 0 ? sanitizeDotaCategoryName(grid.name.toUpperCase()) : ' ';

        // CRITICAL FOR DOTA 2: Each hero card vertically requires at least 74px + 32px category header.
        // If height is smaller, Dota 2 squishes rows into tiny micro-icons.
        const dotaColWidth = Math.max(54, Math.round(grid.slotWidth * scaleX));
        const dotaColHeight = Math.max(colSlots.length * 76 + 32, Math.round((grid.rows * (grid.slotHeight + grid.gapY)) * scaleY));

        categories.push({
          category_name: catName,
          x_position: Math.max(0, Math.round(colX * scaleX)),
          y_position: Math.max(0, Math.round(grid.y * scaleY)),
          width: dotaColWidth,
          height: dotaColHeight,
          hero_ids: colHeroIds
        });
      }
    } else {
      // Single row or combined category export (ordered row-by-row)
      const sortedSlots = [...assignedSlots].sort((a, b) => {
        if (a.row !== b.row) return a.row - b.row;
        return a.col - b.col;
      });

      const heroIds: number[] = [];
      sortedSlots.forEach((s) => {
        if (s.heroId && !heroIds.includes(s.heroId)) {
          heroIds.push(s.heroId);
        }
      });

      const dotaGridWidth = Math.max(grid.cols * 54 + (grid.cols - 1) * 6, Math.round((grid.cols * grid.slotWidth + (grid.cols - 1) * grid.gapX) * scaleX));
      const dotaGridHeight = Math.max(grid.rows * 76 + 32, Math.round((grid.rows * grid.slotHeight + (grid.rows - 1) * grid.gapY) * scaleY));

      categories.push({
        category_name: sanitizeDotaCategoryName(grid.isBanGrid ? 'PRIORITY BANS' : grid.name.toUpperCase()),
        x_position: Math.max(0, Math.round(grid.x * scaleX)),
        y_position: Math.max(0, Math.round(grid.y * scaleY)),
        width: dotaGridWidth,
        height: dotaGridHeight,
        hero_ids: heroIds
      });
    }
  });

  // 2. Export all Canvas Items (Freeform Heroes, Symbols, Sticks/Lines, ASCII Boxes, Rectangles, Text Labels)
  project.items.forEach((item) => {
    if (!item.visible) return;
    if (item.exportToDota === false) return; // User explicitly excluded this item

    // A. Freeform Hero Items
    if (item.type === 'hero' && item.heroId) {
      // Use clean empty space if no explicit category name is set to avoid large unwanted hero title
      const catTitle = item.dotaCategoryName ? sanitizeDotaCategoryName(item.dotaCategoryName) : ' ';
      categories.push({
        category_name: catTitle,
        x_position: Math.max(0, Math.round(item.x * scaleX)),
        y_position: Math.max(0, Math.round(item.y * scaleY)),
        width: Math.max(54, Math.round(item.width * scaleX)),
        height: Math.max(76, Math.round(item.height * scaleY)),
        hero_ids: [item.heroId]
      });
      return;
    }

    // B. Multi-line Text Items (Dota 2 Panorama category headers do not support newlines; export line-by-line)
    if (item.type === 'text') {
      const fullText = item.text || item.name || '';
      const lines = fullText.split('\n');
      const lineStep = lines.length > 1 ? Math.max(item.height / lines.length, (item.fontSize || 18) * 1.35) : 32;

      lines.forEach((line, lineIdx) => {
        const cleanLine = sanitizeDotaCategoryName(line);
        if (!cleanLine.trim()) return;

        // CRITICAL FOR DOTA 2: Category headers require ample width (>= 500px)
        // so Dota 2 Panorama UI never truncates or cuts off characters or Japanese/Cyrillic words!
        const dotaTextWidth = Math.max(550, Math.round(item.width * scaleX * 1.6), cleanLine.length * 22);

        categories.push({
          category_name: cleanLine,
          x_position: Math.max(0, Math.round(item.x * scaleX)),
          y_position: Math.max(0, Math.round((item.y + lineIdx * lineStep) * scaleY)),
          width: dotaTextWidth,
          height: 28,
          hero_ids: []
        });
      });
      return;
    }

    // C. Icons / Symbols / Stars
    if (item.type === 'icon') {
      const symbolText = item.dotaCategoryName || item.iconChar || item.text || '★';
      const cleanSymbol = sanitizeDotaCategoryName(symbolText);
      categories.push({
        category_name: cleanSymbol,
        x_position: Math.max(0, Math.round(item.x * scaleX)),
        y_position: Math.max(0, Math.round(item.y * scaleY)),
        width: Math.max(550, Math.round(item.width * scaleX), cleanSymbol.length * 24),
        height: 28,
        hero_ids: []
      });
      return;
    }

    // D. Lines / Sticks / Dividers
    if (item.type === 'line') {
      const repeatCount = Math.max(8, Math.round((item.width * scaleX) / 8));
      const lineChars = item.text || '─'.repeat(repeatCount);
      const cleanLine = sanitizeDotaCategoryName(lineChars);
      categories.push({
        category_name: cleanLine,
        x_position: Math.max(0, Math.round(item.x * scaleX)),
        y_position: Math.max(0, Math.round(item.y * scaleY)),
        width: Math.max(550, Math.round(item.width * scaleX), cleanLine.length * 20),
        height: 28,
        hero_ids: []
      });
      return;
    }

    // E. Rectangles / Frames / Captured Hero Groups
    if (item.type === 'rect') {
      let heroIds: number[] = item.dotaHeroIds ? [...item.dotaHeroIds] : [];

      if (item.autoCaptureHeroes !== false && heroIds.length === 0) {
        const itemMinX = item.x;
        const itemMaxX = item.x + item.width;
        const itemMinY = item.y;
        const itemMaxY = item.y + item.height;

        project.grids.forEach((grid) => {
          grid.slots.forEach((slot) => {
            if (slot.heroId) {
              const slotCenterX = slot.x + slot.width / 2;
              const slotCenterY = slot.y + slot.height / 2;

              if (
                slotCenterX >= itemMinX &&
                slotCenterX <= itemMaxX &&
                slotCenterY >= itemMinY &&
                slotCenterY <= itemMaxY
              ) {
                if (!heroIds.includes(slot.heroId)) {
                  heroIds.push(slot.heroId);
                }
              }
            }
          });
        });
      }

      let categoryName = '';
      if (item.dotaCategoryName) {
        categoryName = sanitizeDotaCategoryName(item.dotaCategoryName);
      } else if (item.text) {
        categoryName = sanitizeDotaCategoryName(item.text);
      } else if (heroIds.length > 0) {
        categoryName = sanitizeDotaCategoryName(`[ ${item.name || 'HERO GROUP'} ]`);
      } else {
        const frameRepeat = Math.max(8, Math.round((item.width * scaleX) / 10));
        categoryName = sanitizeDotaCategoryName(`┌${'─'.repeat(frameRepeat)}┐`);
      }

      if (categoryName.trim().length > 0) {
        categories.push({
          category_name: categoryName,
          x_position: Math.max(0, Math.round(item.x * scaleX)),
          y_position: Math.max(0, Math.round(item.y * scaleY)),
          width: Math.max(48, Math.round(item.width * scaleX)),
          height: Math.max(24, Math.round(item.height * scaleY)),
          hero_ids: heroIds
        });
      }
    }
  });

  return {
    version: 3,
    configs: [
      {
        config_name: project.title || 'Custom Grid Layout',
        categories
      }
    ]
  };
}

// Auto-fill algorithms
export function autoFillGrid(
  grid: GridGroup,
  type: 'alphabetical' | 'attribute' | 'clear' | 'reverse' | 'roles'
): GridSlot[] {
  const slots = grid.slots.map((s) => ({ ...s }));

  if (type === 'clear') {
    slots.forEach((s) => {
      s.heroId = null;
    });
    return slots;
  }

  let sortedHeroes = [...DOTA_HEROES];

  if (type === 'alphabetical') {
    sortedHeroes.sort((a, b) => a.displayName.localeCompare(b.displayName));
  } else if (type === 'attribute') {
    const attrOrder = { str: 0, agi: 1, int: 2, all: 3 };
    sortedHeroes.sort((a, b) => {
      const orderDiff = attrOrder[a.primaryAttr] - attrOrder[b.primaryAttr];
      if (orderDiff !== 0) return orderDiff;
      return a.displayName.localeCompare(b.displayName);
    });
  } else if (type === 'roles') {
    sortedHeroes.sort((a, b) => {
      const aIsCarry = a.roles.includes('Carry') ? 0 : 1;
      const bIsCarry = b.roles.includes('Carry') ? 0 : 1;
      if (aIsCarry !== bIsCarry) return aIsCarry - bIsCarry;
      return a.displayName.localeCompare(b.displayName);
    });
  } else if (type === 'reverse') {
    sortedHeroes.reverse();
  }

  slots.forEach((slot, idx) => {
    slot.heroId = idx < sortedHeroes.length ? sortedHeroes[idx].id : null;
  });

  return slots;
}
